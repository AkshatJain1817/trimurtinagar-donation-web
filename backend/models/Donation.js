const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // donation belongs to a temple/user
  donorName: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  address: { type: String },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['cash', 'online'], required: true },
});

module.exports = mongoose.model('Donation', DonationSchema);
