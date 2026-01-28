const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // 기본 정보
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: {
    type: String
  },

  // 직분 (Position)
  position: {
    type: String,
    enum: ['교인', '집사', '권사', '장로', '심방장', '전도사', '목사', '관리자'],
    default: '교인',
    required: true
  },

  // 구역 및 소속
  region: {
    type: String,
    enum: ['양천', '송파', '강남', '강동', '강북', '기타'],
    required: function() {
      // 목사, 관리자는 구역이 필요 없음
      return this.position !== '목사' && this.position !== '관리자';
    }
  },
  department: {
    type: String,
    enum: ['8남전도회', '5여전도회', '청년회', '기타'],
    required: function() {
      return this.position !== '목사' && this.position !== '관리자';
    }
  },

  // 권한 설정
  permissions: {
    canApproveExpenditure: {
      type: Boolean,
      default: false
    },
    canFinalApprove: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },

  // 지출 권한
  canSubmitExpenditure: {
    type: Boolean,
    default: true
  },

  // 활성 상태
  isActive: {
    type: Boolean,
    default: true
  },

  // 로그인 유지 토큰
  refreshToken: {
    type: String,
    default: null
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

// 비밀번호 해싱 미들웨어
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// 민감한 정보 제외하고 반환
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  return user;
};

module.exports = mongoose.model('User', userSchema);
