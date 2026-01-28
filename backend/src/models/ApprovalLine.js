const mongoose = require('mongoose');

const approvalLineSchema = new mongoose.Schema({
  // 결재선 이름
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },

  // 결재 단계 (1 -> 2 -> 3...)
  approvers: [
    {
      order: {
        type: Number,
        required: true
      },
      approverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      approverName: String,
      approverPosition: String
    }
  ],

  // 활성 상태
  isActive: {
    type: Boolean,
    default: true
  },

  // 메타데이터
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ApprovalLine', approvalLineSchema);
