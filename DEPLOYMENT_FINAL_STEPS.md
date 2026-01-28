# ✅ Vercel 배포 최종 가이드

## 🎉 축하합니다!

MongoDB 계정이 준비되었고, **이제 외부 배포를 시작할 시간입니다!** 🚀

---

## 📊 현재 상태

| 항목 | 상태 |
|------|------|
| MongoDB 계정 | ✅ 준비됨 (songwonho@gmail.com) |
| MongoDB 클러스터 | ✅ 생성됨 (church) |
| MongoDB URI | ✅ 획득함 |
| 백엔드 코드 | ✅ 준비됨 |
| Vercel 설정 파일 | ✅ 완료됨 |
| 문서 | ✅ 작성됨 |

**다음 단계:** GitHub에 코드 푸시 → Vercel 배포 → 테스트

---

## ⚡ 빠른 배포 (총 15분)

### Step 1: Git 설치 (3분)
```
1. https://git-scm.com/download/win
2. 설치 프로그램 다운로드 및 실행
3. 기본 설정으로 설치 완료
```

### Step 2: GitHub 저장소 생성 (1분)
```
1. https://github.com/new
2. Repository name: church-admin
3. Public 선택 → "Create repository"
```

### Step 3: 코드 푸시 (2분)
```powershell
cd c:\dev\church

git init
git config user.name "송원호"
git config user.email "songwonho@gmail.com"
git add .
git commit -m "Initial commit: Church Admin App"
git remote add origin https://github.com/YOUR_USERNAME/church-admin.git
git branch -M main
git push -u origin main
```

**YOUR_USERNAME을 실제 GitHub 계정명으로 변경하세요!**

예: `https://github.com/songwonho/church-admin.git`

### Step 4: Vercel 배포 (5분)
```
1. https://vercel.com/dashboard
2. GitHub으로 로그인
3. "New Project" 클릭
4. church-admin 저장소 선택 → "Import"
5. 다음 설정 입력:
   - Build Command: cd backend && npm install && npm run build
   - Output Directory: backend
6. "Environment Variables" 섹션에서 3개 변수 추가:

   MONGODB_URI:
   mongodb+srv://songwonho_db_user:<db_password>@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority
   
   JWT_SECRET:
   church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?
   
   NODE_ENV:
   production

7. "Deploy" 클릭
8. 배포 완료 대기 (2-3분)
```

### Step 5: 테스트 (5분)
```
배포 후 제공된 URL 확인:
https://church-admin.vercel.app (예시)

테스트 페이지:
https://church-admin.vercel.app/dashboard

✅ 모든 API를 웹 UI에서 테스트 가능!
```

---

## 🔑 MongoDB 연결 정보

**사용자 ID**: songwonho_db_user  
**MongoDB URI**: 
```
mongodb+srv://songwonho_db_user:<db_password>@church.adaqcxm.mongodb.net/?appName=church
```

Vercel에서 사용할 형식 (appName과 retryWrites 추가):
```
mongodb+srv://songwonho_db_user:<db_password>@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority
```

---

## 📝 환경 변수 설정 3가지

### MONGODB_URI
```
Vercel Dashboard → Environment Variables → Add

Name: MONGODB_URI
Value: mongodb+srv://songwonho_db_user:<db_password>@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority

⚠️ <db_password>를 실제 비밀번호로 교체!
```

### JWT_SECRET
```
Name: JWT_SECRET
Value: church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?

또는 더 강력한 키:
- openssl 명령 또는
- 온라인 생성기 사용 (최소 32자, 특수문자 포함)
```

### NODE_ENV
```
Name: NODE_ENV
Value: production
```

---

## 🌐 배포 후 주소

배포가 완료되면 Vercel이 제공하는 URL을 사용하세요:

```
API 서버:        https://church-admin.vercel.app
헬스 체크:        https://church-admin.vercel.app/health
테스트 도구:      https://church-admin.vercel.app/dashboard
```

---

## ✅ 배포 완료 후 테스트

### 1️⃣ 헬스 체크
```
URL: https://church-admin.vercel.app/health

예상 응답:
{
  "success": true,
  "message": "서버가 정상 작동 중입니다.",
  "timestamp": "...",
  "environment": "production"
}
```

### 2️⃣ 로그인 테스트
```
URL: https://church-admin.vercel.app/dashboard

- "로그인" 섹션 클릭
- Username: admin
- Password: admin123
- "Send" 클릭
- JWT 토큰 확인
```

### 3️⃣ 기본 기능 테스트
```
- 출석 조회
- 결재 라인 관리
- 사용자 등록
```

---

## 🆘 배포 중 문제 해결

### Git이 없는 경우
```
→ GIT_INSTALLATION_GUIDE.md 참고
→ https://git-scm.com/download/win에서 설치
```

### GitHub에 코드 푸시 실패
```
오류: "remote: Repository not found"

해결:
1. GitHub 저장소가 생성되었는지 확인
2. Repository URL이 정확한지 확인
3. GitHub 로그인 정보 확인
```

### Vercel 배포 실패
```
오류: "Build failed"

해결:
1. Vercel Dashboard → Deployments → Logs 확인
2. 로컬에서 build 테스트:
   cd backend
   npm install
   npm run build
3. 오류 수정 후 git push
```

### MongoDB 연결 실패
```
오류: "ECONNREFUSED" 또는 "authentication failed"

해결:
1. MONGODB_URI 환경 변수 확인
2. <db_password> 교체 확인
3. MongoDB Atlas IP 화이트리스트 확인:
   → 0.0.0.0/0 또는 Vercel IP 추가
4. Vercel 배포 재실행 (Redeploy)
```

---

## 📚 추가 문서

| 문서 | 내용 |
|------|------|
| `VERCEL_DEPLOYMENT_EXECUTION.md` | 상세한 배포 실행 가이드 |
| `GIT_INSTALLATION_GUIDE.md` | Git 설치 및 코드 푸시 |
| `MONGODB_CONNECTION_TEST.md` | MongoDB 연결 테스트 |
| `docs/API.md` | API 엔드포인트 문서 |
| `docs/DEPLOYMENT_VERCEL.md` | Vercel 상세 가이드 |

---

## 💡 팁

### 🔐 보안
```
✅ MongoDB 비밀번호는 GitHub에 커밋 금지
✅ .env 파일은 .gitignore에 있음 (확인 필요)
✅ Vercel 환경 변수에만 저장
✅ JWT_SECRET은 강력한 임의 문자열 사용
```

### 🚀 성능
```
✅ 첫 요청 3-5초 (Vercel Cold Start) - 정상
✅ 두 번째부터 빠름
✅ MongoDB M0는 무료 플랜 (성능 제한 있음)
✅ 프로덕션은 M2 이상 권장 ($9/월)
```

### 📈 모니터링
```
✅ Vercel Dashboard → Deployments → Logs 확인
✅ 정기적으로 /health 엔드포인트 테스트
✅ MongoDB Atlas → Monitoring 확인
```

---

## 🎯 배포 진행 상황

```
[████████████████████] 100% 배포 준비 완료

✅ 백엔드 개발: 완료
✅ 배포 설정: 완료
✅ 문서 작성: 완료
✅ MongoDB 계정: 준비됨
⏳ Git 설치: 필요
⏳ GitHub 푸시: 필요
⏳ Vercel 배포: 필요
⏳ API 테스트: 필요
```

---

## 🚀 지금 바로 시작하세요!

### 📋 체크리스트

- [ ] Git 설치 (https://git-scm.com/download/win)
- [ ] GitHub 저장소 생성
- [ ] `cd c:\dev\church` 로 이동
- [ ] git init & git add . & git commit & git push
- [ ] Vercel 로그인 (GitHub 계정)
- [ ] 프로젝트 Import
- [ ] 환경 변수 3개 설정:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] NODE_ENV
- [ ] Deploy 클릭
- [ ] /health 테스트 ✅
- [ ] /dashboard 테스트 ✅
- [ ] 로그인 테스트 ✅

---

## 📞 참고

**필요한 정보:**
- GitHub 계정명: ?
- Vercel 이메일: songwonho@gmail.com 추천
- MongoDB URI: mongodb+srv://songwonho_db_user:<db_password>@church.adaqcxm.mongodb.net

**외부 링크:**
- Vercel: https://vercel.com
- GitHub: https://github.com
- MongoDB: https://cloud.mongodb.com
- Git: https://git-scm.com

---

**이제 정말 배포를 시작하세요!** 🚀

1. Git 설치
2. GitHub에 코드 푸시
3. Vercel에 배포
4. API 테스트

**총 소요 시간: 약 15-20분**

---

*최종 업데이트: 2026-01-28*  
*배포 준비: 100% 완료 ✅*
