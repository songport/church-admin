const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  // 사용자
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userPosition: {
    type: String,
    required: true
  },
  userRegion: {
    type: String
  },

  // 출석 정보
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  
  // 자동 퇴청 (5시간 후)
  isAutoCheckOut: {
    type: Boolean,
    default: false
  },

  // 출석 상태
  status: {
    type: String,
    enum: ['출석', '퇴청'],
    default: '출석'
  },

  // 메타데이터
  date: {
    type: Date,
    required: true
  },
  durationMinutes: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 인덱싱: 빠른 조회
attendanceSchema.index({ userId: 1, date: 1 });
attendanceSchema.index({ date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
