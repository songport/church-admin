const mongoose = require('mongoose');

const churchLocationSchema = new mongoose.Schema({
  // 교회 위치 정보
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  radius: {
    type: Number,
    default: 30, // 미터 단위
    required: true
  },
  address: {
    type: String
  },
  
  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChurchLocation', churchLocationSchema);
