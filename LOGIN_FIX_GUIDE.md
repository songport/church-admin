# 🔧 로그인 에러 수정 완료

## 🐛 발견된 문제

**credential 에러 원인**: 스키마 불일치

```
❌ 문제:
- User 모델: username + email 필드 사용
- 테스트 계정: email만 저장
- 로그인 요청: username으로 검색
= 계정 찾기 실패 → credential 에러
```

---

## ✅ 수정 사항

### 1. **백엔드 (Backend) 수정**

#### [backend/src/controllers/userController.js](backend/src/controllers/userController.js)
```javascript
// 변경 전: username 기반 로그인
const { username, password } = req.body;
const user = await User.findOne({ username });

// 변경 후: email 기반 로그인
const { email, password } = req.body;
const user = await User.findOne({ email: email.toLowerCase() });
```

#### [backend/src/routes/userRoutes.js](backend/src/routes/userRoutes.js)
```javascript
// 변경 전
body('username').notEmpty()

// 변경 후
body('email').isEmail()
```

---

### 2. **웹앱 (Frontend) 수정**

#### [webapp/src/lib/api.ts](webapp/src/lib/api.ts)
```typescript
// 변경 전
login: (username: string, password: string) =>
  apiClient.post('/auth/login', { username, password })

// 변경 후
login: (email: string, password: string) =>
  apiClient.post('/auth/login', { email, password })
```

#### [webapp/src/stores/authStore.ts](webapp/src/stores/authStore.ts)
```typescript
// 로그인 함수 파라미터 변경
login: async (email: string, password: string) => {
  const response = await authAPI.login(email, password);
  // ...
}
```

#### [webapp/src/app/login/page.tsx](webapp/src/app/login/page.tsx)
```typescript
// 변경 전
const [username, setUsername] = useState('');

// 변경 후
const [email, setEmail] = useState('');

// Input 필드도 변경
<Input
  label="이메일"
  type="email"
  placeholder="이메일 입력"
  value={email}
/>

// 테스트 계정 정보 업데이트
<p>관리자: admin@church.com / admin123</p>
<p>사용자: user@church.com / user123</p>
```

---

## 🧪 테스트 계정

### 관리자 (Admin)
```
📧 Email:    admin@church.com
🔐 Password: admin123
👤 Role:    admin
```

### 일반 사용자 (User)
```
📧 Email:    user@church.com
🔐 Password: user123
👤 Role:    user
```

---

## 📝 배포 전 필수 작업

### 1️⃣ MongoDB에 테스트 계정 생성

**방법 A: MongoDB Atlas 콘솔에서 직접 생성**
```javascript
db.users.insertMany([
  {
    username: "admin",
    email: "admin@church.com",
    password: "$2a$10$...", // bcryptjs로 'admin123' 해싱
    name: "교회 관리자",
    role: "admin",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: "user",
    email: "user@church.com",
    password: "$2a$10$...", // bcryptjs로 'user123' 해싱
    name: "일반 사용자",
    role: "user",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

**방법 B: Render에서 백엔드 배포 후, API를 통해 생성**

---

### 2️⃣ 코드 푸시

```bash
git add -A
git commit -m "fix: email-based login instead of username"
git push origin main
```

---

### 3️⃣ 배포 재설정

#### Vercel (웹앱)
- 환경 변수 확인:
  - `NEXT_PUBLIC_API_URL=https://church-admin-api.onrender.com`

#### Render (백엔드)
- 환경 변수 확인:
  - `MONGODB_URI=mongodb+srv://...`
  - `JWT_SECRET=...`

---

## 🧪 테스트 방법

1. **웹앱 접속**
   ```
   https://church-admin-web.vercel.app/login
   ```

2. **로그인 시도**
   ```
   Email: admin@church.com
   Password: admin123
   ```

3. **성공 확인**
   - ✅ 로그인 성공
   - ✅ 대시보드 접속
   - ✅ 관리자 권한 확인

---

## 🔐 보안 주의사항

⚠️ **민감 정보 노출 위험!**

### 현재 상태 확인:
- [ ] GitHub에 `.env` 파일 푸시됨? → **제거 필수**
- [ ] API 응답에 비밀번호 포함? → **검토 필수**

### 수정 필요:
```bash
# 1. .env 파일 제거 (이미 배포되었으면)
git rm --cached .env
git commit -m "remove: .env file with sensitive data"

# 2. 비밀번호 변경
# - MongoDB 사용자 비밀번호 변경
# - JWT Secret 변경
# - 테스트 계정 비밀번호 변경
```

---

## 📞 문제 발생 시

### 로그인 실패 (credential 에러)
```
1. 테스트 계정이 MongoDB에 생성되었는가?
2. email 필드가 올바르게 저장되었는가?
3. 비밀번호가 bcryptjs로 해싱되었는가?

확인:
db.users.find({ email: "admin@church.com" })
```

### 401 Unauthorized
```
1. API 응답 상태 확인
2. MONGODB_URI 연결 상태 확인
3. Render 로그 확인: https://dashboard.render.com
```

### CORS 에러
```
확인: API 서버가 CORS 허용 설정이 있는가?
backend/server.js에서 FRONTEND_URL 확인
```

---

## 📋 체크리스트

- [x] email 기반 로그인으로 변경
- [x] 웹앱 UI 업데이트
- [ ] 테스트 계정 생성
- [ ] 코드 푸시
- [ ] Vercel 배포
- [ ] Render 배포
- [ ] 로그인 테스트
- [ ] 보안 검토

---

**이제 배포하면 로그인이 정상 작동할 것입니다! 🚀**
