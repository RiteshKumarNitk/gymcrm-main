const Membership = require('../models/membership');
const Checkin = require('../models/checkin');
const User = require('../models/user');

// Get admin dashboard analytics
exports.getAdminDashboard = async (req, res) => {
  try {
    const { businessId } = req.user;
    
    if (!businessId) {
      return res.status(403).json({ error: 'Business not assigned to user' });
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [
      totalMembers,
      activeMemberships,
      newMembersThisMonth,
      recentCheckins,
      expiringMemberships
    ] = await Promise.all([
      User.countDocuments({ businessId, role: 'member' }),
      Membership.countDocuments({ businessId, status: 'active' }),
      User.countDocuments({ 
        businessId, 
        role: 'member',
        createdAt: { $gte: startOfMonth }
      }),
      Checkin.find({ businessId })
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('userId', 'name phone'),
      Membership.find({ 
        businessId, 
        status: 'active',
        endDate: { 
          $gte: today, 
          $lte: new Date(today.setDate(today.getDate() + 7)) 
        }
      }).populate('userId', 'name phone')
    ]);

    res.json({
      analytics: {
        totalMembers,
        activeMemberships,
        newMembersThisMonth,
        checkinsToday: recentCheckins.length
      },
      recentCheckins,
      expiringMemberships
    });
  } catch (error) {
    console.error('Dashboard Controller Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get member dashboard data
exports.getMemberDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const businessId = req.user.businessId;
    
    const [membership, checkins, upcomingClasses] = await Promise.all([
      Membership.findOne({ userId, businessId, status: 'active' }),
      Checkin.find({ userId, businessId })
        .sort({ timestamp: -1 })
        .limit(5),
      // This would come from a class scheduling model
      Promise.resolve([]) // Placeholder
    ]);

    res.json({
      membership,
      recentCheckins: checkins,
      upcomingClasses
    });
  } catch (error) {
    console.error('Member Dashboard Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};