# 🚀 Vercel 배포 빠른 시작 가이드

5분 안에 Vercel로 배포하기!

## 📋 사전 준비

- GitHub 계정 (https://github.com)
- Vercel 계정 (https://vercel.com)
- MongoDB Atlas 계정 (https://www.mongodb.com/cloud/atlas)

## ⚡ 1단계: MongoDB 설정 (2분)

### 1-1. MongoDB Atlas에 로그인
https://www.mongodb.com/cloud/atlas → 로그인

### 1-2. 클러스터 생성
```
1. "Create a Deployment" 클릭
2. M0 Free Tier 선택
3. Provider: AWS, Region: Asia Pacific 선택
4. "Create Cluster" 클릭
5. 대기 (~10분)
```

### 1-3. 데이터베이스 사용자 생성
```
Database Access → Add New Database User
Username: churchadmin
Password: (강력한 암호 설정 및 저장)
Role: readWriteAnyDatabase
"Add User" 클릭
```

### 1-4. IP 화이트리스트 설정
```
Network Access → Add IP Address
"Allow access from anywhere" (0.0.0.0/0)
"Confirm" 클릭
```

### 1-5. 연결 문자열 복사
```
Databases → Connect → Connect your application
Node.js 4.x or later
연결 문자열 복사:
mongodb+srv://churchadmin:<password>@cluster0.xxxxx.mongodb.net/church-admin?retryWrites=true&w=majority

<password>를 위에서 설정한 암호로 교체
```

**저장된 연결 문자열 예시**:
```
mongodb+srv://churchadmin:MyPassword123!@cluster0.a1b2c3.mongodb.net/church-admin?retryWrites=true&w=majority
```

## ⚡ 2단계: GitHub에 코드 푸시 (2분)

### 2-1. GitHub 저장소 생성
```
1. https://github.com/new
2. Repository name: church-admin
3. "Create repository" 클릭
```

### 2-2. 코드 푸시
```bash
cd c:\dev\church

git init
git remote add origin https://github.com/YOUR_USERNAME/church-admin.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## ⚡ 3단계: Vercel에 배포 (1분)

### 3-1. Vercel 대시보드 접속
https://vercel.com/dashboard → 로그인

### 3-2. 프로젝트 추가
```
1. "New Project" 클릭
2. GitHub 저장소 선택 (church-admin)
3. "Import" 클릭
```

### 3-3. 환경 변수 설정
"Environment Variables" 섹션에서:

```
이름: MONGODB_URI
값: mongodb+srv://churchadmin:MyPassword123!@cluster0.a1b2c3.mongodb.net/church-admin?retryWrites=true&w=majority

이름: JWT_SECRET
값: your_super_secret_jwt_key_2026_church_!@#$%^

이름: NODE_ENV
값: production
```

**각 변수를 추가한 후 "Save" 클릭**

### 3-4. 배포 실행
```
"Deploy" 클릭
배포 완료 대기 (~2-3분)
```

## ✅ 배포 완료!

배포 URL 확인:
- https://church-admin.vercel.app (예시)

## 🧪 API 테스트

### 방법 1: 웹 대시보드 (가장 쉬움)
```
https://YOUR_VERCEL_URL/dashboard
```

### 방법 2: cURL로 테스트
```bash
# 헬스 체크
curl https://church-admin.vercel.app/health

# 로그인
curl -X POST https://church-admin.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 방법 3: Postman으로 테스트
1. Postman 열기
2. POST 요청 생성
3. URL: `https://church-admin.vercel.app/auth/login`
4. Body (JSON):
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
5. "Send" 클릭

## 📱 프론트엔드에서 API 연결

프론트엔드 설정 파일 수정:

### `frontend/src/services/api.js`
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
  || 'https://church-admin.vercel.app';  // 배포 URL
```

### `frontend/.env.local`
```env
REACT_APP_API_BASE_URL=https://church-admin.vercel.app
```

## 🔐 주의사항

### 중요: 절대 하지 말 것!
- ❌ JWT_SECRET을 GitHub에 커밋
- ❌ MongoDB 비밀번호를 코드에 입력
- ❌ IP를 제한하지 않은 상태로 프로덕션 배포

### 권장: 해야 할 것
- ✅ Vercel 환경 변수에만 민감한 정보 저장
- ✅ JWT_SECRET을 강력한 임의 문자열로 설정
- ✅ 프로덕션 환경에서는 MongoDB IP 화이트리스트 제한

## 🆘 문제 해결

### 배포 실패
```
Vercel Dashboard → Deployments → 최신 배포 → Logs 확인
```

### MongoDB 연결 실패
```
Error: MongooseError: connect ECONNREFUSED

해결책:
1. MONGODB_URI 환경 변수 확인
2. MongoDB Atlas IP 화이트리스트 확인 (0.0.0.0/0)
3. 비밀번호에 특수문자가 있으면 URL 인코딩 필요
   예: ! → %21, # → %23, $ → %24
```

### API가 느린 경우
```
1. MongoDB M0 (무료)는 성능 제한 있음
2. M2 또는 이상으로 업그레이드 권장
3. 인덱스 추가로 쿼리 성능 향상
```

### CORS 오류
```
Access to XMLHttpRequest blocked by CORS policy

해결책:
1. api/index.js의 CORS 설정 확인
2. FRONTEND_URL 환경 변수 추가
3. 재배포
```

## 📊 예상 비용

| 서비스 | 가격 |
|--------|------|
| Vercel (프로) | 무료 |
| MongoDB Atlas (M0) | 무료 |
| MongoDB Atlas (M2) | $9/월 |
| **합계** | **무료~$9/월** |

## 🎯 배포 후 추천 작업

1. **도메인 연결** (선택)
   - Vercel Dashboard → Project Settings → Domains
   - 커스텀 도메인 추가

2. **자동 배포 설정**
   - GitHub push 시 자동 배포 (기본 활성화)

3. **로그 모니터링**
   - Vercel Dashboard → Deployments → Logs

4. **성능 최적화**
   - 불필요한 의존성 제거
   - 데이터베이스 인덱스 추가

## 📞 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [MongoDB Atlas 튜토리얼](https://docs.atlas.mongodb.com/)
- [상세 배포 가이드](./DEPLOYMENT_VERCEL.md)
- [API 문서](./API.md)

---

## ✨ 완료 체크리스트

- [ ] MongoDB Atlas 클러스터 생성
- [ ] 데이터베이스 사용자 생성
- [ ] IP 화이트리스트 설정
- [ ] 연결 문자열 복사
- [ ] GitHub 저장소 생성
- [ ] 코드 푸시
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] 배포 실행
- [ ] API 테스트 (/health)
- [ ] 로그인 테스트 (/auth/login)
- [ ] 프론트엔드 API URL 업데이트

---

**축하합니다! 이제 외부에서도 접근 가능한 API 서버가 준비되었습니다! 🎉**

배포 URL: `https://church-admin.vercel.app` (예시)

---

*Last Updated: 2026-01-28*
