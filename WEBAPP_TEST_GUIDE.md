# 🧪 웹앱 테스트 가이드

## ✅ 빠른 시작

### 1단계: 개발 서버 확인
```bash
cd c:\dev\church\webapp
npm run dev
```
- http://localhost:3000 에서 접속 가능해야 함
- "Ready in XXXms" 메시지 확인

### 2단계: 로그인 페이지 접속
- 브라우저: http://localhost:3000/login
- 다음 계정으로 로그인 테스트:
  ```
  사용자명: testuser
  비밀번호: password123
  ```

---

## 🧬 테스트 시나리오

### 시나리오 1: 로그인 및 대시보드
**예상 결과:** 로그인 후 대시보드 표시

**단계:**
1. http://localhost:3000/login 접속
2. 테스트 계정 입력
3. "Sign In" 버튼 클릭
4. ✅ 대시보드로 자동 이동
5. ✅ "Welcome, testuser!" 메시지 표시
6. ✅ 빠른 메뉴 카드 표시 (Attendance, Expenditure, etc.)

**실패 원인:**
- 백엔드 서버 미실행
- 환경 변수 미설정 (.env.local)
- CORS 에러

---

### 시나리오 2: 출석 관리
**예상 결과:** 위치 기반 체크인/체크아웃

**단계:**
1. 대시보드에서 "Attendance" 카드 클릭
2. ✅ "📍 Location Permission" 요청
3. ✅ "Allow" 클릭 (브라우저 권한 요청)
4. ✅ 현재 위치 표시
5. ✅ 거리 계산: "Distance: XXX meters"
6. ✅ 100m 이내일 때 "Check In" 버튼 활성화
7. ✅ "Check In" 클릭
8. ✅ 성공 메시지: "Checked in successfully"
9. ✅ 출석 기록 표에 항목 추가

**실패 원인:**
- 백엔드 `/api/attendance/*` 엔드포인트 오류
- 위치 권한 거부
- 지오펜싱 범위 밖 (교회 위치: 37.5505, 126.8695)

---

### 시나리오 3: 지출 관리
**예상 결과:** 지출 결의서 작성 및 조회

**단계:**
1. 대시보드에서 "Expenditure" 카드 클릭
2. ✅ 지출 작성 폼 표시
3. ✅ 다음 정보 입력:
   - Title: "교회 물품 구입"
   - Amount: "50000"
   - Category: "Supplies"
   - Description: "프로젝터 가격"
4. ✅ "Submit" 버튼 클릭
5. ✅ 성공 메시지: "Expenditure created successfully"
6. ✅ 폼 초기화
7. ✅ 지출 목록에 새 항목 표시
8. ✅ 상태 배지: "Pending" (대기 상태)

**실패 원인:**
- 백엔드 POST `/api/expenditure` 오류
- 입력값 검증 실패
- JWT 토큰 만료

---

### 시나리오 4: 결재 관리 (관리자만)
**예상 결과:** 지출 결의서 승인/반려

**전제 조건:**
- 관리자 계정으로 로그인
  ```
  사용자명: admin
  비밀번호: admin123
  ```

**단계:**
1. 대시보드에서 "Approval" 카드 클릭
2. ✅ "Approval Workflow" 페이지 표시
3. ✅ "Pending" 탭에서 대기 중인 결의서 조회
4. ✅ 항목 선택 (클릭)
5. ✅ 결재 폼 표시:
   - 신청자명
   - 금액
   - 설명
   - "Comment" 입력 필드
6. ✅ "Approve" 또는 "Reject" 버튼 클릭
7. ✅ 성공 메시지 표시
8. ✅ 해당 항목이 "Approved" 또는 "Rejected" 탭으로 이동

**실패 원인:**
- 일반 사용자로 로그인 (관리자 권한 필요)
- 백엔드 PATCH `/api/expenditure/:id/approve` 오류
- 토큰 만료

---

### 시나리오 5: 설정 페이지
**예상 결과:** 사용자 정보 및 설정 표시

**단계:**
1. 대시보드에서 "Settings" 카드 클릭
2. ✅ "User Profile" 섹션 표시:
   - Username: testuser
   - Email: testuser@example.com
   - Role: User
   - Department: General
3. ✅ "Security Settings" 메뉴 표시
4. ✅ 알림 설정 토글 표시
5. ✅ "Logout" 버튼 클릭
6. ✅ 로그인 페이지로 리다이렉트

---

## 🔍 브라우저 개발자 도구 확인 사항

### Network 탭
**확인 항목:**
- [ ] POST /api/auth/login (200 OK)
- [ ] GET /api/attendance/today (200 OK)
- [ ] POST /api/attendance/check-in (200 OK)
- [ ] POST /api/expenditure (201 Created)
- [ ] GET /api/expenditure (200 OK)
- [ ] PATCH /api/expenditure/:id/approve (200 OK)

**에러 시:**
- 404: 백엔드 엔드포인트 오류
- 401: 토큰 만료
- 500: 백엔드 서버 오류
- CORS Error: 백엔드 CORS 설정 확인

### Console 탭
**확인 항목:**
- [ ] API 요청 로깅 (요청/응답)
- [ ] 에러 메시지 없음
- [ ] 토큰 저장 확인 (Cookies)

### Cookies/Storage
**확인 항목:**
- [ ] `token` 쿠키 저장됨
- [ ] `token` 값: "eyJhbG..." (JWT 형식)

---

## 🆘 문제 해결

### 문제: "로그인이 안 됩니다"

**확인 사항:**
```bash
# 1. 백엔드 서버 실행 확인
curl http://localhost:3000/api/auth/login

# 2. 환경 변수 확인
cat webapp/.env.local

# 3. 네트워크 탭 확인
# POST /api/auth/login 요청이 보이는가?
# 응답 상태 코드는?
```

**해결책:**
```bash
# 백엔드 재시작
cd backend
npm run dev

# 또는 캐시 삭제 후 새로고침
# Ctrl+Shift+Delete (DevTools에서 Clear cache)
```

---

### 문제: "위치 권한이 요청되지 않습니다"

**확인 사항:**
- [ ] 브라우저 위치 권한 설정 확인
- [ ] http:// (localhost) 사용 중인가?
  - ✅ http://localhost:3000 (허용)
  - ✅ http://127.0.0.1:3000 (허용)
  - ❌ https://localhost:3000 (거부, HTTPS 필요)

**해결책:**
```javascript
// DevTools Console에서 직접 테스트
navigator.geolocation.getCurrentPosition(
  pos => console.log(pos.coords),
  err => console.error(err)
);
```

---

### 문제: "지출 생성이 안 됩니다"

**확인 사항:**
1. Network 탭에서 POST /api/expenditure 응답 확인
2. Request payload 확인:
   ```json
   {
     "title": "...",
     "amount": 50000,
     "category": "...",
     "description": "..."
   }
   ```
3. Response 상태 코드:
   - 201: 성공
   - 400: 입력값 오류
   - 401: 토큰 만료
   - 500: 백엔드 오류

**해결책:**
```bash
# 백엔드 로그 확인
cd backend
npm run dev
# "POST /api/expenditure" 로그 보이는가?
```

---

### 문제: CORS 에러

**메시지:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**해결책:**
```javascript
// backend/server.js 에서 CORS 설정 확인
app.use(cors({
  origin: 'http://localhost:3000',  // 또는 '*'
  credentials: true
}));
```

---

## 📊 테스트 체크리스트

### 로그인
- [ ] 유효한 계정으로 로그인 성공
- [ ] 무효한 계정으로 로그인 실패
- [ ] 에러 메시지 표시
- [ ] "Remember me" 체크 후 새로고침 → 자동 로그인

### 출석
- [ ] 위치 권한 요청 표시
- [ ] 위치 조회 성공
- [ ] 거리 표시 정확성
- [ ] 100m 이내에서만 버튼 활성화
- [ ] 체크인 성공
- [ ] 체크아웃 성공
- [ ] 기록 조회 정확성

### 지출
- [ ] 지출 생성 성공
- [ ] 유효성 검사 (금액, 제목)
- [ ] 지출 목록 조회
- [ ] 상태 필터 (All/Pending/Approved/Rejected)
- [ ] 상태 배지 색상 정확성

### 결재 (관리자)
- [ ] 대기 건 조회
- [ ] 승인 처리
- [ ] 반려 처리
- [ ] 의견 입력 및 저장
- [ ] 상태 변경 반영

### 설정
- [ ] 프로필 정보 표시
- [ ] 보안 설정 메뉴
- [ ] 알림 토글
- [ ] 로그아웃 성공

### 일반
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 다크/라이트 모드 (있다면)
- [ ] 에러 메시지 친화적
- [ ] 로딩 상태 표시
- [ ] 성공 메시지 표시

---

## 🎯 성공 시나리오

모든 테스트를 성공하면:

✅ **웹앱 프로덕션 준비 완료**

**다음 단계:**
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
ls -la .next/

# 프로덕션 서버 실행
npm start
```

**배포 (Vercel):**
```bash
npm install -g vercel
vercel
# 프롬프트에 따라 배포 진행
```

---

**테스트 날짜:** _______________  
**테스트자:** _______________  
**결과:** ✅ 성공 / ⚠️ 실패  
**비고:** _______________
