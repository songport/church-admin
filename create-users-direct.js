#!/usr/bin/env node

/**
 * 테스트 계정 생성 스크립트 (직접 실행)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

// User 스키마 (backend와 동일)
const userSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
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

// 비밀번호 해싱 미들웨어
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

async function createTestUsers() {
  try {
    console.log('🔄 MongoDB에 연결 중...');
    console.log(`MONGODB_URI: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB 연결 성공!\n');

    // 기존 테스트 사용자 삭제
    console.log('🗑️  기존 테스트 사용자 삭제 중...');
    const result = await User.deleteMany({
      email: { $in: ['admin@church.com', 'user@church.com'] }
    });
    console.log(`✅ ${result.deletedCount}개 계정 삭제 완료\n`);

    // 관리자 계정 생성
    console.log('👤 관리자 계정 생성 중...');
    const admin = new User({
      username: 'admin',
      email: 'admin@church.com',
      password: 'admin123',
      name: '교회 관리자',
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ 관리자 계정 생성 완료');
    console.log(`   Email: admin@church.com`);
    console.log(`   Password: admin123`);
    console.log(`   Role: admin\n`);

    // 일반 사용자 계정 생성
    console.log('👤 일반 사용자 계정 생성 중...');
    const user = new User({
      username: 'user',
      email: 'user@church.com',
      password: 'user123',
      name: '일반 사용자',
      role: 'user',
      isActive: true
    });

    await user.save();
    console.log('✅ 일반 사용자 계정 생성 완료');
    console.log(`   Email: user@church.com`);
    console.log(`   Password: user123`);
    console.log(`   Role: user\n`);

    // 생성된 사용자 목록 조회
    console.log('📋 생성된 사용자 목록:');
    const users = await User.find({}, { password: 0 });
    users.forEach((u, idx) => {
      console.log(`${idx + 1}. ${u.email} (${u.role})`);
    });

    console.log('\n✅ 테스트 계정 생성 완료!');
    console.log('\n🔗 로그인 정보:');
    console.log('\n📌 관리자 계정:');
    console.log('   Email: admin@church.com');
    console.log('   Password: admin123');
    console.log('\n📌 일반 사용자 계정:');
    console.log('   Email: user@church.com');
    console.log('   Password: user123');

  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    if (error.message.includes('ETIMEOUT')) {
      console.error('\n💡 MongoDB 연결 실패. 다음을 확인하세요:');
      console.error('   - MongoDB Atlas가 정상 작동 중인가?');
      console.error('   - MONGODB_URI가 올바른가?');
      console.error('   - 인터넷 연결이 있는가?');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB 연결 해제');
  }
}

// 실행
createTestUsers();
