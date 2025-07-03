const User = require('../models/user');
const Business = require('../models/business');
const admin = require('../config/firebaseAdmin');
const { formatPhoneNumber } = require('../utils/helpers');
const { validateRegisterData } = require('../utils/validations');

// Register or update user after Firebase authentication
exports.registerOrUpdateUser = async (req, res) => {
  try {
    // Validate request data
    const { error } = validateRegisterData(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { uid, phone, role, businessId } = req.body;
    const formattedPhone = formatPhoneNumber(phone);

    // Verify Firebase UID
    try {
      const firebaseUser = await admin.auth().getUser(uid);
      if (firebaseUser.phoneNumber !== formattedPhone) {
        return res.status(400).json({ error: 'Phone number mismatch' });
      }
    } catch (err) {
      return res.status(401).json({ error: 'Invalid Firebase UID' });
    }

    // Check if business exists (if provided)
    if (businessId) {
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(400).json({ error: 'Invalid business ID' });
      }
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ uid }, { phone: formattedPhone }] });

    if (user) {
      // Update existing user
      user.role = role || user.role;
      user.businessId = businessId || user.businessId;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = new User({
        uid,
        phone: formattedPhone,
        role: role || 'member',
        businessId: businessId || null
      });
      await user.save();
    }

    // If user is gym admin, link to business
    if (role === 'gymadmin' && businessId) {
      await Business.findByIdAndUpdate(businessId, { $set: { admin: user._id } });
    }

    res.status(200).json({
      id: user._id,
      phone: user.phone,
      role: user.role,
      businessId: user.businessId
    });
  } catch (error) {
    console.error('Auth Controller Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })
      .populate('businessId', 'name address phone')
      .select('-__v -createdAt -updatedAt');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};