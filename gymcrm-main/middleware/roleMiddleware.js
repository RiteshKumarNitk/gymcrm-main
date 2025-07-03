const User = require('../models/user');

const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ uid: req.user.uid });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          error: `Access forbidden. Requires roles: ${allowedRoles.join(', ')}`
        });
      }
      
      req.user.role = user.role;
      req.user.businessId = user.businessId;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
};

module.exports = requireRole;