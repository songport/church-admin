# 🚀 Vercel 배포 준비 완료!

주님의 교회 스마트 행정 앱이 이제 Vercel을 통해 외부에서 접근 가능한 상태로 배포될 준비가 완료되었습니다!

## 📊 배포 준비 현황

| 항목 | 상태 | 설명 |
|------|------|------|
| 백엔드 구조 | ✅ 완료 | Vercel Serverless Functions 호환 |
| 설정 파일 | ✅ 완료 | vercel.json, .vercelignore 생성 |
| 환경 변수 | ✅ 준비완료 | MONGODB_URI, JWT_SECRET 설정 필요 |
| API 라우트 | ✅ 완료 | 모든 엔드포인트 준비 |
| 테스트 도구 | ✅ 완료 | 웹 대시보드 생성 |
| 문서 | ✅ 완료 | 배포 가이드 작성 |

---

## 🎯 빠른 시작 (5분)

### 1️⃣ MongoDB Atlas 설정 (2분)
```
1. https://www.mongodb.com/cloud/atlas 접속
2. 클러스터 생성 (M0 무료)
3. 사용자 생성: churchadmin / password
4. IP 화이트리스트: 0.0.0.0/0
5. 연결 문자열 복사
```

### 2️⃣ GitHub에 푸시 (1분)
```bash
cd c:\dev\church
git init
git remote add origin https://github.com/YOUR_USERNAME/church-admin.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 3️⃣ Vercel에 배포 (2분)
```
1. https://vercel.com/dashboard 접속
2. "New Project" 클릭
3. GitHub 저장소 (church-admin) 선택
4. 환경 변수 설정:
   - MONGODB_URI: mongodb+srv://churchadmin:password@...
   - JWT_SECRET: your-secret-key
   - NODE_ENV: production
5. Deploy 클릭
```

### 4️⃣ 테스트
```
https://church-admin.vercel.app/dashboard
```

---

## 📚 가이드 문서

### 🟢 필수 읽기 (배포 전에)
1. **[빠른 시작 가이드](./docs/QUICK_START_VERCEL.md)** ⭐
   - 5분 안에 배포하기
   - 단계별 스크린샷 포함
   - 가장 간단한 방법

2. **[체크리스트](./docs/DEPLOYMENT_CHECKLIST.md)**
   - 각 단계별 확인 항목
   - 문제 해결 방법
   - 보안 체크리스트

3. **[환경 변수 가이드](./docs/ENVIRONMENT_VARIABLES.md)**
   - 필수 변수 설정
   - 보안 권장사항
   - 트러블슈팅

### 🟡 참고 (필요시)
4. **[상세 배포 가이드](./docs/DEPLOYMENT_VERCEL.md)**
   - 심화 설정
   - 아키텍처 다이어그램
   - 최적화 팁

5. **[API 문서](./docs/API.md)**
   - 모든 엔드포인트
   - 요청/응답 예시
   - 인증 방법

6. **[프로젝트 상태](./docs/PROJECT_STATUS.md)**
   - 전체 기능 현황
   - 구현된 기능 목록
   - Phase 3 계획

---

## 🌐 배포 후 주소

| 주소 | 설명 |
|------|------|
| `https://church-admin.vercel.app` | API 서버 (기본) |
| `https://church-admin.vercel.app/health` | 헬스 체크 |
| `https://church-admin.vercel.app/dashboard` | API 테스트 도구 |
| `https://church-admin.vercel.app/auth/login` | 로그인 |
| `https://church-admin.vercel.app/attendance/today` | 오늘 출석 조회 |

---

## 📁 배포 관련 새로운 파일

### Vercel 설정 파일
- `vercel.json` - Vercel 플랫폼 설정
- `.vercelignore` - 배포 제외 파일 목록
- `api/index.js` - Serverless 함수 진입점
- `api/local.js` - 로컬 개발 서버

### 문서
- `docs/QUICK_START_VERCEL.md` - 빠른 시작 (5분)
- `docs/DEPLOYMENT_CHECKLIST.md` - 단계별 체크리스트
- `docs/ENVIRONMENT_VARIABLES.md` - 환경 변수 설정
- `docs/DEPLOYMENT_VERCEL.md` - 상세 가이드 (이미 존재)

### 테스트 도구
- `public/dashboard.html` - 웹 기반 API 테스트 도구

---

## ✨ 주요 기능

### 🔐 인증 시스템
```bash
# 로그인
POST /auth/login
{
  "username": "admin",
  "password": "admin123"
}

# 응답
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {...}
}
```

### 📍 지오펜싱 출석
```bash
# 오늘 출석 조회
GET /attendance/today
Authorization: Bearer <token>

# 출석 체크인
POST /attendance/check-in
{
  "latitude": 37.6379499,
  "longitude": 126.8747216,
  "locationName": "강서지부"
}
```

### 💰 결재 라인 관리
```bash
# 결재 라인 목록
GET /approval-lines
Authorization: Bearer <token>

# 결재 라인 생성
POST /approval-lines
{
  "name": "지출 승인",
  "approvers": ["user1", "user2"]
}
```

---

## 🧪 API 테스트 방법

### 방법 1: 웹 대시보드 (가장 쉬움) ⭐
```
배포 후:
https://church-admin.vercel.app/dashboard
- 클릭만으로 모든 API 테스트 가능
- 토큰 자동 관리
- 실시간 응답 확인
```

### 방법 2: cURL
```bash
# 헬스 체크
curl https://church-admin.vercel.app/health

# 로그인
curl -X POST https://church-admin.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 방법 3: Postman
1. Postman 열기
2. POST 요청 생성
3. URL: `https://church-admin.vercel.app/auth/login`
4. Body → JSON:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
5. Send

---

## 🔒 보안 정보

### ⚠️ 중요!
- ❌ JWT_SECRET을 GitHub에 커밋하지 마세요
- ❌ MongoDB 비밀번호를 코드에 입력하지 마세요
- ✅ 모든 민감한 정보는 Vercel 환경 변수에만 저장하세요

### 환경 변수 (Vercel에만 저장)
```env
MONGODB_URI=mongodb+srv://churchadmin:password@cluster0.xxxxx.mongodb.net/church-admin
JWT_SECRET=church-admin-secret-2026-!@#$%^&*()
NODE_ENV=production
```

---

## 💡 팁

### 배포 후 첫 번째 일
1. ✅ `/health` 엔드포인트 테스트 → 200 OK 확인
2. ✅ `/auth/login` 테스트 → JWT 토큰 받기
3. ✅ `/dashboard` 접속 → 웹 UI 테스트

### 로그 확인
```
Vercel Dashboard → Deployments → 배포 선택 → Logs
```

### 재배포
```
Vercel Dashboard → Deployments → 최신 배포 → Redeploy
```

---

## 🆘 문제 발생시

### MongoDB 연결 실패
```
Error: MongooseError: connect ECONNREFUSED

해결:
1. MONGODB_URI 환경 변수 확인
2. MongoDB Atlas IP 화이트리스트 확인
3. 특수문자 URL 인코딩 확인
4. Vercel 배포 재실행
```

### API 느림
```
첫 요청이 3-5초 걸리는 것은 Vercel Cold Start (정상)
M0 무료 클러스터는 성능 제한 있음
프로덕션은 M2 이상 권장
```

### CORS 오류
```
Access-Control-Allow-Origin 헤더 확인
api/index.js에서 CORS 설정 확인
필요시 FRONTEND_URL 환경 변수 추가
```

---

## 📞 참고 자료

- **Vercel 공식**: https://vercel.com/docs
- **MongoDB 공식**: https://docs.atlas.mongodb.com/
- **Node.js/Express**: https://expressjs.com/
- **프로젝트 README**: [README.md](./README.md)

---

## 🎉 다음 단계

### ✅ 배포 완료 후
1. 프론트엔드 API URL 업데이트
2. 로그인 및 기본 기능 테스트
3. 프로덕션 모니터링 설정

### 📅 Phase 3 예정
- Google Vision API 통합 (OCR)
- 전자 결재 워크플로우 완성
- 웹 기반 관리 대시보드
- WebSocket 실시간 업데이트

---

## 📝 작업 순서 정리

```
1단계: MongoDB Atlas 설정 (2분)
   ↓
2단계: GitHub 저장소 생성 및 푸시 (2분)
   ↓
3단계: Vercel 프로젝트 생성 (1분)
   ↓
4단계: 환경 변수 설정 (2분)
   ↓
5단계: 배포 실행 (2-3분)
   ↓
6단계: 테스트 및 검증 (5분)
   ↓
✅ 완료! (외부 접근 가능)
```

**총 소요 시간: 약 15-20분**

---

더 많은 정보는 [QUICK_START_VERCEL.md](./docs/QUICK_START_VERCEL.md)를 참고하세요!

---

*마지막 업데이트: 2026-01-28*
*Vercel 배포 준비: 100% 완료 ✅*
