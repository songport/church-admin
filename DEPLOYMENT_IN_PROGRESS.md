# 🚀 배포 진행 상황

## ✅ 완료된 단계

### 1️⃣ GitHub 푸시 - 완료! ✅
```
git commit -m "chore: prepare for production deployment with Vercel and Render"
git push origin main
```

**GitHub 저장소**: https://github.com/songport/church-admin
**커밋**: 40b3e9a (chore: prepare for production deployment)

---

## 📋 다음 단계 (수동 진행)

### 2️⃣ MongoDB Atlas 설정 - 진행 중... ⏳

#### Step 2-1: MongoDB 계정 생성
```
👉 https://www.mongodb.com/cloud/atlas
→ "Try Free" 또는 로그인
→ 이메일과 비밀번호로 가입
→ 조직 생성 또는 기존 조직 선택
```

#### Step 2-2: 클러스터 생성
```
1. "Create a Deployment" 클릭
2. M0 Sandbox (무료) 선택
3. Cloud Provider: AWS
4. Region: ap-southeast-1 (싱가포르) 또는 ap-northeast-2 (서울)
5. "Create Deployment" 클릭
6. 3-5분 대기...
```

#### Step 2-3: 데이터베이스 접근 설정
```
1. 좌측 메뉴 "Network Access" 클릭
2. "Add IP Address" 클릭
3. "Allow access from anywhere" 선택
   → IP: 0.0.0.0/0
4. "Confirm" 클릭
```

#### Step 2-4: 데이터베이스 사용자 생성
```
1. 좌측 메뉴 "Database Access" 클릭
2. "Add New Database User" 클릭
3. Authentication Method: Password
4. Username: churchadmin
5. Password: 강력한 비밀번호 설정
   예: Abc@123456XyzWpq!
6. Built-in Role: Atlas admin
7. "Add User" 클릭
```

#### Step 2-5: 연결 문자열 복사
```
1. 클러스터 페이지에서 "Connect" 클릭
2. "Drivers" 선택 (MongoDB용)
3. "Node.js" 선택
4. 버전: 4.0 이상
5. 연결 문자열 복사:
   mongodb+srv://churchadmin:PASSWORD@church-cluster.mongodb.net/church-admin?retryWrites=true&w=majority
```

⚠️ **PASSWORD를 실제 비밀번호로 교체하세요!**

---

### 3️⃣ .env 파일 생성 - 진행 중... ⏳

#### Step 3-1: .env 파일 생성
```bash
cd c:\dev\church
# .env 파일 생성 (예시)
```

#### Step 3-2: 환경 변수 입력
```env
# MongoDB 연결
MONGODB_URI=mongodb+srv://churchadmin:YOUR_PASSWORD@church-cluster.mongodb.net/church-admin?retryWrites=true&w=majority

# JWT 시크릿 (강한 랜덤 문자열로 생성)
JWT_SECRET=Abc@xyz123!#$%^&*()_+{}|:"<>?-=[]\\;',.qwerty

# 환경
NODE_ENV=production

# API 포트
API_PORT=3000

# 호스트
API_HOST=0.0.0.0

# 프론트엔드 URL (Vercel 배포 후에 수정)
FRONTEND_URL=https://church-admin-web.vercel.app

# 모바일 앱 설정
MOBILE_APP_URL=exp://

# 데이터베이스 이름
DB_NAME=church-admin
```

⚠️ **주의**:
- `PASSWORD`를 MongoDB에서 생성한 실제 비밀번호로 교체
- `JWT_SECRET`은 강한 랜덤 문자열 사용
- `.env` 파일은 `.gitignore`에 있으므로 Git에 올라가지 않음
- **절대 GitHub에 커밋하지 마세요!**

---

### 4️⃣ Vercel 배포 (웹앱) - 진행 중... ⏳

#### Step 4-1: Vercel 대시보드 접속
```
👉 https://vercel.com/dashboard
→ "Sign Up" 또는 "Log In"
→ GitHub 계정으로 로그인
```

#### Step 4-2: 프로젝트 임포트
```
1. "Add New..." → "Project" 클릭
2. GitHub에서 "church-admin" 저장소 찾기
3. "Import" 클릭
```

#### Step 4-3: 프로젝트 설정
```
설정 페이지:
- Project Name: church-admin-web (자동)
- Framework: Next.js ✓ (자동 감지)
- Root Directory: ./webapp
- Build Command: npm run build (자동)
- Output Directory: .next (자동)
- Install Command: npm ci (자동)
```

#### Step 4-4: 환경 변수 설정
```
Environment Variables 섹션:

이름: NEXT_PUBLIC_API_URL
값: https://church-admin-api.onrender.com

이름: NEXT_PUBLIC_APP_URL
값: https://church-admin-web.vercel.app

💡 Render 배포 후 NEXT_PUBLIC_API_URL을 실제 URL로 수정
```

#### Step 4-5: 배포
```
1. "Deploy" 버튼 클릭
2. 빌드 진행 중... (2-3분)
3. ✅ "Deployment successful" 확인
4. 배포 URL 기록:
   https://church-admin-web.vercel.app
```

#### Step 4-6: 배포 후 확인
```
👉 https://church-admin-web.vercel.app
→ 페이지가 정상 로드되는지 확인
→ 로그인 화면이 보이는지 확인
```

---

### 5️⃣ Render 배포 (백엔드) - 진행 중... ⏳

#### Step 5-1: Render 대시보드 접속
```
👉 https://dashboard.render.com
→ "Sign Up" 또는 "Log In"
→ GitHub 계정으로 로그인
```

#### Step 5-2: Web Service 생성
```
1. "New +" 버튼 클릭
2. "Web Service" 선택
3. GitHub 저장소 연결
4. "church-admin" 저장소 선택
5. "Connect" 클릭
```

#### Step 5-3: 배포 설정
```
기본 설정:
- Name: church-admin-api
- Environment: Node
- Region: Singapore (싱가포르) 또는 default
- Build Command: cd backend && npm install
- Start Command: cd backend && npm run start
- Instance Type: Free (무료)

⚠️ Free 플랜은 15분 유휴 시 자동 중지
💡 Render Pro로 업그레이드하려면 $7/월
```

#### Step 5-4: 환경 변수 설정
```
Environment Variables에 각각 추가:

1️⃣  MONGODB_URI
    값: mongodb+srv://churchadmin:PASSWORD@church-cluster.mongodb.net/church-admin?retryWrites=true&w=majority
    ⚠️ PASSWORD를 실제 비밀번호로 교체

2️⃣  JWT_SECRET
    값: Abc@xyz123!#$%^&*()_+{}|:"<>?-=[]\\;',.qwerty
    (Vercel 환경 변수와 동일하게)

3️⃣  NODE_ENV
    값: production

4️⃣  FRONTEND_URL
    값: https://church-admin-web.vercel.app

5️⃣  API_PORT
    값: 3000

⚠️ 각 변수는 반드시 개별로 입력하세요!
```

#### Step 5-5: 배포
```
1. 모든 환경 변수 입력 완료
2. "Create Web Service" 버튼 클릭
3. 배포 진행 중... (3-5분)
4. "Live" 상태 표시 확인
5. 배포 URL 기록:
   https://church-admin-api.onrender.com
```

#### Step 5-6: 배포 후 확인
```
👉 https://church-admin-api.onrender.com/health

응답 예시:
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-01-29T..."
}
```

---

### 6️⃣ Vercel 환경 변수 업데이트 - 진행 중... ⏳

Render 배포가 완료되면 Vercel의 환경 변수를 업데이트합니다.

```
1. Vercel 대시보드 접속
2. church-admin-web 프로젝트 선택
3. "Settings" 탭 클릭
4. "Environment Variables" 섹션
5. NEXT_PUBLIC_API_URL 수정:
   이전: https://church-admin-api.onrender.com (임시)
   새로운: https://YOUR-RENDER-URL.onrender.com (실제)
6. "Save" 클릭
7. "Deployments" 탭으로 이동
8. 최신 배포 선택 후 "Redeploy" 클릭
```

---

### 7️⃣ 최종 테스트 - 진행 중... ⏳

#### Step 7-1: 웹앱 접속
```
👉 https://church-admin-web.vercel.app

확인 사항:
✅ 페이지 로드 성공
✅ 로그인 화면 보임
✅ 콘솔에 에러 없음
```

#### Step 7-2: API 헬스 체크
```
👉 https://church-admin-api.onrender.com/health

확인 사항:
✅ JSON 응답 수신
✅ "status": "ok" 확인
```

#### Step 7-3: 로그인 테스트
```
1. 웹앱에서 관리자 계정으로 로그인
   - 이메일: admin@church.com
   - 비밀번호: (처음 설정한 비밀번호)

확인 사항:
✅ 로그인 성공
✅ 대시보드 페이지 로드
✅ 네트워크 탭에서 API 응답 확인
```

#### Step 7-4: 주요 기능 테스트
```
✅ 출석 관리
   - 체크인 기능
   - 출석 기록 조회

✅ 지출 결의서
   - 결의서 작성
   - 지출 목록 조회

✅ 결재 관리 (관리자)
   - 대기 중인 결의서 조회
   - 승인/반려 처리

✅ 사용자 설정
   - 프로필 정보 확인
   - 로그아웃
```

---

## 📊 배포 상태

| 단계 | 작업 | 상태 | 링크 |
|------|------|------|------|
| 1 | GitHub 푸시 | ✅ 완료 | [songport/church-admin](https://github.com/songport/church-admin) |
| 2 | MongoDB 설정 | ⏳ 진행 중 | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| 3 | .env 파일 | ⏳ 진행 중 | - |
| 4 | Vercel 배포 | ⏳ 진행 중 | [Vercel Dashboard](https://vercel.com/dashboard) |
| 5 | Render 배포 | ⏳ 진행 중 | [Render Dashboard](https://dashboard.render.com) |
| 6 | URL 연결 | ⏳ 진행 중 | - |
| 7 | 최종 테스트 | ⏳ 진행 중 | - |

---

## 🎯 예상 시간

- MongoDB 설정: **5분**
- .env 파일: **2분**
- Vercel 배포: **3-5분**
- Render 배포: **5-7분**
- 최종 테스트: **2-3분**

**총 예상 시간: 17-22분**

---

## 🌐 최종 배포 URL

| 서비스 | URL | 상태 |
|--------|-----|------|
| 웹앱 | https://church-admin-web.vercel.app | ⏳ |
| API | https://church-admin-api.onrender.com | ⏳ |
| 헬스 체크 | https://church-admin-api.onrender.com/health | ⏳ |

---

## 📞 도움이 필요하면

👉 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 참고
👉 [QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md) 참고
👉 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) 참고

---

## ⚠️ 중요 주의사항

1. **보안**
   - `.env` 파일은 절대 Git에 커밋하지 마세요
   - `JWT_SECRET`은 강한 랜덤 문자열 사용
   - MongoDB 비밀번호는 정기적으로 변경

2. **환경 변수**
   - MongoDB URI에서 PASSWORD를 실제 비밀번호로 교체
   - 특수문자는 URL 인코딩 필요 (예: ! → %21)
   - 모든 환경 변수가 정확한지 재확인

3. **배포 후**
   - 반드시 기능을 테스트하세요
   - API 헬스 체크 확인
   - 로그인 및 주요 기능 테스트

---

**계속 진행하세요! 곧 배포가 완료됩니다! 🚀**
