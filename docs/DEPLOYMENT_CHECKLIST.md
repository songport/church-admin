# 📋 Vercel 배포 체크리스트

## Phase 1: 사전 준비 (배포 전)
- [ ] GitHub 계정 생성/준비
- [ ] Vercel 계정 생성/준비
- [ ] MongoDB Atlas 계정 생성/준비
- [ ] 로컬에서 앱이 정상 작동하는지 확인
  ```bash
  npm start
  # http://localhost:3001/health 확인
  ```

---

## Phase 2: MongoDB Atlas 설정 (5-10분)

### 2-1. 클러스터 생성
- [ ] MongoDB Atlas 접속 (https://www.mongodb.com/cloud/atlas)
- [ ] "Create a Deployment" 클릭
- [ ] M0 Free Tier 선택
- [ ] Provider: AWS, Region: Asia Pacific (Seoul) 선택
- [ ] "Create" 클릭
- [ ] 클러스터 생성 완료 대기 (~10분)

### 2-2. 데이터베이스 사용자 생성
- [ ] "Database Access" 메뉴 클릭
- [ ] "Add New Database User" 클릭
- [ ] Username: `churchadmin` 입력
- [ ] Password: 강력한 암호 생성 및 저장 ⭐ **매우 중요!**
- [ ] Role: `readWriteAnyDatabase` 선택
- [ ] "Add User" 클릭

### 2-3. IP 화이트리스트 설정
- [ ] "Network Access" 메뉴 클릭
- [ ] "Add IP Address" 클릭
- [ ] "Allow access from anywhere" (0.0.0.0/0) 선택
- [ ] "Confirm" 클릭

⚠️ 프로덕션에서는 특정 IP만 허용하는 것이 권장되지만, Vercel은 동적 IP를 사용하므로 일단 모든 IP 허용

### 2-4. 연결 문자열 복사
- [ ] "Databases" 메뉴 클릭
- [ ] "Connect" 버튼 클릭 (클러스터 옆)
- [ ] "Connect your application" 선택
- [ ] Driver: Node.js, Version: 4.x or later 선택
- [ ] 연결 문자열 복사:
  ```
  mongodb+srv://churchadmin:<password>@cluster0.xxxxx.mongodb.net/church-admin?retryWrites=true&w=majority
  ```
- [ ] `<password>`를 2-2에서 설정한 암호로 교체
- [ ] 최종 연결 문자열 저장 (메모장에 임시 보관)

**저장된 MONGODB_URI 예시:**
```
mongodb+srv://churchadmin:MySecurePassword123!@cluster0.a1b2c3.mongodb.net/church-admin?retryWrites=true&w=majority
```

---

## Phase 3: GitHub 저장소 설정 (5분)

### 3-1. GitHub 저장소 생성
- [ ] https://github.com/new 접속
- [ ] Repository name: `church-admin` 입력
- [ ] Description: "Smart Church Administration App" 입력
- [ ] Public 선택 (private도 가능하지만 협업시 public 권장)
- [ ] "Create repository" 클릭

### 3-2. 로컬에서 Git 초기화 및 푸시
- [ ] 터미널에서 프로젝트 디렉토리로 이동
  ```bash
  cd c:\dev\church
  ```

- [ ] Git 초기화
  ```bash
  git init
  git add .
  git commit -m "Initial commit: Church Admin App"
  ```

- [ ] 원격 저장소 연결
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/church-admin.git
  git branch -M main
  git push -u origin main
  ```

- [ ] GitHub에 푸시 완료 확인
  - [ ] GitHub 저장소 페이지 새로고침
  - [ ] 파일들이 보이는지 확인

### 3-3. .gitignore 확인
- [ ] `.gitignore` 파일이 있는지 확인
- [ ] 다음 항목들이 포함되어 있는지 확인:
  ```
  .env
  .env.local
  .env.*.local
  node_modules/
  dist/
  build/
  .DS_Store
  ```

---

## Phase 4: Vercel 배포 (5-10분)

### 4-1. Vercel에 GitHub 저장소 연결
- [ ] Vercel 대시보드 접속 (https://vercel.com/dashboard)
- [ ] "New Project" 클릭
- [ ] GitHub 저장소 선택 (church-admin)
- [ ] "Import" 클릭

### 4-2. 프로젝트 설정
- [ ] Project Name: `church-admin` (자동 입력됨, 필요시 변경)
- [ ] Framework Preset: "Other" 선택
- [ ] Root Directory: `./` (기본값)
- [ ] Build Command: `cd backend && npm install && npm run build`
- [ ] Output Directory: `backend`

### 4-3. 환경 변수 설정
- [ ] "Environment Variables" 섹션에서 다음 변수들 추가:

#### MONGODB_URI (필수)
- [ ] Name: `MONGODB_URI`
- [ ] Value: Phase 2-4에서 저장한 연결 문자열 붙여넣기
- [ ] Environments: Production, Preview, Development 모두 선택
- [ ] "Save" 클릭

#### JWT_SECRET (필수)
- [ ] Name: `JWT_SECRET`
- [ ] Value: 강력한 시크릿 키 생성
  ```
  church-admin-jwt-secret-2026-!@#$%^&*()
  ```
  또는 OpenSSL 생성 (32글자 이상 권장):
  ```bash
  openssl rand -base64 32
  ```
- [ ] Environments: Production, Preview, Development 모두 선택
- [ ] "Save" 클릭

#### NODE_ENV (권장)
- [ ] Name: `NODE_ENV`
- [ ] Value: `production`
- [ ] Environments: Production 선택
- [ ] "Save" 클릭

#### FRONTEND_URL (선택 - 나중에 추가 가능)
- [ ] Name: `FRONTEND_URL`
- [ ] Value: (프론트엔드 배포 후 입력)

### 4-4. 배포 실행
- [ ] "Deploy" 버튼 클릭
- [ ] 배포 진행 상황 모니터링 (1-3분)
- [ ] "Deployment Complete" 메시지 확인
- [ ] 배포 URL 확인 및 메모
  ```
  https://church-admin.vercel.app (예시)
  ```

---

## Phase 5: 배포 후 검증 (5-10분)

### 5-1. 헬스 체크
- [ ] 브라우저에서 다음 URL 접속:
  ```
  https://church-admin.vercel.app/health
  ```
- [ ] 다음과 같은 응답 확인:
  ```json
  {
    "success": true,
    "message": "서버가 정상 작동 중입니다.",
    "timestamp": "...",
    "environment": "production"
  }
  ```

### 5-2. 홈 엔드포인트 테스트
- [ ] 브라우저에서 다음 URL 접속:
  ```
  https://church-admin.vercel.app/
  ```
- [ ] API 엔드포인트 목록이 보이는지 확인

### 5-3. 대시보드 접속
- [ ] 브라우저에서 다음 URL 접속:
  ```
  https://church-admin.vercel.app/dashboard
  ```
- [ ] 웹 UI 기반 API 테스트 도구가 표시되는지 확인

### 5-4. 로그인 테스트
- [ ] 대시보드에서 "로그인" 섹션 클릭
- [ ] Username: `admin`, Password: `admin123` 입력
- [ ] "Send" 버튼 클릭
- [ ] 응답에서 `token` 필드 확인
  ```json
  {
    "success": true,
    "message": "로그인 성공",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {...}
  }
  ```

### 5-5. 출석 조회 테스트 (선택)
- [ ] 대시보드에서 "출석 조회" 섹션 클릭
- [ ] 위에서 받은 토큰 자동 입력 확인
- [ ] "Send" 버튼 클릭
- [ ] 응답 확인

### 5-6. 배포 로그 확인
- [ ] Vercel 대시보드로 이동
- [ ] Deployments 탭 클릭
- [ ] 최신 배포 선택
- [ ] Logs 탭 에서 오류 없는지 확인

---

## Phase 6: 프론트엔드 설정 (선택 - 나중에)

### 6-1. API URL 업데이트
- [ ] 프론트엔드 프로젝트에서 API 베이스 URL 확인
- [ ] 파일: `frontend/src/services/api.js` 또는 `frontend/.env`
- [ ] 다음과 같이 업데이트:
  ```javascript
  const API_BASE_URL = 'https://church-admin.vercel.app';
  ```

### 6-2. CORS 설정 확인
- [ ] Vercel 배포 API에서 CORS가 활성화되어 있는지 확인
- [ ] API 헤더에 `Access-Control-Allow-Origin: *` 또는 프론트엔드 URL이 있는지 확인

### 6-3. 프론트엔드 배포 (선택)
- [ ] Vercel에 프론트엔드도 배포하려면:
  - [ ] 별도의 GitHub 저장소에서 관리하거나
  - [ ] 같은 저장소에서 `frontend/` 폴더에서 빌드
  - [ ] Vercel 프로젝트 2개 생성 (백엔드/프론트엔드 분리 권장)

---

## Phase 7: 문제 해결

### 배포 실패

**증상**: Deploy 버튼 클릭 후 실패 메시지
```
해결 방법:
1. Vercel Dashboard → Deployments → 최신 배포
2. Logs 탭에서 오류 메시지 확인
3. 주요 오류:
   - "MONGODB_URI not defined": 환경 변수 확인
   - "npm: not found": Node.js 설치 확인
   - "build failed": backend/package.json 확인
```

### MongoDB 연결 실패

**증상**: `/health` 호출 시 데이터베이스 오류
```
해결 방법:
1. MONGODB_URI 환경 변수 확인
2. MongoDB Atlas:
   - IP 화이트리스트 확인 (0.0.0.0/0 or Vercel IP)
   - 사용자 이름/비밀번호 확인
   - 클러스터 상태 확인 (파란 색이어야 함)
3. 연결 문자열에 특수문자가 있으면 URL 인코딩
   예: password!123 → password%21123
4. Vercel 배포 다시 실행 (Redeploy)
```

### API 응답이 느린 경우

**증상**: 요청 후 5초 이상 대기
```
해결 방법:
1. MongoDB M0 (무료)는 성능 제한 있음
2. 프로덕션 사용시 M2 이상으로 업그레이드
3. MongoDB 인덱스 추가로 성능 향상
4. Vercel 함수 메모리 증가:
   vercel.json의 "memory": 3008로 변경
```

### CORS 오류

**증상**: "Access to XMLHttpRequest blocked by CORS policy"
```
해결 방법:
1. api/index.js에서 CORS 설정 확인
2. vercel.json의 headers 섹션 확인
3. FRONTEND_URL 환경 변수 추가:
   - Name: FRONTEND_URL
   - Value: https://frontend-url.vercel.app
4. 배포 다시 실행
```

---

## Phase 8: 보안 체크

### 환경 변수 보안
- [ ] MongoDB 비밀번호가 강력한가? (12글자 이상, 특수문자 포함)
- [ ] JWT_SECRET이 강력한가? (32글자 이상, 특수문자 포함)
- [ ] 환경 변수가 GitHub에 커밋되지 않았는가?
- [ ] `.env` 파일이 `.gitignore`에 있는가?

### MongoDB 보안
- [ ] IP 화이트리스트가 설정되었는가? (최소한 Vercel IP)
- [ ] 데이터베이스 사용자 암호가 생성되었는가?
- [ ] 프로덕션 환경과 개발 환경이 분리되었는가?

### API 보안
- [ ] JWT 인증이 활성화되어 있는가?
- [ ] 민감한 데이터가 로그에 노출되지 않는가?
- [ ] Rate limiting이 필요한가?

---

## Phase 9: 다음 단계

### 즉시 (필수)
- [ ] 위의 모든 테스트 완료
- [ ] 로그에 오류 없음 확인

### 추후 (권장)
- [ ] 프론트엔드 배포 및 API URL 연결
- [ ] 커스텀 도메인 설정
- [ ] 모니터링 및 로깅 설정 (Sentry, LogRocket 등)
- [ ] 자동 스케일링 설정

### 기능 개발 (Phase 3)
- [ ] Google Vision API 통합 (OCR)
- [ ] 전자 결재 워크플로우 완성
- [ ] 웹 기반 관리 대시보드 개발
- [ ] WebSocket 실시간 업데이트

---

## 문의 및 참고

- Vercel 문서: https://vercel.com/docs
- MongoDB 튜토리얼: https://docs.atlas.mongodb.com/
- 상세 배포 가이드: [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)
- 환경 변수 가이드: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
- API 문서: [API.md](./API.md)

---

## 체크리스트 완료!

모든 항목을 체크했다면:
✅ **축하합니다! 앱이 외부에서 접근 가능한 상태로 배포되었습니다!**

배포 URL: `https://church-admin.vercel.app` (예시)

---

*마지막 업데이트: 2026-01-28*
