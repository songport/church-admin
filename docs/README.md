# 주님의 교회 스마트 행정 앱

## 📋 프로젝트 개요

교회의 행정 업무(출석 체크, 재정 결제)를 **디지털 및 AI 기반으로 전환**하여 종사자와 교인의 업무 부담을 경감하고 효율성을 제고하는 스마트 행정 앱입니다.

## 🎯 주요 기능

### 1. 지오펜싱 기반 출석 관리 시스템
- **위치 기반 출석**: 교회 좌표(2개 지부)를 중심으로 반경 30미터 경계 설정
- **자동 활성화**: 경계 내 진입 시 '출석'/'퇴청' 버튼 자동 활성화
- **자동 퇴청**: 출석 후 5시간 후 자동으로 퇴청 처리
- **백그라운드 추적**: 앱이 꺼져 있어도 위치 권한 동의 하에 진입 감지
- **실시간 명단**: 출석자를 평면적 데이터 구조로 실시간 표시

### 2. AI-OCR 기반 지출결의 시스템
- **자동 인식**: 영수증 사진 촬영 → AI-OCR으로 항목/금액/날짜 자동 분석
- **전자결재**: 작성자 → 부장(1차) → 목사(최종) 승인 워크플로우
- **통계 리포트**: 월별/일별/기간별 지출 합계 시각화

### 3. 관리자 페이지
- **회원 등록**: 직분별 회원 관리 (교인, 집사, 권사, 장로, 심방장, 전도사, 목사)
- **결재선 설정**: 1 → 2 → 3 형식의 결재 라인 설정
- **재정 조회**: 기간별 통계 및 지출 현황 모니터링

## 🏗️ 프로젝트 구조

```
church/
├── backend/                 # Node.js/Express 백엔드
│   ├── src/
│   │   ├── models/         # MongoDB 스키마
│   │   │   ├── User.js
│   │   │   ├── Attendance.js
│   │   │   ├── Expenditure.js
│   │   │   ├── ApprovalLine.js
│   │   │   └── ChurchLocation.js
│   │   ├── controllers/    # 비즈니스 로직
│   │   │   ├── userController.js
│   │   │   ├── attendanceController.js
│   │   │   └── approvalLineController.js
│   │   ├── routes/         # API 라우트
│   │   │   ├── userRoutes.js
│   │   │   ├── attendanceRoutes.js
│   │   │   └── approvalLineRoutes.js
│   │   ├── middleware/     # 미들웨어
│   │   │   └── auth.js
│   │   └── config/         # 설정
│   │       ├── database.js
│   │       └── jwt.js
│   ├── server.js           # Express 메인 서버
│   ├── package.json
│   └── .env
│
├── frontend/               # React Native/Expo 프론트엔드
│   ├── src/
│   │   ├── screens/        # 화면 컴포넌트
│   │   │   ├── LoginScreen.js
│   │   │   ├── AttendanceScreen.js
│   │   │   ├── AdminRegisterScreen.js
│   │   │   └── ApprovalLineManagementScreen.js
│   │   ├── context/        # 전역 상태 관리
│   │   │   └── AuthContext.js
│   │   ├── services/       # API 호출
│   │   │   └── api.js
│   │   ├── navigation/     # 네비게이션
│   │   │   └── Navigation.js
│   │   └── utils/          # 유틸리티
│   ├── App.js              # 메인 앱 진입점
│   ├── package.json
│   ├── app.json
│   └── babel.config.js
│
└── docs/                   # 문서
    ├── API.md              # API 문서
    └── SETUP.md            # 설치 가이드
```

## 🛠️ 기술 스택

### 백엔드
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Geofencing**: Haversine 공식
- **Real-time**: WebSocket (Socket.io)

### 프론트엔드
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **Location**: expo-location, expo-task-manager
- **State Management**: React Context API
- **HTTP Client**: Axios

## 🚀 설치 및 실행

### 1. 백엔드 설정

```bash
cd backend

# 의존성 설치
npm install

# .env 파일 생성
cp .env.example .env

# MongoDB 시작 (로컬)
# mongod

# 서버 실행
npm start
# 또는 개발 모드
npm run dev
```

### 2. 프론트엔드 설정

```bash
cd frontend

# 의존성 설치
npm install

# Expo 앱 실행
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📱 사용자 시나리오

### 일반 교인
1. **로그인**: 사용자명/비밀번호 입력 + 로그인 유지 체크
2. **출석 체크**:
   - 교회 경계(30m) 내 진입 → 자동 알림
   - '출석' 버튼 클릭 → DB 저장
   - 5시간 후 자동 퇴청
3. **실시간 명단 확인**: 현재 출석자 목록 조회

### 관리자
1. **회원 등록**: 직분별 사용자 추가
2. **결재선 설정**: 1단계 → 2단계 → 3단계 결재자 지정
3. **지출 결의 승인**: 상태별 결의서 확인 및 승인
4. **재정 현황**: 월별/기간별 통계 조회

## 🔐 보안

- **전송 암호화**: HTTPS/TLS
- **저장 암호화**: AES-256 (민감 정보)
- **인증**: JWT 토큰 기반
- **권한 관리**: Role-based Access Control (RBAC)
- **개인정보 보호**: KISA 가이드라인 준수

## 📍 교회 위치 설정

| 지부 | 위도 | 경도 |
|------|------|------|
| 강서지부 | 37.6379499 | 126.8747216 |
| 송파지부 | 37.5524510 | 126.8589197 |

- **반경**: 30미터
- **거리 계산**: Haversine 공식 (가장 가까운 지부 기준)

## 📊 데이터베이스 스키마

### User (사용자)
```javascript
{
  username: String,         // 로그인용
  password: String,         // 암호화됨
  name: String,             // 이름
  position: String,         // 직분
  region: String,           // 구역
  department: String,       // 소속
  permissions: {
    canApproveExpenditure: Boolean,  // 1차 승인
    canFinalApprove: Boolean,        // 최종 승인
    isAdmin: Boolean                 // 관리자
  },
  canSubmitExpenditure: Boolean,     // 지출 권한
  isActive: Boolean,
  createdAt: Date
}
```

### Attendance (출석)
```javascript
{
  userId: ObjectId,
  userName: String,
  checkInTime: Date,
  checkOutTime: Date,
  status: 'Enum: 출석|퇴청',
  isAutoCheckOut: Boolean,  // 자동 퇴청 여부
  durationMinutes: Number,  // 체류 시간
  date: Date,
  createdAt: Date
}
```

### ApprovalLine (결재선)
```javascript
{
  name: String,             // 결재선명
  description: String,
  approvers: [
    {
      order: Number,        // 1, 2, 3...
      approverId: ObjectId,
      approverName: String,
      approverPosition: String
    }
  ],
  isActive: Boolean,
  createdAt: Date
}
```

## 🔄 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입 (관리자만)
- `GET /api/auth` - 모든 사용자 조회 (관리자만)
- `PUT /api/auth/:id` - 사용자 수정 (관리자만)

### 출석
- `POST /api/attendance/geofencing` - 지오펜싱 확인
- `POST /api/attendance/check-in` - 출석 체크인
- `POST /api/attendance/check-out` - 퇴청
- `GET /api/attendance/today` - 오늘 출석자 명단
- `GET /api/attendance/statistics` - 기간별 통계

### 결재선
- `POST /api/approval-lines` - 결재선 생성 (관리자만)
- `GET /api/approval-lines` - 결재선 조회
- `PUT /api/approval-lines/:id` - 결재선 수정 (관리자만)
- `DELETE /api/approval-lines/:id` - 결재선 삭제 (관리자만)

## 🎨 UI/UX 설계

### 고령층 친화적
- 큰 글씨 (16pt 이상)
- 높은 대비의 색상
- 직관적인 아이콘
- 간단한 네비게이션

### 반응형 디자인
- iOS/Android 동일 경험
- 다양한 화면 크기 지원

## 📝 라이선스

이 프로젝트는 개인 사용을 위해 개발되었습니다.

## 🤝 기여

버그 리포트나 기능 제안은 환영합니다!

## 📞 연락처

기술 문의: [이메일 또는 연락처]

---

**마지막 업데이트**: 2026년 1월 28일
