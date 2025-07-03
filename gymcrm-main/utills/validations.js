const Joi = require('joi');

// User registration validation
exports.validateRegisterData = (data) => {
  const schema = Joi.object({
    uid: Joi.string().required().label('Firebase UID'),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .label('Phone Number'),
    role: Joi.string()
      .valid('superadmin', 'gymadmin', 'trainer', 'member')
      .default('member'),
    businessId: Joi.string().hex().length(24).allow(null)
  });

  return schema.validate(data, { abortEarly: false });
};

// Membership validation
exports.validateMembershipData = (data, isUpdate = false) => {
  const baseSchema = {
    userId: isUpdate ? 
      Joi.string().hex().length(24).optional() : 
      Joi.string().hex().length(24).required(),
    plan: Joi.string().required().label('Membership Plan'),
    price: Joi.number().positive().required().label('Price'),
    startDate: Joi.date().iso().required().label('Start Date'),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required().label('End Date'),
    status: Joi.string()
      .valid('active', 'expired', 'cancelled')
      .default('active')
  };

  if (isUpdate) {
    return Joi.object(baseSchema).min(1).validate(data, { abortEarly: false });
  }
  return Joi.object(baseSchema).validate(data, { abortEarly: false });
};

// Business validation
exports.validateBusinessData = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().label('Business Name'),
    address: Joi.string().min(10).max(500).required().label('Address'),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().label('Phone'),
    email: Joi.string().email().required().label('Email'),
    website: Joi.string().uri().optional().label('Website')
  });

  return schema.validate(data, { abortEarly: false });
};