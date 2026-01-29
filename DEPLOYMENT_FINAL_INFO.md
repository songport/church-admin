# 🚀 배포 최종 정보

## ✅ 배포 준비 완료

```
✅ GitHub 푸시: 222a6f0
✅ .env 파일: 생성
✅ MongoDB: 설정 완료
✅ 배포 가이드: 준비 완료
```

---

## 🎯 배포 URL 및 로그인 정보

### 📌 배포 대기 중

현재 다음 단계를 진행해야 합니다:

1. **Vercel**: https://vercel.com/dashboard
   - 웹앱 배포 (3-5분)
   - 배포 완료 후: https://church-admin-web.vercel.app

2. **Render**: https://dashboard.render.com
   - 백엔드 배포 (5-7분)
   - 배포 완료 후: https://church-admin-api.onrender.com

---

## 👥 테스트 계정 정보

### 📌 관리자 계정 (Admin)

```
📧 Email:    admin@church.com
🔐 Password: admin123
👤 역할:     관리자

✅ 권한:
   - 출석 관리
   - 지출 결의서 조회
   - 결재 처리 (승인/반려)
   - 통계 및 리포트
```

### 📌 일반 사용자 계정 (User)

```
📧 Email:    user@church.com
🔐 Password: user123
👤 역할:     일반 사용자

✅ 권한:
   - 체크인/체크아웃
   - 출석 기록 조회
   - 지출 결의서 작성
   - 지출 현황 조회
```

---

## 🌐 배포 완료 후 접속

### 웹앱 URL
```
https://church-admin-web.vercel.app
```

### API 서버 URL
```
https://church-admin-api.onrender.com
```

### 헬스 체크
```
https://church-admin-api.onrender.com/health
```

---

## 📋 배포 진행 체크리스트

### Phase 1: Vercel 배포 (웹앱)
- [ ] Vercel 대시보드 접속
- [ ] "Add New" → "Project"
- [ ] "songport/church-admin" 선택
- [ ] Root Directory: "./webapp"
- [ ] 환경 변수 2개 추가:
  - NEXT_PUBLIC_API_URL = https://church-admin-api.onrender.com
  - NEXT_PUBLIC_APP_URL = https://church-admin-web.vercel.app
- [ ] "Deploy" 클릭
- [ ] "Live" 상태 확인
- [ ] 웹앱 URL 기록

**예상 시간: 3-5분**

---

### Phase 2: Render 배포 (백엔드)
- [ ] Render 대시보드 접속
- [ ] "New +" → "Web Service"
- [ ] "songport/church-admin" 선택
- [ ] 설정:
  - Name: church-admin-api
  - Environment: Node
  - Build: cd backend && npm install
  - Start: cd backend && npm run start
- [ ] 환경 변수 7개 추가:
  ```
  MONGODB_URI=mongodb+srv://songwonho_db_user:!finjomr9@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority
  JWT_SECRET=church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?
  NODE_ENV=production
  FRONTEND_URL=https://church-admin-web.vercel.app
  API_PORT=3000
  API_HOST=0.0.0.0
  DB_NAME=church-admin
  ```
- [ ] "Create Web Service" 클릭
- [ ] "Live" 상태 확인
- [ ] API URL 기록

**예상 시간: 5-7분**

---

### Phase 3: 최종 확인
- [ ] 웹앱 URL 접속 확인
- [ ] API 헬스 체크 확인
- [ ] 관리자 로그인 테스트
- [ ] 사용자 로그인 테스트

**예상 시간: 2-3분**

---

## 🔗 배포 링크

| 항목 | 링크 |
|------|------|
| **Vercel 대시보드** | https://vercel.com/dashboard |
| **Render 대시보드** | https://dashboard.render.com |
| **GitHub 저장소** | https://github.com/songport/church-admin |
| **MongoDB Atlas** | https://www.mongodb.com/cloud/atlas |

---

## 📚 배포 참고 문서

✅ **[FINAL_DEPLOYMENT_GUIDE.md](./FINAL_DEPLOYMENT_GUIDE.md)**
- 상세한 배포 가이드
- 계정 생성 방법
- 문제 해결

✅ **[DEPLOYMENT_LIVE.md](./DEPLOYMENT_LIVE.md)**
- 단계별 지침
- 시간대별 진행

✅ **[START_DEPLOYMENT.md](./START_DEPLOYMENT.md)**
- 빠른 참고용
- 핵심만 정리

---

## 🔐 보안 정보

```
MongoDB 사용자명: songwonho_db_user
MongoDB 클러스터: church.adaqcxm.mongodb.net
데이터베이스: church-admin

JWT Secret: church-admin-secret-2026-!@#$%^&*()-=[]{}|;:,.<>?

⚠️ 주의: 테스트 이후 비밀번호를 변경하세요!
```

---

## ⏱️ 예상 배포 시간표

```
Vercel 배포 (웹앱):     3-5분
Render 배포 (백엔드):   5-7분
최종 확인:             2-3분
─────────────────────────────
총 소요시간:          10-15분
```

---

## 🎉 배포 완료 후

1. **웹앱 접속**
   ```
   https://church-admin-web.vercel.app
   ```

2. **로그인**
   - Email: admin@church.com
   - Password: admin123

3. **주요 기능 테스트**
   - 출석 관리
   - 지출 결의서
   - 결재 처리

---

## 💡 문제 해결

### Vercel 배포 실패
→ Settings → Deployments → 로그 확인

### Render 배포 실패
→ 서비스 선택 → Logs 탭 → 에러 확인

### API 연결 실패
→ MongoDB Atlas → Network Access (0.0.0.0/0 확인)

---

## 🚀 지금 배포 시작!

1. **Vercel**: https://vercel.com/dashboard
2. **Render**: https://dashboard.render.com
3. **테스트**: https://church-admin-web.vercel.app

**배포 완료 후:**
- 웹앱: https://church-admin-web.vercel.app
- 관리자: admin@church.com / admin123
- 사용자: user@church.com / user123

---

**준비 완료! 배포를 시작하세요! 🚀**
