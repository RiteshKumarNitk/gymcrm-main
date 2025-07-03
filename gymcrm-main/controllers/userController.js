const User = require('../models/user');
const Business = require('../models/business');

// Register or update user
exports.registerOrUpdateUser = async (req, res) => {
  try {
    const { uid, phone, role, businessId } = req.body;
    
    // Validate businessId if provided
    if (businessId) {
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(400).json({ message: 'Invalid business ID' });
      }
    }

    // Find or create user
    let user = await User.findOneAndUpdate(
      { uid },
      { 
        phone,
        role: role || 'member',
        businessId: businessId || null,
        lastLogin: new Date()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(user);
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })
      .populate('businessId', 'name address phone');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// const User = require("../models/user");

// exports.registerOrUpdateUser = async (req, res) => {
//   const { googleId, email, uid, phone, name, role, businessId } = req.body;

//   if (!googleId && !email && !uid && !phone) {
//     return res.status(400).json({ error: "Missing user identifier" });
//   }

//   try {
//     let user = await User.findOne({
//       $or: [
//         { googleId: googleId || null },
//         { email: email || null },
//         { uid: uid || null },
//         { phone: phone || null },
//       ],
//     });

//     if (!user) {
//       user = new User({
//         googleId,
//         email,
//         uid,
//         phone,
//         name,
//         role: role || "member",
//         businessId,
//       });
//     } else {
//       // Optional update logic
//       user.name = name || user.name;
//       user.email = email || user.email;
//       user.phone = phone || user.phone;
//       user.role = role || user.role;
//       user.businessId = businessId || user.businessId;
//     }

//     await user.save();
//     res.json({ message: "User registered/updated", role: user.role });
//   } catch (error) {
//     console.error("User registration error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().populate("businessId", "businessName");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// };

// exports.getUsersByBusiness = async (req, res) => {
//   const { businessId } = req.params;
//   try {
//     const users = await User.find({ businessId });
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching business users" });
//   }
// };
