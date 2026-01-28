const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  // 작성자 정보
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submitterName: {
    type: String,
    required: true
  },
  submitterPosition: {
    type: String,
    required: true
  },

  // 지출 기본 정보
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['식비', '교재비', '시설비', '선교비', '기타'],
    required: true
  },
  expenditureDate: {
    type: Date,
    required: true
  },

  // 영수증 정보
  receiptImageUrl: {
    type: String
  },
  ocrData: {
    items: [
      {
        item: String,
        amount: Number,
        quantity: Number
      }
    ],
    totalAmount: Number,
    receiptDate: Date,
    vendor: String
  },

  // 결재 정보
  approvalStatus: {
    type: String,
    enum: ['작성중', '제출', '1차검토', '승인됨', '반려됨'],
    default: '작성중'
  },
  
  approvalLine: [
    {
      approverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      approverName: String,
      approverPosition: String,
      status: {
        type: String,
        enum: ['대기', '승인', '반려'],
        default: '대기'
      },
      approvedAt: Date,
      rejectionReason: String
    }
  ],

  // 메타데이터
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: Date
});

// 인덱싱
expenditureSchema.index({ submittedBy: 1, createdAt: -1 });
expenditureSchema.index({ approvalStatus: 1, createdAt: -1 });
expenditureSchema.index({ expenditureDate: 1 });

module.exports = mongoose.model('Expenditure', expenditureSchema);
