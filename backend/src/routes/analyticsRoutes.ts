// routes/analyticsRoutes.ts
import express from "express"
import { DonationRequest, CompletedOrder,FoodBank, FoodItem, Review, User, Restaurant, Location } from "../models"
import dayjs from "dayjs"
import mongoose from "mongoose"



const router = express.Router()

router.get("/foodbank/summary/:foodbankId", async (req : any , res:any ) => {
  const { foodbankId } = req.params


  try {
    const foodbank = await FoodBank.findById(foodbankId)
    if (!foodbank) return res.status(404).json({ message: "Foodbank not found" })

    const foodbankUser = await User.findById(foodbank.user_id)
    if (!foodbankUser) return res.status(404).json({ message: "Foodbank's user not found" })

    // 1. Get Completed Orders linked to this foodbank
    const completedOrders = await CompletedOrder.find()
      .populate({
        path: "food_id",
        model: "FoodItem"
      })

    const relevantOrders = await Promise.all(
      completedOrders.map(async (order) => {
        const exists = await DonationRequest.exists({
          food_id: order.food_id._id,
          foodbank_id: foodbankId,
          status: "accepted"
        })
        return exists ? order : null
      })
    )

    const filteredOrders = relevantOrders.filter((order) => order !== null) as typeof completedOrders

    const totalDonations = filteredOrders.length

    // 2. Count unique restaurants
    const restaurantSet = new Set<string>()
    filteredOrders.forEach((order) => {
      const food = order.food_id as any
      if (food && food.restaurant_id) {
        restaurantSet.add(food.restaurant_id.toString())
      }
    })
    const totalRestaurants = restaurantSet.size

    // 3. Average rating
    const reviews = await Review.find({ foodbank_id: foodbankId })
    const avgRating =
      reviews.length > 0
        ? parseFloat(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          )
        : 0

    res.json({
      totalDonations,
      totalRestaurants,
      avgRating
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/foodbank/top-restaurants/:foodbankId", async (req, res) => {
    const { foodbankId } = req.params;
  
  
    try {
      // Step 1: Find all completed orders
      const completedOrders = await CompletedOrder.find()
        .populate("food_id") // To access food.restaurant_id
        .exec();
  
      // Step 2: Filter only those accepted by this food bank
      const relevantOrders = await Promise.all(
        completedOrders.map(async (order) => {
          const match = await DonationRequest.exists({
            food_id: order.food_id._id,
            foodbank_id: foodbankId,
            status: "accepted",
          });
          return match ? order : null;
        })
      );
  
      const filtered = relevantOrders.filter((order) => order !== null) as typeof completedOrders;
  
      // Step 3: Count by restaurant_id
      const countMap = new Map<string, number>();
  
      for (const order of filtered) {
        const food = order.food_id as any;
        const restaurantId = food.restaurant_id.toString();
        countMap.set(restaurantId, (countMap.get(restaurantId) || 0) + 1);
      }
  
      // Step 4: Fetch restaurant names
      const restaurantData = await Promise.all(
        Array.from(countMap.entries()).map(async ([id, count]) => {
          const restaurant = await Restaurant.findById(id).populate("user_id");
          return {
            name: (restaurant?.user_id as any)?.name || "Unknown",
            count,
          };
        })
      );
  
      // Step 5: Sort and take top 5
      const topRestaurants = restaurantData
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
  
      res.json(topRestaurants);
    } catch (err) {
      console.error("❌ Error in top restaurants API:", err);
      res.status(500).json({ message: "Server error" });
    }
  });



// GET /api/analytics/foodbank/category-breakdown/:foodbankId
router.get("/foodbank/category-breakdown/:foodbankId", async (req, res) => {
    const { foodbankId } = req.params;
  
  
    try {
      // Step 1: Find all accepted donation requests for this foodbank
      const donationRequests = await DonationRequest.find({
        foodbank_id: foodbankId,
        status: "accepted",
      }).populate("food_id");
  
      // Step 2: Count categories
      const categoryCount: Record<string, number> = {};
  
      donationRequests.forEach((request) => {
        const food = request.food_id as any;
        if (food && food.category) {
          const cat = food.category;
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        }
      });
  
      // Step 3: Convert to array format
      const result = Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count,
      }));
  
      res.json(result);
    } catch (err) {
      console.error("❌ Error fetching category breakdown:", err);
      res.status(500).json({ message: "Server error" });
    }
  });


router.get("/foodbank/donations-chart/:foodbankId", async (req:any, res:any) => {
  const { foodbankId } = req.params
  const range = req.query.range || "month"

  try {
    const completedOrders = await CompletedOrder.find()
      .populate("food_id")
      .exec()

    const relevantOrders = await Promise.all(
      completedOrders.map(async (order) => {
        const match = await DonationRequest.exists({
          food_id: order.food_id._id,
          foodbank_id: foodbankId,
          status: "accepted",
        })
        return match ? order : null
      })
    )

    const filtered = relevantOrders.filter((order) => order !== null)

    const now = dayjs()

    let labels: string[] = []
    let counts: number[] = []

    if (range === "week") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      counts = new Array(7).fill(0)

      filtered.forEach((order) => {
        const day = dayjs(order!.completed_at).day()
        const index = (day + 6) % 7 // dayjs: Sun=0, so we shift
        counts[index]++
      })
    } else if (range === "month") {
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
      counts = new Array(4).fill(0)

      filtered.forEach((order) => {
        const week = Math.min(Math.floor(dayjs(order!.completed_at).date() / 7), 3)
        counts[week]++
      })
    } else {
      labels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ]
      counts = new Array(12).fill(0)

      filtered.forEach((order) => {
        const month = dayjs(order!.completed_at).month()
        counts[month]++
      })
    }

    return res.json({ labels, counts })
  } catch (error) {
    console.error("❌ Error generating donation chart data:", error)
    return res.status(500).json({ message: "Server error" })
  }
})


router.get("/foodbank/reviews-chart/:foodbankId", async (req, res) => {
  const { foodbankId } = req.params;
  const range = req.query.range || "month"; // "week" | "month" | "year"
  const now = dayjs();

  try {
    const startDate = range === "week"
      ? now.subtract(6, "day")
      : range === "month"
      ? now.subtract(1, "month")
      : now.subtract(1, "year");

    const matchStage = {
      $match: {
        foodbank_id: new mongoose.Types.ObjectId(foodbankId),
        created_at: { $gte: startDate.toDate() },
      },
    };

    let groupStage: any;
    let labels: string[] = [];
    let bucketCount = 0;

    if (range === "week") {
      groupStage = {
        $group: {
          _id: { $dayOfWeek: "$created_at" }, // 1 = Sunday, 7 = Saturday
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      };
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      bucketCount = 7;
    } else if (range === "month") {
      groupStage = {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: [{ $dayOfMonth: "$created_at" }, 7] }, then: "Week 1" },
                { case: { $lte: [{ $dayOfMonth: "$created_at" }, 14] }, then: "Week 2" },
                { case: { $lte: [{ $dayOfMonth: "$created_at" }, 21] }, then: "Week 3" },
              ],
              default: "Week 4",
            },
          },
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      };
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      bucketCount = 4;
    } else {
      groupStage = {
        $group: {
          _id: { $month: "$created_at" }, // 1–12
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      };
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      bucketCount = 12;
    }

    const reviews = await Review.aggregate([
      matchStage,
      groupStage,
      { $sort: { _id: 1 } },
    ]);

    // Normalize into map for easy lookup
    const ratingMap: Record<string, number> = {};
    const countMap: Record<string, number> = {};

    reviews.forEach((entry) => {
      const key = typeof entry._id === "number"
        ? range === "year"
          ? labels[entry._id - 1] // month index 1–12
          : labels[entry._id === 1 ? 6 : entry._id - 2] // for dayOfWeek (1=Sun, 7=Sat)
        : entry._id;
      ratingMap[key] = parseFloat(entry.avgRating.toFixed(2));
      countMap[key] = entry.totalReviews;
    });

    const ratings = labels.map((label) => ratingMap[label] || 0);
    const counts = labels.map((label) => countMap[label] || 0);

    res.json({ labels, ratings, counts });
  } catch (err) {
    console.error("❌ Error fetching review chart data:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/foodbank/pickup-map/:foodbankId", async (req:any, res:any) => {
  const { foodbankId } = req.params;

  try {
    const foodbank = await FoodBank.findById(foodbankId);
    if (!foodbank) return res.status(404).json({ message: "Foodbank not found" });

    const user = await User.findById(foodbank.user_id);
    if (!user || !user.location_id) {
      return res.status(404).json({ message: "Foodbank user or location ID missing" });
    }

    const location = await Location.findById(user.location_id);
    if (!location || !location.latitude || !location.longitude) {
      return res.status(404).json({ message: "Location not found or incomplete" });
    }

    const foodbankCoords: [number, number] = [
      parseFloat(location.longitude.toString()),
      parseFloat(location.latitude.toString()),
    ];

    const completedOrders = await CompletedOrder.find().populate("food_id").exec();

    const relevantOrders = await Promise.all(
      completedOrders.map(async (order) => {
        const match = await DonationRequest.exists({
          food_id: order.food_id._id,
          foodbank_id: foodbankId,
          status: "accepted",
        });
        return match ? order : null;
      })
    );

    const filteredOrders = relevantOrders.filter((o) => o !== null);

    const restaurantIds = new Set(
      filteredOrders.map((order) => (order.food_id as any)?.restaurant_id?.toString())
    );

    const restaurants = await Restaurant.find({ _id: { $in: Array.from(restaurantIds) } });

    const enriched = await Promise.all(
      restaurants.map(async (r: any) => {
        const loc = await Location.findById(r.location_id);
        if (!loc || !loc.latitude || !loc.longitude) return null;

        const lat = parseFloat(loc.latitude.toString());
        const lng = parseFloat(loc.longitude.toString());

        const toRadians = (deg: number) => (deg * Math.PI) / 180;
        const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371;
          const dLat = toRadians(lat2 - lat1);
          const dLon = toRadians(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        const distance = haversine(foodbankCoords[1], foodbankCoords[0], lat, lng);

        return {
          name: r.name,
          coordinates: [lat, lng],
          distance,
        };
      })
    );

    const cleaned = enriched.filter((r) => r !== null) as {
      name: string;
      coordinates: [number, number];
      distance: number;
    }[];

    const avgDistance =
      cleaned.length > 0
        ? parseFloat((cleaned.reduce((sum, r) => sum + r.distance, 0) / cleaned.length).toFixed(2))
        : 0;

    res.json({
      foodbankLocation: {
        coordinates: [foodbankCoords[1], foodbankCoords[0]],
      },
      restaurants: cleaned,
      avgDistance,
    });
  } catch (err) {
    console.error("❌ Error generating pickup map:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router
