# 🚀 바로 배포하기 - 실시간 가이드

## ✅ 사전 준비 완료

- ✅ GitHub 푸시 완료 (커밋: 222a6f0)
- ✅ MongoDB 설정 완료 (.env 파일)
- ✅ 환경 변수 설정 완료

---

## 🎯 배포 단계

### 1️⃣ Vercel에 웹앱 배포 (5분)

**웹앱 배포 링크:**
👉 https://vercel.com/dashboard

#### Step 1-1: Vercel 대시보드 로그인
```
1. https://vercel.com/dashboard 접속
2. GitHub 계정으로 로그인
   - 이미 계정이 있으면 로그인
   - 없으면 "Sign Up" → GitHub 연결
```

#### Step 1-2: 프로젝트 임포트
```
1. 대시보드에서 "Add New..." 클릭
2. "Project" 선택
3. "Select a Git Repository" 페이지
4. 검색창에 "church-admin" 입력
5. "songport/church-admin" 저장소 선택
6. "Import" 버튼 클릭
```

#### Step 1-3: 프로젝트 설정
```
빌드 설정 자동 감지 확인:
- Framework: Next.js ✓
- Root Directory: ./webapp ✓
- Build Command: npm run build (자동)
- Install Command: npm ci (자동)

→ 모두 자동으로 감지됨 (수정 불필요)
```

#### Step 1-4: 환경 변수 설정
```
"Environment Variables" 섹션에서:

1️⃣  NEXT_PUBLIC_API_URL
   Name: NEXT_PUBLIC_API_URL
   Value: https://church-admin-api.onrender.com
   Add 클릭

2️⃣  NEXT_PUBLIC_APP_URL
   Name: NEXT_PUBLIC_APP_URL
   Value: https://church-admin-web.vercel.app
   Add 클릭

⏭️ 모두 추가 후 "Deploy" 버튼 클릭
```

#### Step 1-5: 배포 시작
```
1. "Deploy" 버튼 클릭
2. 배포 진행 중...
   - Cloning repository
   - Installing dependencies
   - Building Next.js
   - Optimizing images
   (약 2-3분)

3. ✅ "Congratulations! Your site is live" 메시지 확인
4. URL 확인: https://YOUR-PROJECT.vercel.app
```

#### Step 1-6: 배포 완료
```
✅ 웹앱이 배포되었습니다!

배포 URL:
https://church-admin-web.vercel.app

또는 Vercel이 자동 생성한 URL:
https://church-admin-[random].vercel.app
```

**Expected time: 3-5분**

---

### 2️⃣ Render에 백엔드 배포 (7분)

**백엔드 배포 링크:**
👉 https://dashboard.render.com

#### Step 2-1: Render 대시보드 로그인
```
1. https://dashboard.render.com 접속
2. "Sign up" 또는 "Sign in"
3. GitHub 계정으로 로그인
```

#### Step 2-2: Web Service 생성
```
1. 대시보드에서 "New +" 버튼 클릭
2. "Web Service" 선택
3. GitHub 저장소 선택 페이지
   - "Connect account" 또는 저장소 검색
   - "songport/church-admin" 선택
   - "Connect" 클릭
```

#### Step 2-3: 배포 설정
```
배포 설정 페이지에서:

1️⃣  Name
   Value: church-admin-api

2️⃣  Environment
   Value: Node

3️⃣  Region
   Value: Singapore (싱가포르) 또는 default

4️⃣  Branch
   Value: main

5️⃣  Build Command
   Value: cd backend && npm install

6️⃣  Start Command
   Value: cd backend && npm run start

7️⃣  Instance Type
   Value: Free
   (또는 Pro로 업그레이드하려면 $7/월)
```

#### Step 2-4: 환경 변수 설정 (매우 중요!)
```
"Environment" 섹션에서 환경 변수 추가:

⚠️ 주의: 각 변수를 개별로 입력하세요!

1️⃣  MONGODB_URI
   Key: MONGODB_URI
   Value: mongodb+srv://songwonho_db_user:!finjomr9@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority
   Add 클릭

2️⃣  JWT_SECRET
   Key: JWT_SECRET
   Value: church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?
   Add 클릭

3️⃣  NODE_ENV
   Key: NODE_ENV
   Value: production
   Add 클릭

4️⃣  FRONTEND_URL
   Key: FRONTEND_URL
   Value: https://church-admin-web.vercel.app
   Add 클릭

5️⃣  API_PORT
   Key: API_PORT
   Value: 3000
   Add 클릭

6️⃣  API_HOST
   Key: API_HOST
   Value: 0.0.0.0
   Add 클릭

7️⃣  DB_NAME
   Key: DB_NAME
   Value: church-admin
   Add 클릭
```

#### Step 2-5: 배포 시작
```
1. 페이지 하단의 "Create Web Service" 버튼 클릭
2. 배포 진행 중...
   - Cloning repo
   - Installing dependencies
   - Building
   - Starting service
   (약 3-5분)

3. 상단 상태 확인
   - "Spinning up" → "Deploying" → "Live"
   
4. ✅ "Live" 상태 확인
```

#### Step 2-6: API URL 확인
```
배포 완료 후:
https://church-admin-api.onrender.com

또는 Render이 자동 생성한 URL:
https://church-admin-[random].onrender.com
```

**Expected time: 5-7분**

---

### 3️⃣ Vercel 환경 변수 재설정 (2분)

Render 배포가 완료되면 Vercel의 환경 변수를 업데이트합니다.

#### Step 3-1: Vercel 대시보드
```
1. https://vercel.com/dashboard 접속
2. "church-admin-web" 프로젝트 선택
3. "Settings" 탭 클릭
```

#### Step 3-2: 환경 변수 업데이트
```
1. 좌측 메뉴에서 "Environment Variables" 클릭
2. NEXT_PUBLIC_API_URL 찾기
3. 수정:
   이전: https://church-admin-api.onrender.com (임시값)
   새로운: https://church-admin-api.onrender.com (실제 URL)
   
   또는 Render이 준 실제 URL로 변경
4. "Save" 클릭
```

#### Step 3-3: 재배포
```
1. "Deployments" 탭 클릭
2. 최신 배포 (맨 위)에 커서 올림
3. "Redeploy" 버튼 클릭
4. "Redeploy" 확인
5. 배포 진행 중... (1-2분)
6. ✅ "Ready" 상태 확인
```

**Expected time: 2-3분**

---

### 4️⃣ 최종 테스트 (3분)

#### Step 4-1: 웹앱 접속
```
👉 https://church-admin-web.vercel.app

확인 사항:
✅ 페이지가 정상 로드됨
✅ 로그인 화면이 보임
✅ 콘솔에 에러가 없음
```

#### Step 4-2: API 헬스 체크
```
👉 https://church-admin-api.onrender.com/health

확인 사항:
✅ JSON 응답 수신
✅ "status": "ok" 확인

응답 예시:
{
  "status": "ok",
  "message": "Server is running"
}
```

#### Step 4-3: 로그인 테스트
```
1. 웹앱에서 로그인 시도
2. 네트워크 탭 (F12) 확인
3. API 요청이 정상적으로 되는지 확인
```

**Expected time: 2-3분**

---

## 📊 배포 시간 요약

| 단계 | 작업 | 예상 시간 |
|------|------|---------|
| 1 | Vercel 웹앱 배포 | 3-5분 |
| 2 | Render 백엔드 배포 | 5-7분 |
| 3 | Vercel 환경 변수 재설정 | 2-3분 |
| 4 | 최종 테스트 | 2-3분 |
| | **총 시간** | **12-18분** |

---

## 🌐 최종 배포 URL

배포 완료 후:

| 서비스 | URL |
|--------|-----|
| 웹앱 | https://church-admin-web.vercel.app |
| API | https://church-admin-api.onrender.com |
| 헬스 체크 | https://church-admin-api.onrender.com/health |

---

## 💡 팁

### 배포 중 문제 발생 시

**Vercel 빌드 실패:**
```
Settings → Deployments
최신 배포 선택 → "Logs" 확인
에러 메시지 확인 후 수정
```

**Render 배포 실패:**
```
대시보드에서 서비스 선택
"Logs" 탭에서 에러 확인
대부분 환경 변수 오류
```

**API 연결 실패:**
```
1. MongoDB IP 화이트리스트 확인 (0.0.0.0/0)
2. MONGODB_URI 정확성 확인
3. JWT_SECRET 일치 확인
4. Render 로그에서 에러 메시지 확인
```

---

## ✅ 체크리스트

배포 전:
- [ ] GitHub 푸시 완료
- [ ] .env 파일 생성 (.gitignore 제외)
- [ ] MONGODB_URI 확인
- [ ] JWT_SECRET 확인

Vercel 배포:
- [ ] 프로젝트 임포트
- [ ] 환경 변수 설정
- [ ] Deploy 클릭
- [ ] "Live" 상태 확인

Render 배포:
- [ ] Web Service 생성
- [ ] 환경 변수 설정 (매우 중요!)
- [ ] "Create Web Service" 클릭
- [ ] "Live" 상태 확인

최종 확인:
- [ ] 웹앱 접속 가능
- [ ] API 헬스 체크 확인
- [ ] 로그인 테스트

---

## 🚀 지금 시작하세요!

**Step 1: Vercel에 접속**
👉 https://vercel.com/dashboard

**Step 2: Render에 접속**
👉 https://dashboard.render.com

**Step 3: 테스트**
👉 https://church-admin-web.vercel.app

배포 시작! 🎉
