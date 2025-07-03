// models/checkin.js
const checkinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  method: { type: String, enum: ['qr', 'manual', 'face'], default: 'qr' }
}, { timestamps: true });