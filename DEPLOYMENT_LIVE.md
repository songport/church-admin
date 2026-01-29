# 🚀 배포 시작 - 실시간 진행 현황

**배포 시작 시간**: 2026-01-29 (현재)
**상태**: ⏳ 진행 중

---

## 📋 배포 체크리스트

### ✅ 사전 준비 (완료)
- [x] GitHub 푸시 완료
- [x] .env 파일 생성
- [x] MongoDB 연결 정보 설정
- [x] 배포 가이드 작성

### ⏳ 진행 중

#### Phase 1: Vercel 배포 (웹앱)
- [ ] Vercel 대시보드 로그인
- [ ] GitHub 저장소 임포트
- [ ] Root Directory: ./webapp 설정
- [ ] 환경 변수 설정
- [ ] 배포 시작
- [ ] Live 상태 확인
- [ ] 배포 URL 기록

**예상 시간**: 5분

---

#### Phase 2: Render 배포 (백엔드)
- [ ] Render 대시보드 로그인
- [ ] Web Service 생성
- [ ] 배포 설정 입력
- [ ] 환경 변수 7개 설정
- [ ] 배포 시작
- [ ] Live 상태 확인
- [ ] 배포 URL 기록

**예상 시간**: 7분

---

#### Phase 3: 최종 연결 및 테스트
- [ ] Vercel 환경 변수 업데이트
- [ ] Vercel 재배포
- [ ] 웹앱 접속 테스트
- [ ] API 헬스 체크
- [ ] 로그인 테스트

**예상 시간**: 5분

---

## 🎯 현재 상황

### GitHub 저장소
✅ **준비 완료**
```
저장소: https://github.com/songport/church-admin
최신 커밋: 222a6f0 (feat: add MongoDB setup scripts...)
브랜치: main
```

### 배포 설정
✅ **준비 완료**
```
MongoDB URI: ✅ 설정됨
JWT Secret: ✅ 설정됨
.env 파일: ✅ 생성됨
배포 가이드: ✅ 준비됨
```

---

## 🔗 배포 링크

### Vercel (웹앱)
**대시보드**: https://vercel.com/dashboard

**진행 단계:**
1. 우측 상단 "Add New" → "Project"
2. GitHub 저장소: songport/church-admin
3. Root Directory: ./webapp
4. 환경 변수 설정 후 Deploy

---

### Render (백엔드)
**대시보드**: https://dashboard.render.com

**진행 단계:**
1. "New +" → "Web Service"
2. GitHub 저장소: songport/church-admin
3. Build & Start 명령어 설정
4. 환경 변수 7개 설정 후 Create Web Service

---

## 📊 배포 진행도

```
┌─────────────────────────────────────────────┐
│  Vercel 배포 (웹앱)                         │
│  ████████░░░░░░░░░░░░░░░░░░░░ 30%         │
└─────────────────────────────────────────────┘
  [ ] 대시보드 로그인
  [ ] 프로젝트 임포트
  [ ] 설정 및 배포

┌─────────────────────────────────────────────┐
│  Render 배포 (백엔드)                        │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%  │
└─────────────────────────────────────────────┘
  [ ] 대시보드 로그인
  [ ] Web Service 생성
  [ ] 설정 및 배포

┌─────────────────────────────────────────────┐
│  최종 테스트 및 연결                         │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%  │
└─────────────────────────────────────────────┘
  [ ] 환경 변수 업데이트
  [ ] 재배포
  [ ] 테스트
```

---

## 📝 Vercel 배포 단계별 지침

### Step 1: Vercel 로그인
```
👉 https://vercel.com/dashboard

로그인 방법:
- GitHub 계정으로 로그인
- 또는 기존 Vercel 계정 사용
```

### Step 2: 프로젝트 임포트
```
대시보드에서:
1. 우측 상단 "Add New" 버튼 클릭
2. "Project" 선택
3. "Select a Git Repository" 페이지
4. 검색: "church-admin" 입력
5. "songport/church-admin" 선택
6. "Import" 버튼 클릭
```

### Step 3: 프로젝트 설정
```
자동 감지 확인 (수정 불필요):
- Framework: Next.js ✓
- Root Directory: ./webapp ✓
- Build Command: npm run build ✓
- Install Command: npm ci ✓

모두 자동 감지됨
```

### Step 4: 환경 변수 추가
```
"Environment Variables" 섹션:

변수 1:
- Name: NEXT_PUBLIC_API_URL
- Value: https://church-admin-api.onrender.com
- "Add" 클릭

변수 2:
- Name: NEXT_PUBLIC_APP_URL
- Value: https://church-admin-web.vercel.app
- "Add" 클릭

모두 추가 후 다음 단계로
```

### Step 5: 배포 시작
```
"Deploy" 버튼 클릭

배포 진행:
- Cloning repository... ⏳
- Installing dependencies... ⏳
- Building Next.js application... ⏳
- Optimizing production build... ⏳
- Uploading build artifacts... ⏳

약 2-3분 소요
```

### Step 6: 완료 확인
```
메시지: "Congratulations! Your site is live"

배포 URL:
https://church-admin-web.vercel.app
또는
https://church-admin-[random].vercel.app
```

---

## 📝 Render 배포 단계별 지침

### Step 1: Render 로그인
```
👉 https://dashboard.render.com

로그인 방법:
- GitHub 계정으로 "Sign up" 또는 "Sign in"
```

### Step 2: Web Service 생성
```
대시보드에서:
1. "New +" 버튼 클릭
2. "Web Service" 선택
3. GitHub 저장소 연결
   - "Connect account" 또는 저장소 검색
4. "songport/church-admin" 선택
5. "Connect" 클릭
```

### Step 3: 기본 설정
```
배포 설정 페이지:

Name:
Value: church-admin-api

Environment:
Value: Node

Region:
Value: Singapore (또는 기본값)

Branch:
Value: main

Build Command:
Value: cd backend && npm install

Start Command:
Value: cd backend && npm run start

Instance Type:
Value: Free
```

### Step 4: 환경 변수 설정 (중요!)
```
"Environment" 섹션에서 각각 추가:

1️⃣  MONGODB_URI
Key: MONGODB_URI
Value: mongodb+srv://songwonho_db_user:!finjomr9@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority

2️⃣  JWT_SECRET
Key: JWT_SECRET
Value: church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?

3️⃣  NODE_ENV
Key: NODE_ENV
Value: production

4️⃣  FRONTEND_URL
Key: FRONTEND_URL
Value: https://church-admin-web.vercel.app

5️⃣  API_PORT
Key: API_PORT
Value: 3000

6️⃣  API_HOST
Key: API_HOST
Value: 0.0.0.0

7️⃣  DB_NAME
Key: DB_NAME
Value: church-admin

모두 개별로 입력하세요!
```

### Step 5: 배포 시작
```
"Create Web Service" 버튼 클릭

배포 진행:
- Spinning up... ⏳
- Cloning repo... ⏳
- Installing dependencies... ⏳
- Building... ⏳
- Starting service... ⏳

약 3-5분 소요
```

### Step 6: 완료 확인
```
상태: "Live"

배포 URL:
https://church-admin-api.onrender.com
또는
https://church-admin-[random].onrender.com
```

---

## 📝 최종 설정 (Vercel 재배포)

### Step 1: Vercel 대시보드
```
https://vercel.com/dashboard
→ "church-admin-web" 프로젝트 선택
→ "Settings" 탭
```

### Step 2: 환경 변수 업데이트
```
"Environment Variables" 섹션:

NEXT_PUBLIC_API_URL 값 수정:
이전: https://church-admin-api.onrender.com
새로운: https://church-admin-api.onrender.com (또는 Render URL)

"Save" 클릭
```

### Step 3: 재배포
```
"Deployments" 탭으로 이동
↓
최신 배포 (맨 위) 선택
↓
"Redeploy" 버튼 클릭
↓
배포 진행 중... (1-2분)
↓
상태: "Ready"
```

---

## 🧪 최종 테스트

### 웹앱 테스트
```
👉 https://church-admin-web.vercel.app

확인:
✅ 페이지 로드 (3초 이내)
✅ 로그인 화면 표시
✅ 개발자 도구 → Console (에러 없음)
```

### API 헬스 체크
```
👉 https://church-admin-api.onrender.com/health

응답 확인:
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-01-29T..."
}
```

### 로그인 테스트
```
1. 웹앱에서 로그인 시도
2. 개발자 도구 (F12) → Network 탭
3. API 요청 확인
   - /api/auth/login 요청 성공
   - Response 상태: 200
4. JWT 토큰 수신 확인
```

---

## 📊 최종 배포 정보

### 배포 완료 시 접속 주소

| 서비스 | URL |
|--------|-----|
| 웹앱 | https://church-admin-web.vercel.app |
| API | https://church-admin-api.onrender.com |
| 헬스 체크 | https://church-admin-api.onrender.com/health |

### 환경 정보

| 항목 | 값 |
|------|-----|
| GitHub | https://github.com/songport/church-admin |
| MongoDB | church.adaqcxm.mongodb.net |
| 데이터베이스 | church-admin |

---

## ⏱️ 예상 소요 시간

```
Vercel 배포 (웹앱):        5분
Render 배포 (백엔드):      7분
환경 변수 재설정:         2분
최종 테스트:              3분
─────────────────────────────
총 시간:                17분
```

---

## 🎯 지금 바로 시작!

### 1️⃣ Vercel 접속
👉 https://vercel.com/dashboard

### 2️⃣ Render 접속
👉 https://dashboard.render.com

### 3️⃣ 테스트
👉 https://church-admin-web.vercel.app

---

## 💡 참고 정보

**배포 상태 확인:**
- Vercel: https://vercel.com/dashboard
- Render: https://dashboard.render.com

**문제 해결:**
- Vercel 빌드 실패 → Settings → Deployments → 로그 확인
- Render 배포 실패 → 서비스 선택 → Logs 탭 → 에러 확인

**MongoDB 확인:**
- Atlas: https://www.mongodb.com/cloud/atlas
- IP 화이트리스트: 0.0.0.0/0 (확인됨)
- 사용자: songwonho_db_user (확인됨)

---

**배포 시작: 2026-01-29**
**상태: 🚀 준비 완료!**

지금 바로 배포를 시작하세요!
