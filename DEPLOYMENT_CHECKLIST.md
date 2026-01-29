# ✅ 배포 체크리스트

배포 전에 다음 항목들을 확인하세요:

---

## 📋 사전 준비

### 계정 확인
- [ ] GitHub 계정 생성 완료
- [ ] Vercel 계정 생성 완료
- [ ] Render 계정 생성 완료
- [ ] MongoDB Atlas 계정 생성 완료

### 로컬 환경 확인
- [ ] Git 설치 완료
- [ ] Node.js v18+ 설치 완료
- [ ] npm 최신 버전 확인
- [ ] 프로젝트 폴더에서 `npm install` 성공

---

## 🔧 MongoDB 설정 체크리스트

### MongoDB Atlas
- [ ] 클러스터 생성 완료 (M0 무료 플랜)
- [ ] 데이터베이스 사용자 생성:
  - [ ] 사용자명: `churchadmin`
  - [ ] 비밀번호: 강력하게 설정
- [ ] IP 화이트리스트 설정 (0.0.0.0/0)
- [ ] 연결 문자열 복사 완료:
  ```
  mongodb+srv://churchadmin:PASSWORD@cluster.mongodb.net/church-admin?retryWrites=true&w=majority
  ```

### 로컬 테스트
- [ ] `npm run dev` 실행 시 MongoDB 연결 성공
- [ ] API 헬스 체크 응답 확인:
  ```bash
  curl http://localhost:3000/health
  ```

---

## 📁 코드 준비

### 환경 변수
- [ ] `.env` 파일 생성
- [ ] `.env` 파일은 `.gitignore`에 포함
- [ ] `.env.example` 파일로 필요 변수 문서화
- [ ] 필수 변수 확인:
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL`

### 코드 정리
- [ ] 콘솔 로그 정리 (디버그 코드 제거)
- [ ] 에러 핸들링 확인
- [ ] 보안 취약점 점검
  - [ ] 민감한 정보 하드코딩 확인
  - [ ] SQL/NoSQL 인젝션 점검
  - [ ] CORS 설정 확인

### 테스트
- [ ] `npm run build` 성공
- [ ] `npm run test` 성공 (있는 경우)
- [ ] 로컬에서 모든 기능 테스트
  - [ ] 회원가입 / 로그인
  - [ ] 출석 관리
  - [ ] 지출 결의서
  - [ ] 결재 기능

---

## 🐙 GitHub 업로드

### 저장소 생성
- [ ] GitHub에서 새 저장소 생성
  - [ ] Repository name: `church-admin`
  - [ ] Public 또는 Private 선택
  - [ ] .gitignore 선택하지 않기 (이미 있음)

### 로컬 푸시
- [ ] `git config --global user.email` 설정
- [ ] `git config --global user.name` 설정
- [ ] `git add .` 실행
- [ ] `git commit -m "Initial commit"` 실행
- [ ] GitHub URL로 원격 저장소 추가
- [ ] `git push -u origin main` 실행
- [ ] GitHub에서 코드 확인

---

## 🌐 Vercel 배포

### 계정 및 프로젝트
- [ ] Vercel에 GitHub으로 로그인
- [ ] GitHub 계정 접근 권한 승인
- [ ] church-admin 저장소 찾기
- [ ] "Import Project" 클릭

### 빌드 설정
- [ ] Root Directory: `./webapp`
- [ ] Framework: `Next.js` (자동 감지)
- [ ] Build Command: `npm run build` (자동 감지)
- [ ] Output Directory: `.next` (자동 감지)
- [ ] Install Command: `npm ci` (자동 감지)

### 환경 변수
- [ ] `NEXT_PUBLIC_API_URL` 설정
  - 값: `https://church-admin-api.onrender.com` (임시)
  - 또는 배포 후 실제 URL로 업데이트

### 배포
- [ ] "Deploy" 클릭
- [ ] 배포 진행 상황 모니터링 (2-3분)
- [ ] ✅ "Deployment successful" 확인
- [ ] 배포 URL 기록:
  - [ ] `https://YOUR-PROJECT.vercel.app`

### 배포 후
- [ ] 웹앱 URL에 접속 확인
- [ ] 로그인 페이지 로드 확인
- [ ] 네트워크 탭에서 API 호출 확인

---

## 🎮 Render 배포

### 계정 및 프로젝트
- [ ] Render에 GitHub으로 로그인
- [ ] GitHub 계정 접근 권한 승인
- [ ] church-admin 저장소 선택

### 빌드 설정
- [ ] Name: `church-admin-api`
- [ ] Environment: `Node`
- [ ] Region: 선택 (기본값 가능)
- [ ] Build Command: `cd backend && npm install`
- [ ] Start Command: `cd backend && npm run start`

### 환경 변수
- [ ] `MONGODB_URI`
  - 값: `mongodb+srv://churchadmin:PASSWORD@...`
  - [ ] 특수문자 URL 인코딩 확인
- [ ] `JWT_SECRET`
  - 값: 강력한 랜덤 문자열
- [ ] `NODE_ENV`
  - 값: `production`
- [ ] `FRONTEND_URL`
  - 값: `https://YOUR-PROJECT.vercel.app`
- [ ] `API_PORT`
  - 값: `3000` (또는 기본값 사용)

### 배포
- [ ] 모든 환경 변수 입력 완료
- [ ] "Create Web Service" 클릭
- [ ] 배포 진행 상황 모니터링 (3-5분)
- [ ] ✅ "Live" 상태 확인
- [ ] 배포 URL 기록:
  - [ ] `https://church-admin-api.onrender.com`

### 배포 후
- [ ] 헬스 체크 URL 확인:
  ```bash
  curl https://church-admin-api.onrender.com/health
  ```
- [ ] 응답이 JSON 형식인지 확인

---

## 🔗 URL 연결

### Vercel 업데이트
- [ ] Vercel 대시보드 Settings 열기
- [ ] Environment Variables 섹션으로 이동
- [ ] `NEXT_PUBLIC_API_URL` 수정:
  - 새 값: `https://church-admin-api.onrender.com`
- [ ] "Save" 클릭
- [ ] "Deployments" → 최신 배포 선택
- [ ] "Redeploy" 클릭
- [ ] 재배포 완료 대기

### Render 확인
- [ ] API 서버 로그 확인 (정상 실행 확인)

---

## 🧪 최종 테스트

### 웹앱 기능 테스트
- [ ] 웹앱 URL 접속 성공
- [ ] 페이지 로드 시간 양호
- [ ] 모바일 반응형 확인
- [ ] 콘솔 에러 없음

### 인증 테스트
- [ ] 회원가입 성공
- [ ] 로그인 성공
- [ ] JWT 토큰 발급 확인
- [ ] 로그아웃 성공

### 주요 기능 테스트
- [ ] 출석 관리
  - [ ] 체크인 성공
  - [ ] 출석 기록 조회
- [ ] 지출 관리
  - [ ] 결의서 작성 성공
  - [ ] 지출 목록 조회
- [ ] 결재 관리 (관리자)
  - [ ] 대기 중인 결의서 조회
  - [ ] 승인 / 반려 처리

### API 테스트
```bash
# 헬스 체크
curl https://church-admin-api.onrender.com/health

# 로그인
curl -X POST https://church-admin-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 사용자 목록 (인증 필요)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://church-admin-api.onrender.com/api/users
```

---

## 🔐 보안 체크리스트

### 환경 변수 보안
- [ ] `.env` 파일이 `.gitignore`에 있는가?
- [ ] GitHub에 `.env` 파일이 올라가지 않았는가?
- [ ] JWT_SECRET은 무작위로 생성되었는가?
- [ ] 환경 변수는 최소 16자 이상인가?

### MongoDB 보안
- [ ] 사용자 비밀번호는 강력한가?
- [ ] 특수문자를 포함하는가?
- [ ] IP 화이트리스트는 제한되어 있는가?
  - [ ] 개발: `0.0.0.0/0` (테스트용)
  - [ ] 프로덕션: 특정 IP만 허용 권장

### API 보안
- [ ] CORS 설정이 올바른가?
- [ ] HTTPS는 자동으로 활성화되었는가?
- [ ] Rate limiting이 설정되었는가? (옵션)
- [ ] 로그에 민감한 정보가 노출되지 않는가?

---

## 📈 배포 후 모니터링

### 일일 확인
- [ ] Vercel 대시보드에서 배포 상태 확인
- [ ] Render 대시보드에서 API 서버 상태 확인
- [ ] MongoDB Atlas에서 데이터베이스 상태 확인

### 주간 확인
- [ ] 사용자 활동 로그 확인
- [ ] API 응답 시간 모니터링
- [ ] 에러 로그 검토

### 월간 확인
- [ ] 사용량 및 비용 확인
- [ ] 보안 업데이트 확인
- [ ] 백업 설정 확인

---

## 💡 팁 및 트러블슈팅

### Vercel 배포 문제
```
문제: "Build failed"
해결:
1. 로그 확인
2. 로컬에서 npm run build 실행
3. 환경 변수 확인
4. Package.json 버전 확인
```

### Render 배포 문제
```
문제: "Service failed to start"
해결:
1. 로그 확인
2. 포트 번호 확인 (3000)
3. MongoDB 연결 문자열 확인
4. 환경 변수 재설정 후 재배포
```

### CORS 에러
```
해결:
1. backend/src/config에서 CORS 설정 확인
2. FRONTEND_URL 환경 변수 확인
3. 브라우저 개발자 도구에서 실제 요청 URL 확인
```

---

## ✨ 배포 완료!

축하합니다! 🎉

이제 프로덕션 환경에서 웹앱이 실행 중입니다.

**운영 시 주의사항:**
- 정기적으로 로그 모니터링
- 월별 백업 확인
- 보안 업데이트 확인
- 사용자 피드백 수집

행운을 빕니다! 🙏
