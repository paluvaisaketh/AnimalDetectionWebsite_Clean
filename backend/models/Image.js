const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  path: { type: String, required: true },
  detected: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', imageSchema);
