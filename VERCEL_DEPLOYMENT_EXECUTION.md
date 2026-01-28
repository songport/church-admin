# 🚀 Vercel 배포 실행 가이드 (MongoDB Atlas 연동)

## ✅ 준비 완료!

MongoDB URI: `mongodb+srv://songwonho_db_user:<db_password>@church.adaqcxm.mongodb.net/?appName=church`

이제 3가지 단계로 Vercel 배포를 완료합니다:
1. **GitHub에 코드 푸시** (5분)
2. **Vercel에 배포** (5분)
3. **API 테스트** (5분)

---

## 📍 Step 1: GitHub에 코드 푸시 (5분)

### 1-1. GitHub 저장소 생성

```
1. https://github.com/new 접속
2. Repository name: church-admin
3. Description: Smart Church Administration App
4. Public 선택
5. "Create repository" 클릭
```

### 1-2. PowerShell에서 코드 푸시

```powershell
# 프로젝트 폴더로 이동
cd c:\dev\church

# Git 초기화 및 설정
git init
git config user.name "Your Name"
git config user.email "songwonho@gmail.com"

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Church Admin App with Vercel deployment setup"

# 원격 저장소 연결 (YOUR_USERNAME을 실제 GitHub 계정명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/church-admin.git

# main 브랜치로 변경
git branch -M main

# 푸시
git push -u origin main
```

**예시:**
```powershell
git remote add origin https://github.com/songwonho/church-admin.git
```

✅ GitHub에 코드가 푸시되었는지 확인:
- https://github.com/YOUR_USERNAME/church-admin
- 모든 폴더(api, backend, frontend, docs 등)가 보여야 함

---

## 📍 Step 2: Vercel에 배포 (5분)

### 2-1. Vercel 계정 생성 및 로그인

```
1. https://vercel.com 접속
2. "Sign Up" 클릭
3. GitHub으로 로그인
4. 권한 허용
```

### 2-2. 프로젝트 생성

```
1. Vercel Dashboard: https://vercel.com/dashboard
2. "New Project" 클릭
3. GitHub 저장소 선택 (church-admin)
4. "Import" 클릭
```

### 2-3. 빌드 설정

**Framework Preset**: Other
**Root Directory**: ./

프로젝트 설정 페이지에서:
```
Build Command: cd backend && npm install && npm run build
Output Directory: backend
```

### 2-4. 환경 변수 설정 ⭐ 중요

"Environment Variables" 섹션에서 다음 3개 변수를 추가합니다:

#### 1️⃣ MONGODB_URI (필수)
```
Name: MONGODB_URI
Value: mongodb+srv://songwonho_db_user:<db_password>@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority
Environments: Production, Preview, Development 모두 선택
```

⚠️ **<db_password>를 실제 비밀번호로 교체하세요!**

**예시:**
```
mongodb+srv://songwonho_db_user:MyPassword123!@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority
```

#### 2️⃣ JWT_SECRET (필수)
```
Name: JWT_SECRET
Value: church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?
Environments: Production, Preview, Development 모두 선택
```

또는 더 강력한 키 생성:
```powershell
# PowerShell에서 실행
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..64 | ForEach-Object {
  $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  $chars[(Get-Random -Maximum $chars.Length)]
}) -join ''))
```

#### 3️⃣ NODE_ENV (권장)
```
Name: NODE_ENV
Value: production
Environments: Production 선택
```

### 2-5. 배포 실행

```
1. 모든 환경 변수 입력 확인
2. "Deploy" 버튼 클릭
3. 배포 진행 상황 모니터링 (1-3분)
4. "Deployment Complete" 메시지 확인
```

✅ 배포 URL 확인:
```
https://church-admin.vercel.app (예시)
실제 URL은 Vercel 대시보드에 표시됨
```

---

## 📍 Step 3: API 테스트 (5분)

### 3-1. 헬스 체크

```bash
curl https://church-admin.vercel.app/health
```

또는 브라우저에서:
```
https://church-admin.vercel.app/health
```

**성공 응답:**
```json
{
  "success": true,
  "message": "서버가 정상 작동 중입니다.",
  "timestamp": "2026-01-28T...",
  "environment": "production"
}
```

### 3-2. 웹 대시보드에서 테스트

```
https://church-admin.vercel.app/dashboard
```

이 페이지에서 모든 API를 테스트할 수 있습니다:
- 로그인 (username: admin, password: admin123)
- 출석 조회
- 결재 라인 관리 등

### 3-3. 로그인 테스트

```bash
curl -X POST https://church-admin.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**성공 응답:**
```json
{
  "success": true,
  "message": "로그인 성공",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "username": "admin",
    "role": "admin"
  }
}
```

---

## 🎯 배포 완료 체크리스트

배포 전:
- [ ] GitHub 저장소 생성
- [ ] 로컬에서 `git push` 실행
- [ ] GitHub에 코드 확인

배포 중:
- [ ] Vercel 프로젝트 생성
- [ ] MONGODB_URI 환경 변수 설정
- [ ] JWT_SECRET 환경 변수 설정
- [ ] NODE_ENV 환경 변수 설정
- [ ] Deploy 클릭

배포 후:
- [ ] `/health` 엔드포인트 테스트 (200 OK)
- [ ] `/auth/login` 테스트 (JWT 토큰 받기)
- [ ] `/dashboard` 접속 (웹 UI 확인)
- [ ] MongoDB 데이터 저장 확인

---

## 🌐 배포 후 주소

| 기능 | URL |
|------|-----|
| **홈** | `https://church-admin.vercel.app` |
| **헬스 체크** | `https://church-admin.vercel.app/health` |
| **API 테스트 도구** | `https://church-admin.vercel.app/dashboard` |
| **로그인** | `POST /auth/login` |
| **오늘 출석 조회** | `GET /attendance/today` |

---

## 🆘 배포 문제 해결

### ❌ "MONGODB_URI not defined" 오류

**원인**: 환경 변수 설정 누락

**해결:**
```
1. Vercel Dashboard → Project Settings
2. Environment Variables 확인
3. MONGODB_URI가 있는지 확인
4. 없으면 추가
5. Deployments → 최신 배포 → Redeploy
```

### ❌ "Authentication failed" 오류

**원인**: MongoDB 비밀번호 오류

**해결:**
```
1. 비밀번호가 정확한지 확인
2. 특수문자 URL 인코딩 확인:
   ! → %21
   # → %23
   $ → %24
   @ → %40
3. 환경 변수 업데이트
4. 배포 다시 실행
```

### ❌ "Build failed" 오류

**원인**: 빌드 명령어 오류

**해결:**
```
1. Vercel Dashboard → Deployments → 최신 배포
2. Logs 탭에서 오류 메시지 확인
3. 로컬에서 build 테스트:
   cd backend
   npm install
   npm run build
4. 오류 수정 후 git push
5. Vercel에서 자동 재배포
```

### ❌ 데이터베이스 연결 안 됨

**원인**: IP 화이트리스트 설정

**해결:**
```
1. MongoDB Atlas → Network Access
2. "Allow access from anywhere" (0.0.0.0/0) 확인
3. 없으면 추가하기
4. Vercel 배포 재실행 (Redeploy)
```

---

## 📱 프론트엔드 연결 (선택)

프론트엔드에서 API 사용:

### React Native/Expo

**파일**: `frontend/src/services/api.js`

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
  || 'https://church-admin.vercel.app';  // 배포된 API URL

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};
```

### 환경 변수 설정

**파일**: `frontend/.env.local`

```env
REACT_APP_API_BASE_URL=https://church-admin.vercel.app
```

---

## 📊 배포 후 다음 단계

### ✅ 즉시 (필수)
- [ ] API 헬스 체크 성공 확인
- [ ] 로그인 테스트 성공 확인
- [ ] 웹 대시보드 접속 확인

### ⏳ 추후 (권장)
- [ ] 프론트엔드 API URL 업데이트
- [ ] 전체 기능 테스트
- [ ] MongoDB Atlas IP 화이트리스트 제한 (선택)
- [ ] 커스텀 도메인 추가 (선택)

### 📅 Phase 3 계획
- [ ] Google Vision API 통합 (OCR)
- [ ] 전자 결재 워크플로우 완성
- [ ] 웹 관리 대시보드
- [ ] WebSocket 실시간 업데이트

---

## 💡 팁

### 🔐 보안
```
✅ 환경 변수는 Vercel에만 저장
✅ MongoDB 비밀번호를 GitHub에 커밋 금지
✅ .env 파일을 .gitignore에 추가 (이미 설정됨)
```

### 🚀 성능
```
✅ 첫 요청 3-5초는 Vercel Cold Start (정상)
✅ 두 번째부터 빠름
✅ MongoDB M0는 성능 제한 있음 (무료 플랜)
```

### 📈 모니터링
```
✅ Vercel Dashboard에서 로그 확인
✅ 배포 후 정기적으로 /health 테스트
✅ 오류 발생시 Logs 탭에서 디버깅
```

---

## 📞 참고 자료

- **Vercel 문서**: https://vercel.com/docs
- **MongoDB Atlas**: https://cloud.mongodb.com
- **API 문서**: [docs/API.md](./docs/API.md)
- **상세 배포 가이드**: [docs/DEPLOYMENT_VERCEL.md](./docs/DEPLOYMENT_VERCEL.md)

---

**준비되셨으면 지금 바로 배포를 시작하세요!** 🚀

1. GitHub에 코드 푸시
2. Vercel에 프로젝트 생성
3. 환경 변수 3개 설정
4. Deploy 클릭
5. /dashboard에서 테스트

**총 소요 시간: 약 15-20분**

---

*생성: 2026-01-28*
