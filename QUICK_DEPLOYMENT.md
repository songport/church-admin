# ⚡ 5분 배포 가이드

가장 빠르게 배포하는 방법입니다. 자세한 내용은 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)를 참고하세요.

---

## 🚀 배포 순서 (총 15-20분)

### 1️⃣ MongoDB 설정 (5분)

```
👉 https://www.mongodb.com/cloud/atlas
→ 클러스터 생성 (M0 무료)
→ 사용자 생성: churchadmin / password
→ IP 화이트리스트: 0.0.0.0/0
→ 연결 문자열 복사
```

`.env` 파일 생성:
```bash
MONGODB_URI=mongodb+srv://churchadmin:password@...
JWT_SECRET=random-secret-key-change-this
NODE_ENV=production
FRONTEND_URL=https://church-admin-web.vercel.app
```

---

### 2️⃣ GitHub에 푸시 (2분)

```bash
cd c:\dev\church
git add .
git commit -m "Deploy to production"
git remote add origin https://github.com/YOUR_USERNAME/church-admin.git
git push -u origin main
```

---

### 3️⃣ Vercel에 웹앱 배포 (3분)

```
👉 https://vercel.com/dashboard
→ GitHub 로그인
→ New Project
→ church-admin 저장소 선택
→ Root Directory: ./webapp
→ Deploy
```

환경 변수 추가:
```
NEXT_PUBLIC_API_URL=https://church-admin-api.onrender.com
```

✅ 배포 완료! URL: `https://church-admin-web.vercel.app`

---

### 4️⃣ Render에 백엔드 배포 (5분)

```
👉 https://dashboard.render.com
→ GitHub 로그인
→ New Web Service
→ church-admin 저장소 선택
→ Name: church-admin-api
→ Build Command: cd backend && npm install
→ Start Command: cd backend && npm run start
```

환경 변수 추가:
```
MONGODB_URI=mongodb+srv://churchadmin:password@...
JWT_SECRET=random-secret-key-change-this
NODE_ENV=production
FRONTEND_URL=https://church-admin-web.vercel.app
```

✅ 배포 완료! URL: `https://church-admin-api.onrender.com`

---

### 5️⃣ Vercel 환경 변수 업데이트 (1분)

Vercel 대시보드:
```
Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://church-admin-api.onrender.com
Redeploy
```

---

## ✅ 테스트

```bash
# 헬스 체크
curl https://church-admin-api.onrender.com/health

# 웹앱 접속
https://church-admin-web.vercel.app
```

---

## 📊 배포 아키텍처

```
웹브라우저
    ↓
Vercel (Next.js)
    ↓ ↕️ API 호출
Render (Node.js)
    ↓
MongoDB Atlas
```

---

## 🎯 최종 URL

| 서비스 | URL |
|--------|-----|
| 웹앱 | https://church-admin-web.vercel.app |
| API | https://church-admin-api.onrender.com |
| 헬스체크 | https://church-admin-api.onrender.com/health |

---

더 자세한 내용은 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)를 참고하세요.
