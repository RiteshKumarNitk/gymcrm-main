// Format phone numbers consistently
exports.formatPhoneNumber = (phone) => {
  if (!phone) return '';
  if (phone.startsWith('+91')) return phone;
  if (phone.startsWith('91') && phone.length === 12) return `+${phone}`;
  if (phone.length === 10) return `+91${phone}`;
  return phone;
};

// Calculate membership end date
exports.calculateEndDate = (startDate, durationMonths) => {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + durationMonths);
  return date;
};

// Generate random OTP
exports.generateOTP = (length = 6) => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Pagination helper
exports.paginateResults = (model, query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  return model.find(query)
    .skip(skip)
    .limit(limit)
    .exec()
    .then(results => {
      return model.countDocuments(query).exec().then(total => ({
        results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }));
    });
};

// Format currency
exports.formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};