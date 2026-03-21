import mongoose from 'mongoose';
import Booking, { BookingStatus } from '../../models/booking.model';
import Wallet from '../../models/wallet.model';

export const getDashboardMetrics = async (studioId: string) => {
  const oId = new mongoose.Types.ObjectId(studioId);

  // 1. Fetch Wallet Data
  let wallet = await Wallet.findOne({ studioId: oId });
  if (!wallet) {
    // Graceful fallback for brand-new studios missing a wallet
    wallet = await Wallet.create({ studioId: oId });
  }

  // 2. Fetch Booking Stats (Count by Status)
  const bookingAggregation = await Booking.aggregate([
    { $match: { studioId: oId } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  // Format booking stats nicely
  const bookingStats = {
    [BookingStatus.PENDING]: 0,
    [BookingStatus.CONFIRMED]: 0,
    [BookingStatus.COMPLETED]: 0,
    [BookingStatus.CANCELLED]: 0,
    [BookingStatus.REJECTED]: 0,
    total: 0
  };

  bookingAggregation.forEach(stat => {
    bookingStats[stat._id as BookingStatus] = stat.count;
    bookingStats.total += stat.count;
  });

  // 3. Fetch Monthly Chart Data (Trailing 6 Months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyAggregation = await Booking.aggregate([
    {
      $match: {
        studioId: oId,
        status: BookingStatus.COMPLETED,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        revenue: { $sum: "$packageDetails.price" },
        successfulBookings: { $sum: 1 }
      }
    },
    { 
      $sort: { "_id.year": 1, "_id.month": 1 } 
    }
  ]);

  // Transform MongoDB's _id structure to flat array
  const monthlyChart = monthlyAggregation.map(item => ({
    label: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
    successfulBookings: item.successfulBookings
  }));

  return {
    wallet: {
      totalRevenue: wallet.totalRevenue,
      holdingBalance: wallet.holdingBalance,
      availableBalance: wallet.availableBalance
    },
    bookingStats,
    monthlyChart
  };
};
