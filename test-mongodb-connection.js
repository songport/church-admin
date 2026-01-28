// MongoDB 연결 테스트 스크립트
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ 오류: MONGODB_URI 환경 변수가 설정되지 않았습니다.');
  console.error('');
  console.error('사용 방법:');
  console.error('1. MongoDB Atlas에서 연결 문자열 복사');
  console.error('2. .env 파일에 다음과 같이 추가:');
  console.error('   MONGODB_URI=mongodb+srv://churchadmin:password@cluster0.xxxxx.mongodb.net/church-admin');
  console.error('3. npm test-mongodb를 실행하거나 다음 명령어 실행:');
  console.error('   set MONGODB_URI=mongodb+srv://churchadmin:password@cluster0.xxxxx.mongodb.net/church-admin');
  console.error('   node test-mongodb-connection.js');
  process.exit(1);
}

console.log('🔌 MongoDB 연결 테스트 시작...');
console.log('📍 연결 중:', MONGODB_URI.substring(0, 50) + '...');
console.log('');

mongoose.connect(MONGODB_URI, {
  retryWrites: true,
  w: 'majority'
})
  .then(() => {
    console.log('✅ MongoDB 연결 성공!');
    console.log('');
    console.log('📊 연결 정보:');
    console.log(`  - 상태: 연결됨`);
    console.log(`  - 호스트: ${mongoose.connection.host}`);
    console.log(`  - 포트: ${mongoose.connection.port}`);
    console.log(`  - 데이터베이스: ${mongoose.connection.name}`);
    console.log('');
    
    // 데이터베이스 상태 확인
    const db = mongoose.connection.db;
    db.admin().serverStatus((err, status) => {
      if (err) {
        console.error('❌ 서버 상태 조회 실패:', err.message);
      } else {
        console.log('⚙️ 서버 상태:');
        console.log(`  - 버전: ${status.version}`);
        console.log(`  - 가동 시간: ${status.uptime}초`);
        console.log(`  - 프로세스: ${status.process}`);
      }
      
      // 컬렉션 목록 조회
      db.listCollections().toArray((err, collections) => {
        if (err) {
          console.error('❌ 컬렉션 목록 조회 실패:', err.message);
        } else {
          console.log('');
          console.log('📦 컬렉션 목록:');
          if (collections.length === 0) {
            console.log('  - (아직 생성된 컬렉션 없음)');
          } else {
            collections.forEach(col => {
              console.log(`  - ${col.name}`);
            });
          }
        }
        
        mongoose.connection.close();
        console.log('');
        console.log('✨ 테스트 완료!');
      });
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB 연결 실패!');
    console.error('');
    console.error('오류:', err.message);
    console.error('');
    
    // 오류 유형별 해결 방법
    if (err.message.includes('authentication failed')) {
      console.error('💡 해결 방법:');
      console.error('  1. MongoDB Atlas에서 사용자 이름/비밀번호 확인');
      console.error('  2. 특수문자가 있으면 URL 인코딩 확인');
      console.error('     예: ! → %21, # → %23, $ → %24');
    } else if (err.message.includes('getaddrinfo')) {
      console.error('💡 해결 방법:');
      console.error('  1. 인터넷 연결 확인');
      console.error('  2. MongoDB Atlas IP 화이트리스트 확인');
      console.error('  3. 연결 문자열의 호스트명 확인');
    } else if (err.message.includes('ECONNREFUSED')) {
      console.error('💡 해결 방법:');
      console.error('  1. MongoDB 클러스터가 실행 중인지 확인');
      console.error('  2. MongoDB Atlas 클러스터 상태 확인');
    }
    
    process.exit(1);
  });
