#!/usr/bin/env node

/**
 * 테스트 계정 생성 스크립트
 * 
 * 관리자(Admin)와 일반 사용자(User) 계정을 생성합니다.
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

// User 스키마 정의
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

async function createTestUsers() {
  try {
    console.log('🔄 MongoDB에 연결 중...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB 연결 성공!\n');

    // 기존 테스트 사용자 삭제
    console.log('🗑️  기존 테스트 사용자 삭제 중...');
    await User.deleteMany({
      email: { $in: ['admin@church.com', 'user@church.com'] }
    });
    console.log('✅ 기존 계정 삭제 완료\n');

    // 비밀번호 해싱
    const adminPassword = await bcryptjs.hash('admin123', 10);
    const userPassword = await bcryptjs.hash('user123', 10);

    // 관리자 계정 생성
    console.log('👤 관리자 계정 생성 중...');
    const admin = new User({
      email: 'admin@church.com',
      password: adminPassword,
      name: '교회 관리자',
      role: 'admin',
    });

    await admin.save();
    console.log('✅ 관리자 계정 생성 완료');
    console.log(`   Email: admin@church.com`);
    console.log(`   Password: admin123`);
    console.log(`   Role: admin\n`);

    // 일반 사용자 계정 생성
    console.log('👤 일반 사용자 계정 생성 중...');
    const user = new User({
      email: 'user@church.com',
      password: userPassword,
      name: '일반 사용자',
      role: 'user',
    });

    await user.save();
    console.log('✅ 일반 사용자 계정 생성 완료');
    console.log(`   Email: user@church.com`);
    console.log(`   Password: user123`);
    console.log(`   Role: user\n`);

    // 생성된 사용자 목록 조회
    console.log('📋 생성된 사용자 목록:');
    const users = await User.find({}, { password: 0 });
    console.log(JSON.stringify(users, null, 2));

    console.log('\n✅ 테스트 계정 생성 완료!');
    console.log('\n🔗 로그인 정보:');
    console.log('\n📌 관리자 계정:');
    console.log('   Email: admin@church.com');
    console.log('   Password: admin123');
    console.log('   역할: 관리자 (결재, 사용자 관리 등)');
    console.log('\n📌 일반 사용자 계정:');
    console.log('   Email: user@church.com');
    console.log('   Password: user123');
    console.log('   역할: 일반 사용자 (출석, 지출 결의 등)');

  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB 연결 해제');
  }
}

// 실행
createTestUsers();
