import { Request, Response } from 'express';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import {
  DonationRequest,
  CompletedOrder,
  FoodBank,
  Review,
  User,
  Restaurant,
  FoodItem,
  Location
} from '../models';

export const getFoodbankSummary = async (req: any,res: any)=> {
  const { foodbankId } = req.params;
  try {
    const foodbank = await FoodBank.findById(foodbankId);
    if (!foodbank) return res.status(404).json({ message: 'Foodbank not found' });

    const foodbankUser = await User.findById(foodbank.user_id);
    if (!foodbankUser) return res.status(404).json({ message: "Foodbank's user not found" });

    const completedOrders = await CompletedOrder.find()
      .populate({ path: 'food_id', model: 'FoodItem' });
    const relevant = await Promise.all(
      completedOrders.map(async order =>
        (await DonationRequest.exists({
          food_id: (order.food_id as any)._id,
          foodbank_id: foodbankId,
          status: 'accepted'
        }))
          ? order
          : null
      )
    );
    const filtered = relevant.filter(o => o) as typeof completedOrders;
    const totalDonations = filtered.length;

    const restaurantSet = new Set(
      filtered.map(o => (o.food_id as any).restaurant_id.toString())
    );
    const totalRestaurants = restaurantSet.size;

    const reviews = await Review.find({ foodbank_id: foodbankId });
    const avgRating = reviews.length
      ? parseFloat(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        )
      : 0;

    res.json({ totalDonations, totalRestaurants, avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTopRestaurants = async (req: Request, res: Response) => {
  const { foodbankId } = req.params;
  try {
    const completedOrders = await CompletedOrder.find().populate('food_id').exec();
    const relevant = await Promise.all(
      completedOrders.map(async order =>
        (await DonationRequest.exists({
          food_id: (order.food_id as any)._id,
          foodbank_id: foodbankId,
          status: 'accepted'
        }))
          ? order
          : null
      )
    );
    const filtered = relevant.filter(o => o) as typeof completedOrders;

    const countMap = new Map<string, number>();
    filtered.forEach(o => {
      const restId = (o.food_id as any).restaurant_id.toString();
      countMap.set(restId, (countMap.get(restId) || 0) + 1);
    });

    const data = await Promise.all(
      Array.from(countMap.entries()).map(async ([id, count]) => {
        const rest = await Restaurant.findById(id).populate('user_id');
        const user = rest?.user_id as any;
        return {
          name: user?.name || 'Unknown',
          count
        };
      })
    );

    const top5 = data.sort((a, b) => b.count - a.count).slice(0, 5);
    res.json(top5);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategoryBreakdown = async (req: Request, res: Response) => {
  const { foodbankId } = req.params;
  try {
    const donationRequests = await DonationRequest.find({
      foodbank_id: foodbankId,
      status: 'accepted'
    }).populate('food_id');

    const categoryCount: Record<string, number> = {};
    donationRequests.forEach(r => {
      const food = r.food_id as any;
      if (food?.category) {
        categoryCount[food.category] = (categoryCount[food.category] || 0) + 1;
      }
    });

    const result = Object.entries(categoryCount).map(([category, count]) => ({ category, count }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDonationsChart = async (req: Request, res: Response) => {
  const { foodbankId } = req.params;
  const range = (req.query.range as string) || 'month';
  try {
    const completedOrders = await CompletedOrder.find().populate('food_id').exec();
    const relevant = await Promise.all(
      completedOrders.map(async order =>
        (await DonationRequest.exists({
          food_id: (order.food_id as any)._id,
          foodbank_id: foodbankId,
          status: 'accepted'
        }))
          ? order
          : null
      )
    );
    const filtered = relevant.filter(o => o) as typeof completedOrders;

    let labels: string[];
    let counts: number[];

    if (range === 'week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      counts = new Array(7).fill(0);
      filtered.forEach(o => {
        counts[(dayjs(o.completed_at).day() + 6) % 7]++;
      });
    } else if (range === 'month') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      counts = new Array(4).fill(0);
      filtered.forEach(o => {
        counts[Math.min(Math.floor(dayjs(o.completed_at).date() / 7), 3)]++;
      });
    } else {
      labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      counts = new Array(12).fill(0);
      filtered.forEach(o => {
        counts[dayjs(o.completed_at).month()]++;
      });
    }

    res.json({ labels, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReviewsChart = async (req: Request, res: Response) => {
  const { foodbankId } = req.params;
  const range = (req.query.range as string) || 'month';
  const now = dayjs();

  try {
    const startDate =
      range === 'week'
        ? now.subtract(6, 'day')
        : range === 'month'
        ? now.subtract(1, 'month')
        : now.subtract(1, 'year');

    const matchStage = { $match: { foodbank_id: new mongoose.Types.ObjectId(foodbankId), created_at: { $gte: startDate.toDate() } } };
    let groupStage: any;
    let labels: string[];

    if (range === 'week') {
      groupStage = { $group: { _id: { $dayOfWeek: '$created_at' }, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } };
      labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    } else if (range === 'month') {
      groupStage = { $group: { _id: { $switch: { branches: [ { case: { $lte: [{ $dayOfMonth: '$created_at' }, 7] }, then: 'Week 1' }, { case: { $lte: [{ $dayOfMonth: '$created_at' }, 14] }, then: 'Week 2' }, { case: { $lte: [{ $dayOfMonth: '$created_at' }, 21] }, then: 'Week 3' } ], default: 'Week 4' } }, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } };
      labels = ['Week 1','Week 2','Week 3','Week 4'];
    } else {
      groupStage = { $group: { _id: { $month: '$created_at' }, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } };
      labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    }

    const agg = await Review.aggregate([matchStage, groupStage, { $sort: { _id: 1 } }]);
    const ratingMap: Record<string, number> = {};
    const countMap: Record<string, number> = {};
    agg.forEach(entry => {
      const key = typeof entry._id === 'number'
        ? range === 'week'
          ? labels[(entry._id + 5) % 7]
          : labels[entry._id - 1]
        : entry._id;
      ratingMap[key] = parseFloat(entry.avgRating.toFixed(2));
      countMap[key] = entry.totalReviews;
    });

    const ratings = labels.map(l => ratingMap[l] || 0);
    const counts = labels.map(l => countMap[l] || 0);
    res.json({ labels, ratings, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPickupMap = async (req:any,res:any)=> {
  const { foodbankId } = req.params;
  try {
    const foodbank = await FoodBank.findById(foodbankId);
    if (!foodbank) return res.status(404).json({ message: 'Foodbank not found' });

    const fbUser = await User.findById(foodbank.user_id);
    if (!fbUser?.location_id) return res.status(404).json({ message: 'Foodbank user or location ID missing' });

    const bankLoc = await Location.findById(fbUser.location_id);
    if (!bankLoc?.latitude || !bankLoc?.longitude) return res.status(404).json({ message: 'Location not found or incomplete' });

    const bankCoords: [number, number] = [
      parseFloat(bankLoc.latitude.toString()),
      parseFloat(bankLoc.longitude.toString())
    ];

    const completedOrders = await CompletedOrder.find().populate('food_id').exec();
    const relevant = await Promise.all(
      completedOrders.map(async order =>
        (await DonationRequest.exists({
          food_id: (order.food_id as any)._id,
          foodbank_id: foodbankId,
          status: 'accepted'
        }))
          ? order
          : null
      )
    );
    const filtered = relevant.filter(o => o) as typeof completedOrders;

    const restIds = Array.from(
      new Set(filtered.map(o => (o.food_id as any).restaurant_id.toString()))
    );

    const restaurants = await Restaurant.find({ _id: { $in: restIds } }).populate('user_id');
    const enriched = await Promise.all(
      restaurants.map(async r => {
        const user = r.user_id as any;
        if (!user?.location_id) return null;
        const loc = await Location.findById(user.location_id);
        if (!loc?.latitude || !loc?.longitude) return null;
        const lat = parseFloat(loc.latitude.toString());
        const lon = parseFloat(loc.longitude.toString());
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const dLat = toRad(lat - bankCoords[0]);
        const dLon = toRad(lon - bankCoords[1]);
        const a = Math.sin(dLat/2)**2 + Math.cos(toRad(bankCoords[0])) * Math.cos(toRad(lat)) * Math.sin(dLon/2)**2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = 6371 * c;
        return { name: user.name, coordinates: [lat, lon], distance: parseFloat(distance.toFixed(2)) };
      })
    );
    const cleaned = enriched.filter(r => r) as { name: string; coordinates: [number, number]; distance: number }[];
    const avgDistance = cleaned.length
      ? parseFloat((cleaned.reduce((sum, x) => sum + x.distance, 0) / cleaned.length).toFixed(2))
      : 0;

    res.json({ foodbankLocation: { coordinates: bankCoords }, restaurants: cleaned, avgDistance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRestaurantSummary = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  try {
    const foodItems = await FoodItem.find({ restaurant_id: restaurantId });
    const foodItemIds = foodItems.map(item => item._id);

    const completedRequests = await DonationRequest.find({
      food_id: { $in: foodItemIds },
      status: "accepted"
    });

    const foodbankIds = new Set(completedRequests.map(req => req.foodbank_id.toString()));

    const reviews = await Review.find({ restaurant_id: restaurantId });
    const avgRating = reviews.length
      ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2))
      : 0;

    res.json({
      totalItemsDonated: foodItems.length,
      totalFoodbanksContributed: foodbankIds.size,
      averageRating: avgRating
    });
  } catch (err) {
    console.error("❌ Error fetching restaurant summary:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getRestaurantCategoryBreakdown = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  try {
    const foodItems = await FoodItem.find({ restaurant_id: restaurantId });
    const foodIds = foodItems.map(item => item._id);

    const completedOrders = await CompletedOrder.find({ food_id: { $in: foodIds } }).populate("food_id");

    const categoryCount: Record<string, number> = {};
    completedOrders.forEach(order => {
      const food = order.food_id as any;
      if (food?.category) {
        categoryCount[food.category] = (categoryCount[food.category] || 0) + 1;
      }
    });

    const result = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching category breakdown:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getRestaurantOrdersChart = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const range = (req.query.range as string) || "month";
  const now = dayjs();

  try {
    const foodItems = await FoodItem.find({ restaurant_id: restaurantId });
    const foodIds = foodItems.map(item => item._id);

    const completedOrders = await CompletedOrder.find({ food_id: { $in: foodIds } });

    let labels: string[];
    let counts: number[];

    if (range === "week") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      counts = new Array(7).fill(0);
      completedOrders.forEach(o => {
        counts[(dayjs(o.completed_at).day() + 6) % 7]++;
      });
    } else if (range === "month") {
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      counts = new Array(4).fill(0);
      completedOrders.forEach(o => {
        counts[Math.min(Math.floor(dayjs(o.completed_at).date() / 7), 3)]++;
      });
    } else {
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      counts = new Array(12).fill(0);
      completedOrders.forEach(o => {
        counts[dayjs(o.completed_at).month()]++;
      });
    }

    res.json({ labels, counts });
  } catch (err) {
    console.error("❌ Error fetching restaurant orders chart:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getTopFoodbanks = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;

  try {
    const foodItems = await FoodItem.find({ restaurant_id: restaurantId });
    const foodItemIds = foodItems.map(item => item._id);

    const donationRequests = await DonationRequest.find({
      food_id: { $in: foodItemIds },
      status: 'accepted'
    }).populate('foodbank_id');

    const countMap = new Map<string, number>();
    donationRequests.forEach((req) => {
      const foodbank = req.foodbank_id as any;
      if (foodbank && foodbank._id) {
        const id = foodbank._id.toString();
        countMap.set(id, (countMap.get(id) || 0) + 1);
      }
    });

    const result = await Promise.all(
      Array.from(countMap.entries()).map(async ([id, count]) => {
        const fb = await FoodBank.findById(id).populate('user_id');
        const name = (fb?.user_id as any)?.name || "Unknown";
        return { name, count };
      })
    );

    const sorted = result.sort((a, b) => b.count - a.count).slice(0, 5);
    res.json(sorted);
  } catch (err) {
    console.error("❌ Error fetching top foodbanks:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRestaurantPickupMap = async (req: any, res: any) => {
  const { restaurantId } = req.params;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const user = await User.findById(restaurant.user_id);
    if (!user?.location_id) return res.status(404).json({ message: "Restaurant location missing" });

    const restLocation = await Location.findById(user.location_id);
    if (!restLocation?.latitude || !restLocation?.longitude)
      return res.status(404).json({ message: "Incomplete restaurant location" });

    const restaurantCoords: [number, number] = [
      parseFloat(restLocation.longitude.toString()),
      parseFloat(restLocation.latitude.toString()),
    ];

    const foodItems = await FoodItem.find({ restaurant_id: restaurantId });
    const foodIds = foodItems.map((f) => f._id);

    const acceptedRequests = await DonationRequest.find({
      food_id: { $in: foodIds },
      status: "accepted",
    });

    const uniqueFoodbankIds = Array.from(new Set(acceptedRequests.map((r) => r.foodbank_id.toString())));

    const foodbanks = await FoodBank.find({ _id: { $in: uniqueFoodbankIds } }).populate("user_id");

    const enriched = await Promise.all(
      foodbanks.map(async (fb) => {
        const fbUser = fb.user_id as any;
        if (!fbUser?.location_id) return null;

        const loc = await Location.findById(fbUser.location_id);
        if (!loc?.latitude || !loc?.longitude) return null;

        const lat = parseFloat(loc.latitude.toString());
        const lon = parseFloat(loc.longitude.toString());

        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const dLat = toRad(lat - restaurantCoords[1]);
        const dLon = toRad(lon - restaurantCoords[0]);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(restaurantCoords[1])) *
            Math.cos(toRad(lat)) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = 6371 * c;

        return {
          name: fbUser.name,
          coordinates: [lat, lon],
          distance: parseFloat(distance.toFixed(2)),
        };
      })
    );

    const cleaned = enriched.filter((x) => x) as {
      name: string;
      coordinates: [number, number];
      distance: number;
    }[];

    const avgDistance =
      cleaned.length > 0
        ? parseFloat((cleaned.reduce((sum, x) => sum + x.distance, 0) / cleaned.length).toFixed(2))
        : 0;

    res.json({
      restaurantLocation: {
        coordinates: [restaurantCoords[1], restaurantCoords[0]],
      },
      foodbanks: cleaned,
      avgDistance,
    });
  } catch (err) {
    console.error("❌ Error generating restaurant pickup map:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const getRestaurantReviewsChart = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const range = (req.query.range as string) || "month";
  const now = dayjs();

  try {
    const startDate =
      range === "week"
        ? now.subtract(6, "day")
        : range === "month"
        ? now.subtract(1, "month")
        : now.subtract(1, "year");

    const matchStage = {
      $match: {
        restaurant_id: new mongoose.Types.ObjectId(restaurantId),
        created_at: { $gte: startDate.toDate() },
      },
    };

    let groupStage: any;
    let labels: string[] = [];

    if (range === "week") {
      groupStage = {
        $group: {
          _id: { $dayOfWeek: "$created_at" },
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      };
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
    } else {
      groupStage = {
        $group: {
          _id: { $month: "$created_at" },
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      };
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }

    const result = await Review.aggregate([matchStage, groupStage, { $sort: { _id: 1 } }]);

    const ratingMap: Record<string, number> = {};
    const countMap: Record<string, number> = {};

    result.forEach((entry) => {
      const key = typeof entry._id === "number"
        ? range === "week"
          ? labels[(entry._id + 5) % 7]
          : labels[entry._id - 1]
        : entry._id;

      ratingMap[key] = parseFloat(entry.avgRating.toFixed(2));
      countMap[key] = entry.totalReviews;
    });

    const ratings = labels.map((label) => ratingMap[label] || 0);
    const counts = labels.map((label) => countMap[label] || 0);

    res.json({ labels, ratings, counts });
  } catch (err) {
    console.error("❌ Error fetching restaurant review chart:", err);
    res.status(500).json({ message: "Server error" });
  }
};