const User = require("../models/user");


exports.registerOrUpdateUser = async (req, res) => {
  const { googleId, email, name, photoUrl, role, businessId } = req.body;

  if (!googleId || !email) {
    return res.status(400).json({ error: "Missing googleId or email" });
  }

  let user = await User.findOne({ googleId });

  if (user) {
    // ✅ Just return user info
    return res.status(200).json(user);
  }

  // ✅ Register new user
  user = new User({
    googleId,
    email,
    name,
    photoUrl,
    role,
    businessId,
  });

  await user.save();
  return res.status(201).json(user);
};
// exports.registerOrUpdateUser = async (req, res) => {
//   const { googleId, email, name, photoUrl, role, businessId } = req.body;

//   try {
//     let user = await User.findOne({ googleId });

//     if (user) {
//       user.name = name;
//       user.email = email;
//       user.photoUrl = photoUrl;
//       user.role = role ?? user.role;
//       user.businessId = businessId ?? user.businessId;
//       await user.save();
//       return res.status(200).json(user);
//     }

//     user = new User({ googleId, email, name, photoUrl, role, businessId });
//     await user.save();
//     res.status(201).json(user);
//   } catch (err) {
//     console.error("User registration error", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("businessId", "businessName");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.getUsersByBusiness = async (req, res) => {
  const { businessId } = req.params;
  try {
    const users = await User.find({ businessId });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching business users" });
  }
};
