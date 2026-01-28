# Vercel 배포 가이드

## 📋 개요

주님의 교회 스마트 행정 앱의 백엔드를 Vercel Serverless Functions으로 배포하고, MongoDB Atlas를 사용하여 완전히 외부에서 접근 가능한 시스템을 구축합니다.

## 🏗️ 아키텍처

```
┌──────────────────────────────────────────────┐
│           사용자 (모바일/웹)                   │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│      Vercel Serverless Functions             │
│  (api/index.js - Express.js)                 │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│         MongoDB Atlas (클라우드)              │
│  (MongoDB 관리형 데이터베이스)                │
└──────────────────────────────────────────────┘
```

## 📦 사전 준비

### 필수 계정
1. **Vercel 계정**: https://vercel.com (GitHub, GitLab, Bitbucket으로 가입)
2. **MongoDB Atlas 계정**: https://www.mongodb.com/cloud/atlas
3. **GitHub 계정** (권장): 코드 관리용

### 설치된 도구
- Node.js (v16 이상)
- npm 또는 yarn
- Git
- Vercel CLI (선택사항)

## 📚 단계별 배포 가이드

### 1단계: MongoDB Atlas 설정

#### 1-1. MongoDB Atlas 계정 생성 및 로그인

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 방문
2. "Create your MongoDB Account" 클릭
3. 이메일로 가입하거나 Google/GitHub로 로그인

#### 1-2. 클러스터 생성

1. "Create a Deployment" 클릭
2. **M0 Free Tier** 선택 (무료)
3. Provider: **AWS**, Region: **Asia Pacific (ap-northeast-1)** 또는 가장 가까운 지역
4. "Create Cluster" 클릭
5. 클러스터 생성 완료 대기 (~10분)

#### 1-3. 데이터베이스 사용자 생성

1. "Database Access" → "Add New Database User"
2. **Username**: `churchadmin`
3. **Password**: 강력한 암호 입력 (저장해두세요!)
4. Role: **Built-in Role** → `readWriteAnyDatabase`
5. "Add User" 클릭

#### 1-4. IP 화이트리스트 설정

1. "Network Access" → "Add IP Address"
2. **Allow access from anywhere**: `0.0.0.0/0` 선택 (Vercel용)
   > ⚠️ 프로덕션에서는 Vercel IP만 화이트리스트하는 것이 안전합니다
3. "Confirm" 클릭

#### 1-5. 연결 문자열 복사

1. "Databases" → 클러스터 → "Connect"
2. "Connect your application" 선택
3. Driver: **Node.js**, Version: **4.x or later**
4. 연결 문자열 복사:
   ```
   mongodb+srv://churchadmin:<password>@cluster0.xxxxx.mongodb.net/church-admin?retryWrites=true&w=majority
   ```
5. `<password>`를 위에서 설정한 암호로 교체

**예시**:
```
mongodb+srv://churchadmin:MySecurePassword123!@cluster0.a1b2c3.mongodb.net/church-admin?retryWrites=true&w=majority
```

### 2단계: GitHub에 코드 푸시

#### 2-1. GitHub 저장소 생성

1. [GitHub](https://github.com) 로그인
2. "New Repository" 클릭
3. **Repository name**: `church-admin` (또는 원하는 이름)
4. **Public** 선택 (또는 Private)
5. "Create repository" 클릭

#### 2-2. 로컬 저장소에서 푸시

```bash
cd c:\dev\church

# Git 초기화 (처음이면)
git init

# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/church-admin.git

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Church Admin App"

# GitHub로 푸시
git branch -M main
git push -u origin main
```

### 3단계: Vercel에 배포

#### 3-1. Vercel 대시보드에서 배포

1. [Vercel Dashboard](https://vercel.com/dashboard) 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. "Import" 클릭

#### 3-2. 환경 변수 설정

"Environment Variables" 섹션에서 다음을 추가:

| 이름 | 값 |
|------|---|
| `MONGODB_URI` | MongoDB Atlas 연결 문자열 |
| `JWT_SECRET` | 강력한 임의 문자열 (예: `your_super_secret_jwt_key_2026_!@#$%^`) |
| `NODE_ENV` | `production` |
| `GOOGLE_VISION_API_KEY` | (선택사항) Google Vision API 키 |
| `FRONTEND_URL` | 프론트엔드 배포 주소 (나중에 추가) |

**환경 변수 예시**:

```
MONGODB_URI=mongodb+srv://churchadmin:MyPassword123!@cluster0.a1b2c3.mongodb.net/church-admin?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_2026_church_admin_!@#$%^

NODE_ENV=production

FRONTEND_URL=https://church-frontend.vercel.app
```

#### 3-3. 배포 실행

1. "Deploy" 클릭
2. Vercel이 자동으로 빌드 및 배포 시작
3. 배포 완료 대기 (~2-3분)
4. 배포 URL 확인 (예: `https://church-admin.vercel.app`)

### 4단계: API 테스트

배포 후 API가 정상 작동하는지 확인:

```bash
# 헬스 체크
curl https://church-admin.vercel.app/health

# 응답 예시:
# {
#   "success": true,
#   "message": "서버가 정상 작동 중입니다.",
#   "timestamp": "2026-01-28T10:30:00.000Z",
#   "environment": "production"
# }
```

#### Postman으로 테스트

1. Postman 열기
2. **POST** 요청 생성:
   ```
   https://church-admin.vercel.app/auth/login
   ```
3. Body (JSON):
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
4. "Send" 클릭
5. 응답 확인

### 5단계: 프론트엔드 설정

프론트엔드 앱에서 API URL을 Vercel 배포 URL로 업데이트:

#### `frontend/src/services/api.js` 수정:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
  || 'https://church-admin.vercel.app';  // Vercel 배포 URL
```

#### `.env.local` 생성:

```env
REACT_APP_API_BASE_URL=https://church-admin.vercel.app
```

### 6단계: 프론트엔드도 Vercel에 배포 (선택)

React Native 앱을 웹 버전으로 배포하려면:

1. `frontend` 디렉토리의 `package.json` 확인
2. GitHub에 별도 저장소로 푸시:
   ```bash
   cd frontend
   git init
   git remote add origin https://github.com/YOUR_USERNAME/church-admin-frontend.git
   git push -u origin main
   ```
3. Vercel에서 별도 프로젝트로 생성 및 배포

---

## 🔧 배포 후 관리

### 환경 변수 업데이트

Vercel 대시보드에서:
1. Project Settings → Environment Variables
2. 필요한 변수 수정
3. 자동으로 재배포됨

### 로그 확인

```bash
# Vercel CLI 설치 (선택)
npm install -g vercel

# 로그 확인
vercel logs https://church-admin.vercel.app --follow
```

또는 Vercel 대시보드의 "Deployments" → "Logs" 에서 확인

### 도메인 연결

Vercel 대시보드에서 커스텀 도메인 설정:
1. Project Settings → Domains
2. "Add Domain" 클릭
3. 도메인명 입력
4. DNS 설정 완료

**예시 도메인**: `api.church.com`

---

## 🚀 활용

### 모바일 앱에서 API 호출

```javascript
// 로그인 예시
const response = await fetch('https://church-admin.vercel.app/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user1', password: 'password123' })
});

const data = await response.json();
console.log(data);
```

### cURL 명령어

```bash
# 출석자 조회
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://church-admin.vercel.app/attendance/today

# 결재선 생성
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"기본 결재선","approvers":[...]}' \
  https://church-admin.vercel.app/approval-lines
```

---

## ⚠️ 중요 주의사항

### 보안

1. **JWT_SECRET**: 절대로 노출하지 않을 것
   - 최소 32자 이상의 임의 문자열 사용
   - 추천: `openssl rand -base64 32`

2. **MongoDB 비밀번호**: 저장해두되 노출 금지
   - Vercel 환경 변수에만 저장
   - GitHub에 커밋 금지

3. **IP 화이트리스트**:
   - 개발: `0.0.0.0/0` (모든 IP)
   - 프로덕션: Vercel IP만 화이트리스트

### 비용

- **Vercel**: 프로 플랜까지 무료 (월 $20부터 유료)
- **MongoDB Atlas**: M0 (무료) ~ M2 (유료)
  - M0: 512MB 저장소 (테스트용)
  - M2: 2GB 저장소 (소규모)

### 성능

- Vercel 콜드 스타트: ~1-2초 (첫 요청)
- 이후 요청: ~100-300ms
- MongoDB 네트워크 왕복: ~50-100ms

---

## 🔄 지속적 배포 (CI/CD)

### GitHub Push 시 자동 배포

Vercel은 GitHub 연결 시 자동으로:
1. `main` 브랜치 push 감지
2. 자동 빌드
3. 배포 완료

### 배포 상태 확인

```bash
# Vercel 대시보드에서 확인
# Project → Deployments
```

---

## 📊 배포 후 모니터링

### API 응답 시간 확인

```bash
time curl https://church-admin.vercel.app/health
```

### 에러 모니터링

Vercel 대시보드:
- Deployments → Logs 탭에서 실시간 로그 확인
- 에러 발생 시 즉시 알림 설정 가능

---

## 🎯 체크리스트

배포 전 확인사항:

- [ ] MongoDB Atlas 계정 생성
- [ ] 클러스터 생성 (M0 무료)
- [ ] 데이터베이스 사용자 생성
- [ ] 연결 문자열 복사
- [ ] IP 화이트리스트 설정 (0.0.0.0/0)
- [ ] GitHub 저장소 생성
- [ ] 코드 푸시
- [ ] Vercel 계정 생성
- [ ] 프로젝트 import
- [ ] 환경 변수 설정
- [ ] 배포 실행
- [ ] API 테스트 (GET /health)
- [ ] 로그인 테스트
- [ ] 프론트엔드 API URL 업데이트

---

## 🆘 문제 해결

### 배포 실패

**로그 확인**:
```
Vercel Dashboard → Deployments → 최신 배포 → Logs
```

**일반적인 오류**:

1. **모듈을 찾을 수 없음**
   ```
   Error: Cannot find module 'express'
   ```
   해결: `npm install` 이후 푸시

2. **MongoDB 연결 실패**
   ```
   MongooseError: connect ECONNREFUSED
   ```
   해결: 
   - MONGODB_URI 환경 변수 확인
   - IP 화이트리스트 확인 (0.0.0.0/0 설정)

3. **환경 변수 누락**
   ```
   Error: JWT_SECRET is not defined
   ```
   해결: Vercel 대시보드에서 환경 변수 추가

### API가 느린 경우

1. **MongoDB 쿼리 최적화**
   - 인덱스 생성
   - 불필요한 필드 제외

2. **Vercel 프로는 비용 발생**
   - M2 또는 이상 플랜으로 업그레이드

### CORS 오류

프론트엔드에서 요청 실패:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

해결:
1. `api/index.js`의 CORS 설정 확인
2. `FRONTEND_URL` 환경 변수 추가
3. 재배포

---

## 📞 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [MongoDB Atlas 튜토리얼](https://docs.atlas.mongodb.com/)
- [Express.js + MongoDB](https://expressjs.com/)

---

**배포 완료 후 외부에서 자유롭게 접근할 수 있습니다!** 🎉

배포 URL: `https://church-admin.vercel.app` (예시)

---

*Last Updated: 2026-01-28*
