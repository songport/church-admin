#!/usr/bin/env node

/**
 * MongoDB 데이터베이스 초기화 스크립트
 * 
 * 데이터베이스 연결 테스트 및 컬렉션 생성
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function initializeDatabase() {
  try {
    console.log('🔄 MongoDB에 연결 중...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB 연결 성공!');

    // 데이터베이스 정보 출력
    const db = mongoose.connection;
    console.log('📊 데이터베이스 정보:');
    console.log(`   - 호스트: ${db.host}`);
    console.log(`   - 포트: ${db.port}`);
    console.log(`   - 데이터베이스: ${db.name}`);

    // 모든 컬렉션 확인
    const collections = await db.db.listCollections().toArray();
    console.log(`\n📚 현재 컬렉션: ${collections.length}개`);
    
    if (collections.length === 0) {
      console.log('   (아직 생성된 컬렉션이 없습니다)');
      
      // 기본 컬렉션 생성
      console.log('\n🆕 기본 컬렉션 생성 중...');
      
      // User 컬렉션
      await db.db.createCollection('users', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'password', 'name'],
            properties: {
              _id: { bsonType: 'objectId' },
              email: { bsonType: 'string', description: '사용자 이메일' },
              password: { bsonType: 'string', description: '암호화된 비밀번호' },
              name: { bsonType: 'string', description: '사용자 이름' },
              role: { enum: ['admin', 'user'], description: '사용자 역할' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('   ✅ users 컬렉션 생성');

      // Attendance 컬렉션
      await db.db.createCollection('attendances', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'date', 'status'],
            properties: {
              _id: { bsonType: 'objectId' },
              userId: { bsonType: 'objectId', description: '사용자 ID' },
              date: { bsonType: 'date', description: '출석 날짜' },
              status: { enum: ['present', 'absent', 'late'], description: '출석 상태' },
              checkInTime: { bsonType: 'date', description: '체크인 시간' },
              checkOutTime: { bsonType: 'date', description: '체크아웃 시간' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('   ✅ attendances 컬렉션 생성');

      // Expenditure 컬렉션
      await db.db.createCollection('expenditures', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'amount', 'date', 'status'],
            properties: {
              _id: { bsonType: 'objectId' },
              title: { bsonType: 'string', description: '지출 제목' },
              amount: { bsonType: 'double', description: '지출 금액' },
              category: { bsonType: 'string', description: '지출 카테고리' },
              description: { bsonType: 'string', description: '지출 설명' },
              date: { bsonType: 'date', description: '지출 날짜' },
              status: { enum: ['pending', 'approved', 'rejected'], description: '지출 상태' },
              userId: { bsonType: 'objectId', description: '요청자 ID' },
              approvedBy: { bsonType: 'objectId', description: '승인자 ID' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('   ✅ expenditures 컬렉션 생성');

      // ApprovalLine 컬렉션
      await db.db.createCollection('approvallines', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['expenditureId', 'userId', 'order', 'status'],
            properties: {
              _id: { bsonType: 'objectId' },
              expenditureId: { bsonType: 'objectId', description: '지출 결의 ID' },
              userId: { bsonType: 'objectId', description: '승인자 ID' },
              order: { bsonType: 'int', description: '승인 순서' },
              status: { enum: ['pending', 'approved', 'rejected'], description: '승인 상태' },
              comment: { bsonType: 'string', description: '승인 의견' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('   ✅ approvallines 컬렉션 생성');

      // ChurchLocation 컬렉션
      await db.db.createCollection('churchlocations', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'latitude', 'longitude', 'radius'],
            properties: {
              _id: { bsonType: 'objectId' },
              name: { bsonType: 'string', description: '교회명' },
              latitude: { bsonType: 'double', description: '위도' },
              longitude: { bsonType: 'double', description: '경도' },
              radius: { bsonType: 'double', description: '지오펜싱 반경(미터)' },
              address: { bsonType: 'string', description: '주소' },
              createdAt: { bsonType: 'date' },
              updatedAt: { bsonType: 'date' }
            }
          }
        }
      });
      console.log('   ✅ churchlocations 컬렉션 생성');

      console.log('\n✨ 모든 컬렉션이 성공적으로 생성되었습니다!');
    } else {
      collections.forEach((col, index) => {
        console.log(`   ${index + 1}. ${col.name}`);
      });
    }

    // 인덱스 생성
    console.log('\n🔑 인덱스 생성 중...');
    
    const db_instance = db.db;
    
    // users 인덱스
    await db_instance.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('   ✅ users.email 인덱스 생성');

    // attendances 인덱스
    await db_instance.collection('attendances').createIndex({ userId: 1, date: 1 }, { unique: true });
    console.log('   ✅ attendances.userId+date 인덱스 생성');

    // expenditures 인덱스
    await db_instance.collection('expenditures').createIndex({ userId: 1, date: -1 });
    console.log('   ✅ expenditures.userId+date 인덱스 생성');

    // approvallines 인덱스
    await db_instance.collection('approvallines').createIndex({ expenditureId: 1, userId: 1 });
    console.log('   ✅ approvallines.expenditureId+userId 인덱스 생성');

    console.log('\n✅ 데이터베이스 초기화 완료!');
    console.log('\n📍 다음 단계:');
    console.log('   1. 백엔드 시작: npm run dev (backend 디렉토리에서)');
    console.log('   2. 웹앱 시작: npm run dev (webapp 디렉토리에서)');
    console.log('   3. http://localhost:3000 에서 테스트');

  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 문제 해결:');
      console.error('   - MongoDB 사용자 이름과 비밀번호 확인');
      console.error('   - IP 화이트리스트 설정 확인 (0.0.0.0/0)');
      console.error('   - MONGODB_URI 문자열 확인');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB 연결 해제');
  }
}

// 실행
initializeDatabase();
