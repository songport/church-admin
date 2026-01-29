# 🚀 배포 실행 가이드 - 지금 바로 진행하세요

**배포 준비 상태: ✅ 100% 완료**

```
✅ GitHub 저장소: 9260f5b
✅ .env 파일: 생성 완료
✅ MongoDB: 설정 완료
✅ 배포 가이드: 준비 완료
```

---

## 🎯 배포 단계별 지침

### Phase 1️⃣ : Vercel에서 웹앱 배포 (5분)

#### 열기
```
https://vercel.com/dashboard
```

#### 진행 단계

**1단계: 프로젝트 임포트**
```
- 우측 상단 "Add New" 버튼 클릭
- "Project" 선택
- GitHub 저장소 선택 페이지로 이동
```

**2단계: 저장소 선택**
```
검색창에 "church-admin" 입력
↓
"songport/church-admin" 선택
↓
"Import" 버튼 클릭
```

**3단계: 빌드 설정 (자동 감지)**
```
Framework: Next.js ✓ (자동)
Root Directory: ./webapp ✓ (자동)
Build Command: npm run build ✓ (자동)
Install Command: npm ci ✓ (자동)

→ 모두 자동으로 감지됨 (수정 불필요)
```

**4단계: 환경 변수 설정**
```
"Environment Variables" 섹션:

1️⃣  NEXT_PUBLIC_API_URL
    값: https://church-admin-api.onrender.com
    → "Add" 클릭

2️⃣  NEXT_PUBLIC_APP_URL
    값: https://church-admin-web.vercel.app
    → "Add" 클릭

모두 추가 완료
```

**5단계: 배포 시작**
```
"Deploy" 버튼 클릭
↓
배포 진행 중...
  - Cloning repository
  - Installing dependencies
  - Building Next.js application
  - Optimizing production build
  (약 2-3분)
↓
완료 메시지: "Congratulations! Your site is live"
```

**6단계: 완료 확인**
```
상태: "Live" ✅
배포 URL 확인: https://church-admin-web.vercel.app
```

---

### Phase 2️⃣ : Render에서 백엔드 배포 (7분)

#### 열기
```
https://dashboard.render.com
```

#### 진행 단계

**1단계: 로그인**
```
"Sign up" 또는 "Sign in"
↓
GitHub 계정으로 로그인
```

**2단계: Web Service 생성**
```
"New +" 버튼 클릭
↓
"Web Service" 선택
↓
GitHub 저장소 연결 페이지
```

**3단계: 저장소 선택**
```
"songport/church-admin" 선택
↓
"Connect" 클릭
```

**4단계: 배포 설정**
```
프로젝트 설정 페이지:

Name:
  church-admin-api

Environment:
  Node

Region:
  Singapore (또는 기본값)

Branch:
  main

Build Command:
  cd backend && npm install

Start Command:
  cd backend && npm run start

Instance Type:
  Free (무료)
```

**5단계: 환경 변수 설정 (매우 중요!)**
```
"Environment" 섹션에서 각각 입력:

1️⃣  Key: MONGODB_URI
    Value: mongodb+srv://songwonho_db_user:!finjomr9@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority
    → "Add" 클릭

2️⃣  Key: JWT_SECRET
    Value: church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?
    → "Add" 클릭

3️⃣  Key: NODE_ENV
    Value: production
    → "Add" 클릭

4️⃣  Key: FRONTEND_URL
    Value: https://church-admin-web.vercel.app
    → "Add" 클릭

5️⃣  Key: API_PORT
    Value: 3000
    → "Add" 클릭

6️⃣  Key: API_HOST
    Value: 0.0.0.0
    → "Add" 클릭

7️⃣  Key: DB_NAME
    Value: church-admin
    → "Add" 클릭

⚠️ 모두 개별로 입력하세요!
```

**6단계: 배포 시작**
```
"Create Web Service" 버튼 클릭
↓
배포 진행 중...
  - Spinning up
  - Cloning repo
  - Installing dependencies
  - Building
  - Starting service
  (약 3-5분)
↓
상태: "Live" ✅
```

**7단계: 완료 확인**
```
배포 URL: https://church-admin-api.onrender.com
헬스 체크: https://church-admin-api.onrender.com/health
```

---

### Phase 3️⃣ : 최종 테스트 (3분)

#### Step 1: 웹앱 접속
```
https://church-admin-web.vercel.app
↓
확인:
✅ 페이지 로드 (3초 이내)
✅ 로그인 화면 표시
✅ 콘솔 에러 없음
```

#### Step 2: API 헬스 체크
```
https://church-admin-api.onrender.com/health
↓
응답:
{
  "status": "ok",
  "message": "Server is running"
}
```

#### Step 3: 로그인 테스트
```
웹앱: https://church-admin-web.vercel.app
↓
관리자 로그인:
  Email: admin@church.com
  Password: admin123
↓
확인:
✅ 로그인 성공
✅ 대시보드 페이지 로드
✅ 메인 페이지 표시
```

---

## 📊 배포 진행 추적

### 배포 전

- [ ] Vercel 대시보드 열기: https://vercel.com/dashboard
- [ ] Render 대시보드 열기: https://dashboard.render.com
- [ ] 본 문서 참고하며 진행

### Vercel 배포

- [ ] "Add New" → "Project"
- [ ] "songport/church-admin" 선택
- [ ] Root Directory: "./webapp"
- [ ] 환경 변수 2개 추가
- [ ] "Deploy" 클릭
- [ ] "Live" 상태 확인

### Render 배포

- [ ] "New +" → "Web Service"
- [ ] "songport/church-admin" 선택
- [ ] 기본 설정 입력
- [ ] 환경 변수 7개 추가
- [ ] "Create Web Service" 클릭
- [ ] "Live" 상태 확인

### 최종 테스트

- [ ] 웹앱 URL 접속
- [ ] API 헬스 체크
- [ ] 관리자 로그인 테스트
- [ ] 사용자 로그인 테스트

---

## 🌐 배포 완료 후 접속 정보

### 웹앱 URL
```
https://church-admin-web.vercel.app
```

### 관리자 계정
```
📧 Email:    admin@church.com
🔐 Password: admin123
```

### 일반 사용자 계정
```
📧 Email:    user@church.com
🔐 Password: user123
```

### API 서버
```
https://church-admin-api.onrender.com
```

### 헬스 체크
```
https://church-admin-api.onrender.com/health
```

---

## ⏱️ 예상 소요시간

```
Vercel 배포:    3-5분
Render 배포:    5-7분
최종 테스트:    2-3분
────────────────────
총 시간:       10-15분
```

---

## 💡 팁

### 배포 중 기다리는 동안

- [ ] 커피 마시기 ☕
- [ ] 문서 다시 읽기
- [ ] GitHub 저장소 확인

### 배포 완료 후

- [ ] 웹앱에서 로그인 테스트
- [ ] 출석 관리 기능 확인
- [ ] 지출 결의서 기능 확인

---

## ⚠️ 문제 발생 시

### Vercel 배포 실패
```
1. 설정값 재확인:
   - Root Directory: ./webapp ✓
   - 환경 변수 2개 ✓

2. 로그 확인:
   - Settings → Deployments → 최신 배포 → Logs
```

### Render 배포 실패
```
1. 설정값 재확인:
   - Build Command: cd backend && npm install ✓
   - Start Command: cd backend && npm run start ✓
   - 환경 변수 7개 ✓

2. 로그 확인:
   - 서비스 선택 → Logs 탭
```

### API 연결 실패
```
1. MongoDB 확인:
   - https://www.mongodb.com/cloud/atlas
   - Network Access: 0.0.0.0/0 ✓
   
2. Render 확인:
   - API 서버 "Live" 상태 ✓
   - 환경 변수 모두 설정 ✓
```

---

## 🎯 지금 시작하세요!

**Step 1: 브라우저 열기**
```
Vercel: https://vercel.com/dashboard
Render: https://dashboard.render.com
```

**Step 2: 본 문서대로 진행**
```
Phase 1 → Phase 2 → Phase 3
```

**Step 3: 완료 확인**
```
https://church-admin-web.vercel.app
```

---

**준비 완료! 배포를 시작하세요! 🚀**

예상 완료 시간: 10-15분

배포 완료 후:
- 웹앱: https://church-admin-web.vercel.app
- 관리자: admin@church.com / admin123
- 사용자: user@church.com / user123
