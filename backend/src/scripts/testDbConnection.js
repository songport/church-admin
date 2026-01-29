#!/usr/bin/env node

/**
 * MongoDB 연결 테스트 스크립트
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const axios = require('axios');

async function testMongoDBConnection() {
  try {
    console.log('🔍 환경 변수 확인:');
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ 설정됨' : '❌ 미설정'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ 설정됨' : '❌ 미설정'}`);
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI가 설정되지 않았습니다');
    }

    console.log('\n🔄 MongoDB Atlas에 연결 중...');
    
    const mongoose = require('mongoose');
    
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    console.log('✅ MongoDB 연결 성공!');
    console.log(`\n📊 데이터베이스 정보:`);
    console.log(`   - 호스트: ${connection.connection.host}`);
    console.log(`   - 데이터베이스: ${connection.connection.name}`);

    // 컬렉션 확인
    const collections = await connection.connection.db.listCollections().toArray();
    console.log(`\n📚 컬렉션: ${collections.length}개`);
    
    if (collections.length === 0) {
      console.log('   - 현재 컬렉션이 없습니다');
      console.log('\n   다음 명령어로 데이터베이스를 초기화하세요:');
      console.log('   npm run init-db');
    } else {
      collections.forEach((col, idx) => {
        console.log(`   ${idx + 1}. ${col.name}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ 연결 테스트 완료!');
    
  } catch (error) {
    console.error('\n❌ 에러 발생:', error.message);
    console.error('\n💡 문제 해결:');
    console.error('   1. MongoDB Atlas 접속: https://www.mongodb.com/cloud/atlas');
    console.error('   2. IP 화이트리스트 확인: 0.0.0.0/0으로 설정되어 있는지 확인');
    console.error('   3. 사용자 이름/비밀번호 확인');
    console.error('   4. .env 파일에서 MONGODB_URI 확인');
    process.exit(1);
  }
}

testMongoDBConnection();
