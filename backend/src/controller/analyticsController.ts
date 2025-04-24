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
  Location
} from '../models';

// GET /api/analytics/foodbank/summary/:foodbankId
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

// GET /api/analytics/foodbank/top-restaurants/:foodbankId
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

// GET /api/analytics/foodbank/category-breakdown/:foodbankId
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

// GET /api/analytics/foodbank/donations-chart/:foodbankId
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

// GET /api/analytics/foodbank/reviews-chart/:foodbankId
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

// GET /api/analytics/foodbank/pickup-map/:foodbankId
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
