# 🚀 최종 배포 가이드 및 테스트 계정 정보

## 📋 배포 상태

✅ **GitHub 저장소**: 준비 완료
```
Repository: https://github.com/songport/church-admin
Latest Commit: 222a6f0 (feat: add MongoDB setup scripts and database initialization)
Branch: main
```

✅ **환경 설정**: 완료
```
.env 파일: ✅ 생성
MongoDB URI: ✅ 설정
JWT Secret: ✅ 설정
```

---

## 🎯 배포 단계 (수동 진행)

### Step 1: Vercel에 웹앱 배포

**URL**: https://vercel.com/dashboard

**진행 단계:**
1. `Add New` → `Project` 클릭
2. GitHub에서 `songport/church-admin` 선택
3. Root Directory: `./webapp` 선택
4. 환경 변수 추가:
   ```
   NEXT_PUBLIC_API_URL=https://church-admin-api.onrender.com
   NEXT_PUBLIC_APP_URL=https://church-admin-web.vercel.app
   ```
5. `Deploy` 클릭
6. ✅ "Live" 상태 확인

**예상 시간**: 3-5분

---

### Step 2: Render에 백엔드 배포

**URL**: https://dashboard.render.com

**진행 단계:**
1. `New +` → `Web Service` 클릭
2. GitHub에서 `songport/church-admin` 선택
3. 배포 설정:
   ```
   Name: church-admin-api
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm run start
   Instance Type: Free
   ```
4. 환경 변수 추가 (아래 참고)
5. `Create Web Service` 클릭
6. ✅ "Live" 상태 확인

**필요한 환경 변수:**
```
MONGODB_URI=mongodb+srv://songwonho_db_user:!finjomr9@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority
JWT_SECRET=church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?
NODE_ENV=production
FRONTEND_URL=https://church-admin-web.vercel.app
API_PORT=3000
API_HOST=0.0.0.0
DB_NAME=church-admin
```

**예상 시간**: 5-7분

---

### Step 3: 최종 설정

**Vercel 환경 변수 재설정 (선택):**

Render 배포 URL이 다른 경우:
1. Vercel 대시보드 → Settings
2. `NEXT_PUBLIC_API_URL` 업데이트
3. Deployments → Redeploy

---

## 🌐 배포 완료 후 접속 정보

### 웹앱 접속 URL

```
https://church-admin-web.vercel.app
```

### API 서버 URL

```
https://church-admin-api.onrender.com
```

### 헬스 체크 URL

```
https://church-admin-api.onrender.com/health
```

---

## 👥 테스트 계정 정보

배포 완료 후 다음 계정으로 로그인할 수 있습니다:

### 📌 관리자 계정

```
📧 Email:    admin@church.com
🔐 Password: admin123
👤 역할:     관리자

✅ 권한:
   - 출석 관리
   - 지출 결의서 작성
   - 결재 처리 (승인/반려)
   - 사용자 관리 (예정)
   - 시스템 설정 (예정)
```

### 📌 일반 사용자 계정

```
📧 Email:    user@church.com
🔐 Password: user123
👤 역할:     일반 사용자

✅ 권한:
   - 출석 관리 (체크인/체크아웃)
   - 지출 결의서 작성
   - 출석 기록 조회
   - 지출 현황 조회
   - 프로필 설정
```

---

## 🔐 계정 생성 방법

### 배포 후 API를 통한 계정 생성

**관리자 계정 생성:**
```bash
curl -X POST https://church-admin-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@church.com",
    "password": "admin123",
    "name": "교회 관리자",
    "role": "admin"
  }'
```

**일반 사용자 계정 생성:**
```bash
curl -X POST https://church-admin-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@church.com",
    "password": "user123",
    "name": "일반 사용자",
    "role": "user"
  }'
```

또는 웹 인터페이스에서 회원가입 후 역할을 수정합니다.

---

## 🧪 배포 확인

### 1️⃣ 웹앱 접속

```
https://church-admin-web.vercel.app
```

확인 사항:
- ✅ 페이지 로드 (3초 이내)
- ✅ 로그인 화면 표시
- ✅ 콘솔 에러 없음

### 2️⃣ API 헬스 체크

```
https://church-admin-api.onrender.com/health
```

응답 예시:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-01-29T..."
}
```

### 3️⃣ 로그인 테스트

1. 웹앱에서 로그인
2. Email: `admin@church.com`
3. Password: `admin123`
4. 로그인 성공 확인

---

## 📊 배포 후 확인 사항

| 항목 | 확인 |
|------|------|
| 웹앱 URL | https://church-admin-web.vercel.app |
| API URL | https://church-admin-api.onrender.com |
| 헬스 체크 | https://church-admin-api.onrender.com/health |
| 관리자 로그인 | admin@church.com / admin123 |
| 사용자 로그인 | user@church.com / user123 |
| MongoDB | Church cluster 연결 확인 |

---

## 🔧 배포 중 문제 해결

### Vercel 빌드 실패

**확인 사항:**
1. Settings → Deployments → 최신 배포의 Logs 확인
2. 환경 변수 정확성 확인
3. `.next` 폴더가 생성되었는지 확인

**해결 방법:**
- 로컬에서 `npm run build` 실행 후 확인
- 환경 변수 재설정 후 Redeploy

### Render 배포 실패

**확인 사항:**
1. 서비스 선택 → Logs 탭에서 에러 확인
2. 환경 변수 모두 설정되었는지 확인
3. Build & Start 명령어 정확성 확인

**해결 방법:**
```
Settings → Environment → Trigger Deploy → Clear build cache & Deploy
```

### API 연결 실패

**확인 사항:**
1. MongoDB Atlas에서 IP 화이트리스트 확인 (0.0.0.0/0)
2. MONGODB_URI 정확성 확인
3. Render 로그에서 MongoDB 연결 에러 확인

**MongoDB Atlas 확인:**
- https://www.mongodb.com/cloud/atlas
- Network Access → IP Whitelist (0.0.0.0/0)
- Database Access → 사용자 확인

---

## 📱 주요 기능

### 관리자 기능
- ✅ 출석 관리
- ✅ 지출 결의서 작성
- ✅ 결재 처리 (승인/반려)
- ✅ 통계 및 리포트
- ✅ 사용자 관리 (예정)

### 일반 사용자 기능
- ✅ 체크인/체크아웃 (GPS 기반)
- ✅ 출석 기록 조회
- ✅ 지출 결의서 작성
- ✅ 지출 현황 조회
- ✅ 프로필 관리

---

## 🚀 배포 순서 정리

1. **Vercel 배포** (3-5분)
   - 웹앱 URL 얻기

2. **Render 배포** (5-7분)
   - API URL 얻기

3. **최종 설정** (2분)
   - Vercel 환경 변수 업데이트 (필요시)

4. **테스트** (2-3분)
   - 로그인 확인
   - API 헬스 체크
   - 주요 기능 테스트

**총 소요시간: 12-17분**

---

## 📚 추가 정보

### GitHub 저장소
```
https://github.com/songport/church-admin
```

### 배포 모니터링
```
Vercel: https://vercel.com/dashboard
Render: https://dashboard.render.com
MongoDB: https://www.mongodb.com/cloud/atlas
```

### 로컬 개발 (필요시)

**백엔드 시작:**
```bash
cd c:\dev\church\backend
npm run dev
```

**웹앱 시작:**
```bash
cd c:\dev\church\webapp
npm run dev
```

**로컬 주소:**
```
http://localhost:3000 (웹앱 + API)
```

---

## ✅ 최종 체크리스트

### 배포 전
- [ ] GitHub 푸시 확인 (222a6f0)
- [ ] .env 파일 확인
- [ ] MongoDB URI 정확성 확인
- [ ] JWT_SECRET 정확성 확인

### 배포 중
- [ ] Vercel 프로젝트 임포트
- [ ] Vercel 환경 변수 설정
- [ ] Vercel Deploy 실행
- [ ] Render Web Service 생성
- [ ] Render 환경 변수 설정 (7개)
- [ ] Render Deploy 실행

### 배포 후
- [ ] 웹앱 URL 접속 확인
- [ ] API 헬스 체크 확인
- [ ] 관리자 로그인 확인
- [ ] 사용자 로그인 확인
- [ ] 주요 기능 테스트

---

## 🎉 완료!

**배포가 완료되면 다음 주소에서 사용할 수 있습니다:**

### 웹앱
```
https://church-admin-web.vercel.app
```

### 관리자 로그인
```
Email:    admin@church.com
Password: admin123
```

### 일반 사용자 로그인
```
Email:    user@church.com
Password: user123
```

### API 서버
```
https://church-admin-api.onrender.com
```

---

**배포 준비 완료!**
**지금 바로 배포를 진행하세요! 🚀**
