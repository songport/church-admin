# Vercel 환경 변수 설정 가이드

## 필수 환경 변수

### 1. MONGODB_URI (필수)
MongoDB Atlas 연결 문자열

**예시:**
```
mongodb+srv://churchadmin:password@cluster0.xxxxx.mongodb.net/church-admin?retryWrites=true&w=majority
```

**설정 방법:**
1. MongoDB Atlas → Databases → Connect
2. "Connect your application" 선택
3. Node.js 4.x or later 선택
4. 연결 문자열 복사
5. `<password>` 를 실제 데이터베이스 사용자 비밀번호로 교체
6. Vercel Dashboard → Project Settings → Environment Variables
7. Variable Name: `MONGODB_URI`
8. Value에 위 문자열 붙여넣기

### 2. JWT_SECRET (필수)
JWT 토큰 서명을 위한 시크릿 키

**생성 방법:**

#### Windows PowerShell:
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..64 | ForEach-Object {
  $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  $chars[(Get-Random -Maximum $chars.Length)]
}) -join ''))
```

#### macOS/Linux:
```bash
openssl rand -base64 32
```

#### 또는 간단하게:
```
church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?
```

**요구사항:**
- 최소 32글자
- 대문자, 소문자, 숫자, 특수문자 포함
- 절대 공개하지 말 것!

### 3. NODE_ENV (권장)
노드 환경 설정

**값:** `production`

---

## 선택 환경 변수

### 4. FRONTEND_URL
프론트엔드 애플리케이션 URL (CORS 설정용)

**예시:**
```
https://church-app.vercel.app
```

또는 로컬 개발:
```
http://localhost:3000
```

### 5. GOOGLE_VISION_API_KEY
Google Cloud Vision API 키 (OCR 기능용)

**설정 방법:**
1. Google Cloud Console → Create Project
2. Enable "Cloud Vision API"
3. Service Account 생성
4. JSON 키 다운로드
5. 또는 REST API 키 생성
6. Vercel에 키 입력

**아직 구현되지 않음** - Phase 3에서 예정

---

## Vercel에서 환경 변수 설정하는 방법

### 방법 1: Vercel Dashboard (권장)
```
1. Vercel Dashboard 접속 (https://vercel.com/dashboard)
2. 프로젝트 선택 (church-admin)
3. Settings 탭 클릭
4. Environment Variables 섹션
5. "Add New" 클릭
6. Variable Name, Value 입력
7. Select Environments: Production, Preview, Development 선택
8. "Save" 클릭
```

### 방법 2: Vercel CLI
```bash
# 설치
npm install -g vercel

# 로그인
vercel login

# 환경 변수 추가
vercel env add MONGODB_URI
# 값 입력: mongodb+srv://churchadmin:password@...

vercel env add JWT_SECRET
# 값 입력: your_secret_key_here

vercel env add NODE_ENV
# 값 입력: production
```

### 방법 3: .env.local (로컬 개발용)
프로젝트 루트에 `.env.local` 파일 생성:

```env
MONGODB_URI=mongodb+srv://churchadmin:password@cluster0.xxxxx.mongodb.net/church-admin?retryWrites=true&w=majority
JWT_SECRET=church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

⚠️ **중요**: `.env.local`은 `.gitignore`에 추가하여 절대 GitHub에 커밋하지 말 것!

---

## 환경별 설정 다르게 하기

Vercel에서는 환경(Production, Preview, Development)마다 다른 값을 설정할 수 있습니다.

### 프로덕션 환경
```
MONGODB_URI = mongodb+srv://churchadmin:password@cluster0-prod.mongodb.net/church-admin
JWT_SECRET = production-secret-key-here
NODE_ENV = production
```

### 프리뷰/개발 환경
```
MONGODB_URI = mongodb+srv://churchadmin:password@cluster0-dev.mongodb.net/church-admin
JWT_SECRET = development-secret-key-here
NODE_ENV = development
```

---

## 환경 변수 확인하기

배포된 앱에서 환경 변수가 제대로 로드되는지 확인:

```bash
# 헬스 체크 (환경 정보 포함)
curl https://church-admin.vercel.app/health

# 응답 예시:
{
  "success": true,
  "message": "서버가 정상 작동 중입니다.",
  "timestamp": "2026-01-28T00:00:00.000Z",
  "environment": "production"
}
```

---

## 트러블슈팅

### 문제: "MONGODB_URI is not defined"
```
해결책:
1. Vercel Dashboard에서 MONGODB_URI 변수 확인
2. 값이 올바르게 입력되었는지 확인
3. 배포 다시 실행: Deployments → 최신 배포 우측 메뉴 → Redeploy
4. 로그 확인: Deployments → 배포 선택 → Logs 탭
```

### 문제: "JWT_SECRET not provided"
```
해결책:
1. JWT_SECRET 값이 입력되었는지 확인
2. 특수문자가 있으면 따옴표로 감싸기
3. 필요시 URL 인코딩: ! → %21, # → %23
```

### 문제: 배포 후에도 이전 값 사용됨
```
해결책:
1. Vercel Dashboard → Deployments
2. 최신 배포의 우측 메뉴 → Redeploy
3. 새로운 환경 변수로 다시 배포됨
```

---

## 보안 체크리스트

- [ ] JWT_SECRET이 강력한가? (32글자 이상, 특수문자 포함)
- [ ] 환경 변수가 Vercel에만 저장되었는가?
- [ ] `.env` 파일이 `.gitignore`에 있는가?
- [ ] MongoDB 비밀번호가 URL에 올바르게 인코딩되었는가?
- [ ] 프로덕션 환경에만 실제 값을 사용했는가?
- [ ] 개발 환경은 별도의 MongoDB 클러스터를 사용하는가?

---

## 다음 단계

1. ✅ MongoDB Atlas에서 연결 문자열 복사
2. ✅ 강력한 JWT_SECRET 생성
3. ✅ Vercel Dashboard에서 환경 변수 설정
4. ✅ 배포 실행
5. ✅ `/health` 엔드포인트로 테스트
6. ✅ 로그인 테스트
7. ✅ 프론트엔드 API URL 업데이트

---

*마지막 업데이트: 2026-01-28*
