import Booking from '../../models/booking.model';
import User from '../user/user.model';

const completedStatuses = ['completed', 'paid', 'done'];

const buildDateFilter = (from?: string, to?: string) => {
  const filter: any = {};

  if (from || to) {
    filter.createdAt = {};
  }

  if (from) {
    filter.createdAt.$gte = new Date(from);
  }

  if (to) {
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);
    filter.createdAt.$lte = endDate;
  }

  return filter;
};

export const getDashboardOverview = async () => {
  const totalBookings = await Booking.countDocuments({});
  const completedBookings = await Booking.countDocuments({
    status: { $in: completedStatuses },
  });

  const activeUsers = await User.countDocuments({
    status: { $ne: 'suspended' },
  });

  const summary = await Booking.aggregate([
    {
      $match: {
        status: { $in: completedStatuses },
      },
    },
    {
      $group: {
        _id: null,
        gmv: {
          $sum: {
            $ifNull: [
              '$totalAmount',
              {
                $ifNull: ['$totalPrice', { $ifNull: ['$price', 0] }],
              },
            ],
          },
        },
        revenue: {
          $sum: {
            $ifNull: [
              '$platformFee',
              {
                $ifNull: ['$commissionAmount', { $ifNull: ['$commission', 0] }],
              },
            ],
          },
        },
        totalPayout: {
          $sum: {
            $ifNull: [
              '$payoutAmount',
              {
                $ifNull: ['$studioPayout', { $ifNull: ['$netAmount', 0] }],
              },
            ],
          },
        },
      },
    },
  ]);

  const monthlyStats = await Booking.aggregate([
    {
      $match: {
        status: { $in: completedStatuses },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        bookings: { $sum: 1 },
        gmv: {
          $sum: {
            $ifNull: [
              '$totalAmount',
              {
                $ifNull: ['$totalPrice', { $ifNull: ['$price', 0] }],
              },
            ],
          },
        },
        revenue: {
          $sum: {
            $ifNull: [
              '$platformFee',
              {
                $ifNull: ['$commissionAmount', { $ifNull: ['$commission', 0] }],
              },
            ],
          },
        },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ]);

  const data = summary[0] || {
    gmv: 0,
    revenue: 0,
    totalPayout: 0,
  };

  return {
    gmv: data.gmv || 0,
    totalBookings,
    completedBookings,
    activeUsers,
    revenue: data.revenue || 0,
    totalPayout: data.totalPayout || 0,
    monthlyStats,
  };
};

export const getFinancialReport = async (from?: string, to?: string) => {
  const dateFilter = buildDateFilter(from, to);

  const matchFilter = {
    ...dateFilter,
    status: { $in: completedStatuses },
  };

  const summary = await Booking.aggregate([
    {
      $match: matchFilter,
    },
    {
      $group: {
        _id: null,
        completedTransactions: { $sum: 1 },
        grossTransactionValue: {
          $sum: {
            $ifNull: [
              '$totalAmount',
              {
                $ifNull: ['$totalPrice', { $ifNull: ['$price', 0] }],
              },
            ],
          },
        },
        platformEarnings: {
          $sum: {
            $ifNull: [
              '$platformFee',
              {
                $ifNull: ['$commissionAmount', { $ifNull: ['$commission', 0] }],
              },
            ],
          },
        },
        totalPayouts: {
          $sum: {
            $ifNull: [
              '$payoutAmount',
              {
                $ifNull: ['$studioPayout', { $ifNull: ['$netAmount', 0] }],
              },
            ],
          },
        },
      },
    },
  ]);

  const monthlyBreakdown = await Booking.aggregate([
    {
      $match: matchFilter,
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        completedTransactions: { $sum: 1 },
        grossTransactionValue: {
          $sum: {
            $ifNull: [
              '$totalAmount',
              {
                $ifNull: ['$totalPrice', { $ifNull: ['$price', 0] }],
              },
            ],
          },
        },
        platformEarnings: {
          $sum: {
            $ifNull: [
              '$platformFee',
              {
                $ifNull: ['$commissionAmount', { $ifNull: ['$commission', 0] }],
              },
            ],
          },
        },
        totalPayouts: {
          $sum: {
            $ifNull: [
              '$payoutAmount',
              {
                $ifNull: ['$studioPayout', { $ifNull: ['$netAmount', 0] }],
              },
            ],
          },
        },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ]);

  const data = summary[0] || {
    completedTransactions: 0,
    grossTransactionValue: 0,
    platformEarnings: 0,
    totalPayouts: 0,
  };

  return {
    from: from || null,
    to: to || null,
    completedTransactions: data.completedTransactions || 0,
    grossTransactionValue: data.grossTransactionValue || 0,
    platformEarnings: data.platformEarnings || 0,
    totalPayouts: data.totalPayouts || 0,
    monthlyBreakdown,
  };
};