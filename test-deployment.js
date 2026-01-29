#!/usr/bin/env node

/**
 * 배포 후 테스트 스크립트
 * 
 * Vercel과 Render 배포 후 모든 기능을 테스트합니다.
 */

const axios = require('axios');

const WEBAPP_URL = 'https://church-admin-web.vercel.app';
const API_URL = 'https://church-admin-api.onrender.com';

async function testDeployment() {
  console.log('🚀 배포 후 테스트 시작\n');
  console.log('=' . repeat(50));

  try {
    // 1. API 헬스 체크
    console.log('\n1️⃣  API 헬스 체크');
    console.log('─' . repeat(50));
    
    try {
      const healthRes = await axios.get(`${API_URL}/health`, { timeout: 5000 });
      console.log('✅ API 서버 응답: OK');
      console.log(`   Status: ${healthRes.status}`);
      console.log(`   Response:`, healthRes.data);
    } catch (error) {
      console.log('❌ API 서버 응답: FAILED');
      console.log(`   Error: ${error.message}`);
      console.log('\n   💡 문제 해결:');
      console.log('   1. Render 대시보드에서 "Live" 상태 확인');
      console.log('   2. 환경 변수 설정 확인 (MONGODB_URI, JWT_SECRET)');
      console.log('   3. MongoDB IP 화이트리스트 확인 (0.0.0.0/0)');
    }

    // 2. 웹앱 응답 확인
    console.log('\n2️⃣  웹앱 페이지 응답 확인');
    console.log('─' . repeat(50));
    
    try {
      const webRes = await axios.head(WEBAPP_URL, { timeout: 5000 });
      console.log('✅ 웹앱 응답: OK');
      console.log(`   Status: ${webRes.status}`);
      console.log(`   웹앱 접속: ${WEBAPP_URL}`);
    } catch (error) {
      console.log('❌ 웹앱 응답: FAILED');
      console.log(`   Error: ${error.message}`);
      console.log('\n   💡 문제 해결:');
      console.log('   1. Vercel 대시보드에서 "Ready" 상태 확인');
      console.log('   2. Build 로그 확인');
      console.log('   3. NEXT_PUBLIC_API_URL 환경 변수 확인');
    }

    // 3. API 엔드포인트 테스트
    console.log('\n3️⃣  API 엔드포인트 테스트');
    console.log('─' . repeat(50));
    
    const endpoints = [
      { name: '헬스 체크', path: '/health' },
      { name: '인증 정보', path: '/api/auth/me' },
      { name: '사용자 목록', path: '/api/users' },
      { name: '출석 기록', path: '/api/attendance' },
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await axios.get(`${API_URL}${endpoint.path}`, { timeout: 5000 });
        console.log(`✅ ${endpoint.name} (${endpoint.path}): ${res.status}`);
      } catch (error) {
        if (error.response) {
          console.log(`⚠️  ${endpoint.name} (${endpoint.path}): ${error.response.status}`);
        } else {
          console.log(`❌ ${endpoint.name} (${endpoint.path}): ${error.message}`);
        }
      }
    }

    // 4. 최종 요약
    console.log('\n4️⃣  배포 완료 정보');
    console.log('─' . repeat(50));
    
    console.log(`\n✅ 배포 완료!`);
    console.log(`\n📍 접속 주소:`);
    console.log(`   웹앱:      ${WEBAPP_URL}`);
    console.log(`   API:       ${API_URL}`);
    console.log(`   헬스체크:   ${API_URL}/health`);
    
    console.log(`\n🔐 로그인 테스트:`);
    console.log(`   1. ${WEBAPP_URL} 접속`);
    console.log(`   2. 이메일/비밀번호로 로그인`);
    console.log(`   3. 대시보드 페이지 확인`);
    
    console.log(`\n🔗 GitHub:`);
    console.log(`   https://github.com/songport/church-admin`);
    
    console.log(`\n📊 모니터링:`);
    console.log(`   Vercel: https://vercel.com/dashboard`);
    console.log(`   Render: https://dashboard.render.com`);

  } catch (error) {
    console.error('\n❌ 테스트 중 오류 발생:', error.message);
  }

  console.log('\n' + '=' . repeat(50));
  console.log('테스트 완료\n');
}

// 실행
testDeployment();
