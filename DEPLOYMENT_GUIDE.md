# 🚀 프로덕션 배포 가이드

교회 행정 시스템을 **Vercel (웹앱) + Render (백엔드)**로 배포하는 완벽한 가이드입니다.

---

## 📋 배포 아키텍처

```
┌─────────────────────────────────────────────┐
│        사용자의 웹 브라우저                  │
└─────────────────────┬───────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
    ┌───▼───────────────┐  ┌────────▼────────────┐
    │  Vercel (웹앱)    │  │  Render (백엔드)    │
    │  Next.js + TS    │  │  Node.js Express   │
    │ church-admin-web │  │ church-admin-api   │
    └────────┬─────────┘  └────────┬───────────┘
             │                      │
             └──────────┬───────────┘
                        │
             ┌──────────▼──────────┐
             │  MongoDB Atlas      │
             │  (클라우드 DB)      │
             └─────────────────────┘
```

---

## 🎯 사전 준비사항

### 필수 계정
- ✅ GitHub 계정 (코드 저장소)
- ✅ Vercel 계정 (웹앱 배포)
- ✅ Render 계정 (백엔드 배포)
- ✅ MongoDB Atlas 계정 (데이터베이스)

### 설치 필요
- ✅ Git
- ✅ Node.js v18 이상
- ✅ npm

---

## 📍 Step 1: MongoDB Atlas 설정 (5분)

### 1.1 MongoDB 계정 생성
```
👉 https://www.mongodb.com/cloud/atlas 접속
→ "Sign Up Free" 클릭
→ 이메일로 가입 완료
```

### 1.2 클러스터 생성
```
1. "Create a Deployment" 클릭
2. 무료 플랜 선택 (M0 Sandbox)
3. 클라우드 제공자: AWS (기본값)
4. 리전: ap-southeast-1 (싱가포르 추천)
5. "Create Deployment" 클릭
   → 몇 분 대기...
```

### 1.3 데이터베이스 접근 설정
```
1. 좌측 "Network Access" 클릭
2. "Add IP Address" 클릭
3. "Allow access from anywhere" 선택
   → 0.0.0.0/0 입력
4. "Confirm" 클릭
```

### 1.4 사용자 생성
```
1. 좌측 "Database Access" 클릭
2. "Add New Database User" 클릭
3. 사용자명: churchadmin
4. 비밀번호: 강력한 암호 생성
   예: Abc@123456XyzWpq!
5. "Add User" 클릭
```

### 1.5 연결 문자열 복사
```
1. 클러스터 목록에서 "Connect" 클릭
2. "Drivers" 선택
3. Node.js 드라이버 버전 4.0 이상
4. 연결 문자열 복사:
   mongodb+srv://churchadmin:password@church-cluster.mongodb.net/church-admin?retryWrites=true&w=majority
```

### 1.6 .env 파일 생성
프로젝트 루트에 `.env` 파일 생성:

```bash
# MongoDB 설정
MONGODB_URI=mongodb+srv://churchadmin:YOUR_PASSWORD@your-cluster.mongodb.net/church-admin?retryWrites=true&w=majority

# JWT 시크릿 (강력한 랜덤 문자열)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 환경
NODE_ENV=production

# 포트
API_PORT=3000

# 프론트엔드 URL (나중에 채움)
FRONTEND_URL=https://church-admin-web.vercel.app
```

> ⚠️ **보안 주의**: `.env` 파일은 `.gitignore`에 포함되어 있어야 합니다!

---

## 🐙 Step 2: GitHub에 푸시 (3분)

### 2.1 로컬 저장소 준비
```bash
cd c:\dev\church

# Git 상태 확인
git status

# 변경사항 스테이징
git add .

# 커밋
git commit -m "chore: prepare for production deployment"
```

### 2.2 GitHub 저장소 생성
```
👉 https://github.com/new 접속
→ Repository name: church-admin
→ Description: "주님의 교회 스마트 행정 시스템"
→ Public (검색 노출) 또는 Private (비공개)
→ "Create repository" 클릭
```

### 2.3 원격 저장소 연결 및 푸시
```bash
# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/church-admin.git

# main 브랜치로 푸시
git branch -M main
git push -u origin main
```

✅ GitHub 저장소에 코드가 업로드되었습니다!

---

## 🌐 Step 3: Vercel에 웹앱 배포 (3분)

### 3.1 Vercel 계정 연결
```
👉 https://vercel.com/dashboard 접속
→ GitHub 계정으로 로그인
→ GitHub 저장소 접근 권한 승인
```

### 3.2 프로젝트 임포트
```
1. "Add New..." → "Project" 클릭
2. GitHub에서 church-admin 저장소 선택
3. "Import" 클릭
```

### 3.3 빌드 설정
```
빌드 설정:
- Framework Preset: Next.js ✓
- Root Directory: ./webapp
- Build Command: npm run build
- Output Directory: .next

✅ Vercel이 자동으로 감지합니다!
```

### 3.4 환경 변수 설정 (필수!)
```
Environment Variables 섹션에 추가:

1. NEXT_PUBLIC_API_URL
   값: https://church-admin-api.onrender.com
   (Render 배포 후 URL로 변경)

2. NEXT_PUBLIC_APP_URL
   값: https://church-admin-web.vercel.app
```

### 3.5 배포 시작
```
→ "Deploy" 클릭
→ 빌드 진행 중... (2-3분)
→ ✅ Deployment successful!
```

### 3.6 웹앱 URL 확인
```
배포된 URL: https://church-admin-web.vercel.app
(또는 Vercel이 자동 생성한 URL)
```

---

## 🎮 Step 4: Render에 백엔드 배포 (5분)

### 4.1 Render 계정 로그인
```
👉 https://dashboard.render.com 접속
→ GitHub 계정으로 로그인
→ GitHub 저장소 접근 권한 승인
```

### 4.2 새 Web Service 생성
```
1. "New +" → "Web Service" 클릭
2. GitHub 저장소 선택: church-admin
3. "Connect" 클릭
```

### 4.3 배포 설정
```
기본 설정:
- Name: church-admin-api
- Environment: Node
- Build Command: cd backend && npm install
- Start Command: cd backend && npm run start
- Instance Type: Free (무료)

⚠️ 무료 플랜: 15분 유휴 시 자동 중지
💡 유료 플랜 ($7/월): 항상 실행
```

### 4.4 환경 변수 설정 (매우 중요!)
```
Environment Variables에 추가:

1. MONGODB_URI
   값: mongodb+srv://churchadmin:PASSWORD@...

2. JWT_SECRET
   값: your-super-secret-jwt-key-change-this

3. NODE_ENV
   값: production

4. FRONTEND_URL
   값: https://church-admin-web.vercel.app

⚠️ 각 변수는 별도로 입력하세요!
```

### 4.5 배포 시작
```
→ "Create Web Service" 클릭
→ 배포 진행 중... (3-5분)
→ "Live" 상태 확인
```

### 4.6 백엔드 API URL 확인
```
배포된 URL: https://church-admin-api.onrender.com
(또는 Render이 자동 생성한 URL)
```

---

## 🔗 Step 5: URL 연결 (2분)

### 5.1 Vercel 환경 변수 업데이트
```
Vercel 대시보드:
1. Settings → Environment Variables
2. NEXT_PUBLIC_API_URL 수정:
   - 이전: (임시 URL)
   - 새로운: https://church-admin-api.onrender.com
3. "Save" → "Redeploy" 클릭
```

### 5.2 Render 헬스 체크
```
백엔드가 정상 작동하는지 확인:
👉 https://church-admin-api.onrender.com/health

응답 예시:
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## ✅ Step 6: 최종 테스트

### 6.1 웹앱 접속
```
👉 https://church-admin-web.vercel.app
```

### 6.2 테스트 계정으로 로그인
```
테스트 계정이 필요하면:
1. 관리자 페이지에서 새 사용자 등록
2. 또는 /api/auth/register 엔드포인트 사용
```

### 6.3 주요 기능 테스트
```
✅ 로그인 / 로그아웃
✅ 출석 관리
✅ 지출 결의서 작성
✅ 결재 승인/반려
✅ 사용자 설정
```

---

## 🐛 문제 해결

### Q: "CORS 에러"가 발생합니다
```
해결: Render 환경 변수에서 FRONTEND_URL 확인
FRONTEND_URL=https://church-admin-web.vercel.app
```

### Q: "MongoDB 연결 실패"
```
확인사항:
1. MONGODB_URI 문자열 정확성
2. 비밀번호에 특수문자 있으면 URL 인코딩
   예: P@ssw0rd! → P%40ssw0rd%21
3. MongoDB IP 화이트리스트: 0.0.0.0/0
```

### Q: "JWT 토큰 에러"
```
해결: Render 재배포
Settings → Trigger Deploy → Clear build cache & Deploy
```

### Q: Render 무료 플랜이 계속 중지됩니다
```
옵션 1: Render 유료 플랜으로 업그레이드 ($7/월)
옵션 2: Railway 또는 Fly.io 사용 (무료 크레딧)
옵션 3: 정기적 핑 서비스 설정 (UptimeRobot)
```

---

## 📊 배포 후 모니터링

### Vercel 모니터링
```
Vercel 대시보드:
→ Analytics: 방문자 수, 성능
→ Logs: 배포 및 함수 로그
→ Deployments: 버전 히스토리
```

### Render 모니터링
```
Render 대시보드:
→ Logs: 서버 로그
→ Metrics: CPU, 메모리 사용량
→ Events: 배포 히스토리
```

---

## 🎉 완료!

축하합니다! 🎊

이제 다음 주소에서 웹앱에 접속할 수 있습니다:

### 배포된 서비스

| 서비스 | URL | 설명 |
|--------|-----|------|
| **웹앱** | `https://church-admin-web.vercel.app` | 사용자 인터페이스 |
| **백엔드 API** | `https://church-admin-api.onrender.com` | REST API 서버 |
| **헬스 체크** | `https://church-admin-api.onrender.com/health` | 서버 상태 |
| **API 문서** | `https://church-admin-api.onrender.com/api-docs` | API 명세서 |

---

## 🔐 보안 체크리스트

배포 후 반드시 확인하세요:

- [ ] MongoDB 사용자 비밀번호는 강력한가?
- [ ] JWT_SECRET은 무작위로 생성되었는가?
- [ ] .env 파일은 Git에 커밋되지 않았는가?
- [ ] 환경 변수는 모두 설정되었는가?
- [ ] MongoDB IP 화이트리스트는 제한되어 있는가?
- [ ] HTTPS는 자동으로 활성화되었는가?

---

## 📞 추가 도움

- Vercel 문서: https://vercel.com/docs
- Render 문서: https://render.com/docs
- MongoDB 문서: https://docs.mongodb.com/

행운을 빕니다! 🙏
