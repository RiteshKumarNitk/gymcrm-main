const Membership = require('../models/membership');
const User = require('../models/user');
const { validateMembershipData } = require('../utils/validations');

// Create new membership
exports.createMembership = async (req, res) => {
  try {
    // Validate request data
    const { error } = validateMembershipData(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId, plan, price, startDate, endDate } = req.body;
    const businessId = req.user.businessId;

    // Verify user exists and belongs to same business
    const user = await User.findOne({ _id: userId, businessId });
    if (!user) {
      return res.status(404).json({ error: 'User not found in your business' });
    }

    // Check for existing active membership
    const existingMembership = await Membership.findOne({ 
      userId, 
      status: 'active' 
    });
    
    if (existingMembership) {
      return res.status(400).json({ 
        error: 'User already has an active membership' 
      });
    }

    const membership = new Membership({
      userId,
      businessId,
      plan,
      price,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'active'
    });

    await membership.save();
    
    res.status(201).json({
      message: 'Membership created successfully',
      membership
    });
  } catch (error) {
    console.error('Create Membership Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update membership
exports.updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate updates
    const { error } = validateMembershipData(updates, true);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const membership = await Membership.findById(id);
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    // Check business ownership
    if (membership.businessId.toString() !== req.user.businessId.toString()) {
      return res.status(403).json({ error: 'Unauthorized for this business' });
    }

    // Apply updates
    const allowedUpdates = ['plan', 'price', 'startDate', 'endDate', 'status'];
    Object.keys(updates).forEach(update => {
      if (allowedUpdates.includes(update)) {
        membership[update] = updates[update];
      }
    });

    await membership.save();
    
    res.json({
      message: 'Membership updated successfully',
      membership
    });
  } catch (error) {
    console.error('Update Membership Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get memberships for business
exports.getBusinessMemberships = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { status } = req.query;
    
    const filter = { businessId };
    if (status) filter.status = status;
    
    const memberships = await Membership.find(filter)
      .populate('userId', 'name phone email')
      .sort({ startDate: -1 });

    res.json(memberships);
  } catch (error) {
    console.error('Get Memberships Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get membership details
exports.getMembershipDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const membership = await Membership.findById(id)
      .populate('userId', 'name phone email')
      .populate('businessId', 'name address');
    
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }
    
    // Authorization check
    if (req.user.role === 'gymadmin' || req.user.role === 'superadmin') {
      if (membership.businessId.toString() !== req.user.businessId.toString()) {
        return res.status(403).json({ error: 'Unauthorized for this business' });
      }
    } else if (membership.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized for this membership' });
    }
    
    res.json(membership);
  } catch (error) {
    console.error('Membership Details Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};