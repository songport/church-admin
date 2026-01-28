# 주님의 교회 스마트 행정 앱 - 프로젝트 요약

## ✅ 완료된 항목

### 1. 프로젝트 구조 초기화 ✓
- ✅ 백엔드 폴더 구조 생성
- ✅ 프론트엔드 폴더 구조 생성
- ✅ package.json 설정 (백엔드/프론트엔드)

### 2. 데이터베이스 설계 ✓
- ✅ **User 모델**: 사용자 정보, 직분, 권한 관리
- ✅ **Attendance 모델**: 출석 기록, 자동 퇴청
- ✅ **Expenditure 모델**: 지출결의서, 결재 상태
- ✅ **ApprovalLine 모델**: 결재선 설정 (1→2→3)
- ✅ **ChurchLocation 모델**: 교회 위치 (2개 지부)

### 3. 백엔드 API 구현 ✓
- ✅ **인증 시스템**
  - JWT 기반 로그인/로그아웃
  - 회원가입 (관리자만)
  - 권한 미들웨어
  
- ✅ **출석 관리 API**
  - 지오펜싱 확인 (Haversine 공식)
  - 출석/퇴청 체크인
  - 자동 퇴청 (5시간)
  - 오늘의 출석자 명단 (평면적 구조)
  - 기간별 통계

- ✅ **결재선 관리 API**
  - 결재선 생성 (1→2→3 순서)
  - 결재선 조회/수정/삭제
  - 사용자별 권한 관리

### 4. 프론트엔드 화면 구현 ✓
- ✅ **LoginScreen**: 사용자명/비밀번호 + 로그인 유지 체크박스
- ✅ **AttendanceScreen**: 위치 기반 출석/퇴청 버튼
- ✅ **AdminRegisterScreen**: 회원 등록 (직분 콤보박스)
- ✅ **ApprovalLineManagementScreen**: 결재선 설정

### 5. 지오펜싱 시스템 ✓
- ✅ 두 교회 위치 설정
  - 강서지부: 37.6379499, 126.8747216
  - 송파지부: 37.5524510, 126.8589197
- ✅ 거리 계산 (Haversine 공식)
- ✅ 가장 가까운 지부 기준
- ✅ 30미터 반경 경계
- ✅ 자동 퇴청 (5시간)

### 6. 문서화 ✓
- ✅ README.md (프로젝트 개요)
- ✅ API.md (API 엔드포인트)
- ✅ SETUP.md (설치 및 실행 가이드)
- ✅ EXPENDITURE.md (지출결의 가이드)

---

## 🚧 구현 예정 항목

### 1. 지출결의 및 결재 시스템
```
[ ] AI-OCR 기능 (Google Vision API)
    [ ] 영수증 촬영/업로드
    [ ] 항목/금액/날짜 자동 추출
    [ ] 결의서 자동 생성

[ ] 전자결재 워크플로우
    [ ] 작성자 → 부장(1차) → 목사(최종) 승인
    [ ] 푸시 알림
    [ ] 상태 표시 (미결/진행/완료)
    [ ] 반려 처리

[ ] 지출 통계 및 리포트
    [ ] 월별/일별/기간별 합계
    [ ] 카테고리별 분석
    [ ] 그래프 시각화
```

### 2. 백그라운드 위치 추적
```
[ ] 백그라운드 위치 서비스 구현
    [ ] expo-task-manager 활용
    [ ] 배터리 최적화
    [ ] 위치 권한 재요청
```

### 3. 실시간 기능
```
[ ] WebSocket 통합
    [ ] 실시간 출석자 목록 업데이트
    [ ] 푸시 알림
    [ ] 결재 상태 실시간 반영
```

### 4. 보안 강화
```
[ ] 암호화
    [ ] HTTPS/TLS 설정
    [ ] AES-256 암호화
    
[ ] 권한 관리
    [ ] Role-based Access Control (RBAC)
    [ ] 세밀한 권한 분할

[ ] 로깅 및 감사
    [ ] 모든 작업 로그 기록
    [ ] 감사 추적
```

### 5. 고급 기능
```
[ ] 데이터 내보내기 (Excel)
[ ] 알림 설정 커스터마이징
[ ] 모바일 앱 푸시 알림
[ ] 이미지 기반 보고서
[ ] 반복 출석 패턴 분석
```

---

## 📊 현재 프로젝트 상태

### 개발 진행률
```
전체: ████████░░░░░░░░░░░░ 35%

┌─ 기본 기능 ██████████████████░░ 90%
├─ 출석 관리 ████████████████░░░░ 80%
├─ 지출 관리 ██░░░░░░░░░░░░░░░░░░ 10%
├─ 보안 ░░░░░░░░░░░░░░░░░░░░ 0%
└─ 배포 ░░░░░░░░░░░░░░░░░░░░ 0%
```

### 코드 규모
```
백엔드:
  - 모델: 5개
  - 컨트롤러: 3개
  - 라우트: 3개
  - 라인: ~1,000

프론트엔드:
  - 화면: 4개
  - Context: 1개
  - API 서비스: 1개
  - 라인: ~2,000

문서:
  - 파일: 5개
  - 라인: ~2,500
```

---

## 🎯 다음 우선순위

### Phase 1 (이번주): 지출결의 기본 기능
1. Expenditure 컨트롤러 구현
2. ExpenditureScreen 화면 작성
3. Google Vision API 통합
4. 기본 OCR 처리

### Phase 2 (다음주): 결재 워크플로우
1. 전자결재 로직 구현
2. 결재자별 화면 작성
3. 푸시 알림 시스템
4. 상태 모니터링

### Phase 3 (3주차): 통계 및 리포팅
1. 지출 통계 API
2. 차트 라이브러리 통합
3. 리포트 생성 기능
4. 데이터 내보내기

### Phase 4 (4주차): 보안 및 배포
1. HTTPS/TLS 설정
2. AES-256 암호화
3. 환경별 설정 분리
4. 프로덕션 배포

---

## 🛠️ 설치 및 실행 명령어

### 백엔드 실행
```bash
cd backend
npm install
npm run dev
```

서버: `http://localhost:3000`

### 프론트엔드 실행
```bash
cd frontend
npm install
npm start

# Android 에뮬레이터
npm run android

# iOS 시뮬레이터
npm run ios
```

---

## 📁 핵심 파일 구조

```
church/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js ✓
│   │   │   ├── Attendance.js ✓
│   │   │   ├── Expenditure.js ✓
│   │   │   ├── ApprovalLine.js ✓
│   │   │   └── ChurchLocation.js ✓
│   │   ├── controllers/
│   │   │   ├── userController.js ✓
│   │   │   ├── attendanceController.js ✓
│   │   │   ├── approvalLineController.js ✓
│   │   │   └── expenditureController.js (예정)
│   │   ├── routes/
│   │   │   ├── userRoutes.js ✓
│   │   │   ├── attendanceRoutes.js ✓
│   │   │   ├── approvalLineRoutes.js ✓
│   │   │   └── expenditureRoutes.js (예정)
│   │   ├── middleware/
│   │   │   └── auth.js ✓
│   │   └── config/
│   │       ├── database.js ✓
│   │       └── jwt.js ✓
│   └── server.js ✓
│
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.js ✓
│   │   │   ├── AttendanceScreen.js ✓
│   │   │   ├── AdminRegisterScreen.js ✓
│   │   │   ├── ApprovalLineManagementScreen.js ✓
│   │   │   └── ExpenditureScreen.js (예정)
│   │   ├── context/
│   │   │   └── AuthContext.js ✓
│   │   ├── services/
│   │   │   └── api.js ✓
│   │   └── navigation/
│   │       └── Navigation.js ✓
│   ├── App.js ✓
│   ├── app.json ✓
│   └── babel.config.js ✓
│
└── docs/
    ├── README.md ✓
    ├── API.md ✓
    ├── SETUP.md ✓
    └── EXPENDITURE.md ✓
```

---

## 💡 핵심 기술 결정사항

### 왜 React Native를 선택했는가?
- iOS와 Android 동시 지원 (코드 재사용)
- Expo로 빠른 프로토타이핑 가능
- 고령층 친화적 UI 구현 용이

### 왜 MongoDB를 선택했는가?
- 유연한 스키마 (향후 필드 추가 용이)
- 출석 기록 같은 시계열 데이터에 적합
- JSON 기반 저장 (개발 편의성)

### 왜 JWT를 선택했는가?
- Stateless 인증 (서버 부하 감소)
- 토큰 기반 권한 관리 (세밀한 제어 가능)
- 표준화된 방식 (보안 검증됨)

---

## 📋 테스트 체크리스트

### 인증 테스트
- [ ] 정상적인 로그인
- [ ] 잘못된 비밀번호 처리
- [ ] 로그인 유지 확인
- [ ] 토큰 만료 처리

### 출석 관리 테스트
- [ ] 지오펜싱 경계 인식
- [ ] 출석 체크인/아웃
- [ ] 자동 퇴청 (5시간)
- [ ] 오늘 출석자 명단 조회

### 관리자 기능 테스트
- [ ] 회원 등록
- [ ] 직분별 권한 할당
- [ ] 결재선 설정 (1→2→3)
- [ ] 사용자 수정/삭제

---

## 🔐 보안 체크리스트

- [ ] JWT_SECRET 강력한 값으로 설정
- [ ] MongoDB 인증 활성화
- [ ] 입력 유효성 검사 (서버측)
- [ ] SQL/NoSQL 인젝션 방지
- [ ] CORS 설정 검토
- [ ] 민감 정보 로깅 제외
- [ ] HTTPS 활성화 (배포 시)
- [ ] Rate limiting 설정

---

## 📞 기술 지원

### 문제 해결 가이드
- [SETUP.md](./SETUP.md)의 문제 해결 섹션 참조
- API 엔드포인트: [API.md](./API.md)
- 지출결의 구현: [EXPENDITURE.md](./EXPENDITURE.md)

---

## 📈 향후 개선 사항

### 단기 (1개월)
- AI-OCR 기능 완성
- 지출 통계 대시보드
- 푸시 알림 시스템

### 중기 (3개월)
- 고급 분석 기능
- 데이터 내보내기 (Excel)
- 모바일 최적화

### 장기 (6개월)
- 웹 버전 개발
- 분석 API
- 빅데이터 분석

---

**프로젝트 시작일**: 2026년 1월 28일  
**현재 상태**: 개발 중 (Phase 1 완료)  
**다음 마일스톤**: Phase 2 시작 (지출결의)

---

## 📞 문의사항

기술 지원이나 버그 리포트는 Issues 탭에서 작성해주세요.

---

*Last Updated: 2026-01-28*
