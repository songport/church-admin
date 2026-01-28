# API 문서

## 기본 정보

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **인증**: JWT Bearer Token

## 인증 (Authentication)

### 로그인
사용자를 인증하고 JWT 토큰을 발급합니다.

```
POST /auth/login
```

**요청 본문**:
```json
{
  "username": "user123",
  "password": "password123"
}
```

**응답 (200)**:
```json
{
  "success": true,
  "message": "로그인 성공",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "_id": "507f...",
    "username": "user123",
    "name": "홍길동",
    "position": "교인",
    "region": "양천",
    "department": "8남전도회",
    "permissions": {
      "canApproveExpenditure": false,
      "canFinalApprove": false,
      "isAdmin": false
    },
    "isActive": true
  }
}
```

**오류 (401)**:
```json
{
  "success": false,
  "message": "사용자명 또는 비밀번호가 잘못되었습니다."
}
```

---

### 회원가입 (관리자만)
새로운 사용자를 등록합니다.

```
POST /auth/register
Authorization: Bearer {token}
```

**요청 본문**:
```json
{
  "username": "newuser",
  "password": "password123",
  "name": "김철수",
  "email": "kim@example.com",
  "phone": "010-1234-5678",
  "position": "집사",
  "region": "양천",
  "department": "8남전도회",
  "canSubmitExpenditure": true
}
```

**응답 (201)**:
```json
{
  "success": true,
  "message": "사용자가 등록되었습니다.",
  "user": { ... }
}
```

---

## 출석 (Attendance)

### 지오펜싱 확인
사용자의 위치가 교회 경계 내에 있는지 확인합니다.

```
POST /attendance/geofencing
```

**요청 본문**:
```json
{
  "latitude": 37.6379499,
  "longitude": 126.8747216
}
```

**응답 (200)**:
```json
{
  "success": true,
  "isInside": true,
  "distance": 15,
  "radius": 30,
  "church": {
    "id": "507f...",
    "name": "주님의 교회 - 강서지부",
    "latitude": 37.6379499,
    "longitude": 126.8747216
  }
}
```

---

### 출석 체크인
교인의 출석을 기록합니다.

```
POST /attendance/check-in
Authorization: Bearer {token}
```

**요청 본문**:
```json
{
  "latitude": 37.6379499,
  "longitude": 126.8747216
}
```

**응답 (200)**:
```json
{
  "success": true,
  "message": "출석 체크인을 완료했습니다.",
  "attendance": {
    "_id": "507f...",
    "userId": "507f...",
    "userName": "홍길동",
    "userPosition": "교인",
    "checkInTime": "2026-01-28T08:30:00Z",
    "status": "출석",
    "date": "2026-01-28T00:00:00Z"
  }
}
```

**오류 (400)**:
```json
{
  "success": false,
  "message": "교회 경계 내에 있지 않습니다."
}
```

---

### 퇴청
교인의 퇴청을 기록합니다.

```
POST /attendance/check-out
Authorization: Bearer {token}
```

**응답 (200)**:
```json
{
  "success": true,
  "message": "퇴청을 완료했습니다.",
  "attendance": {
    "_id": "507f...",
    "userId": "507f...",
    "checkInTime": "2026-01-28T08:30:00Z",
    "checkOutTime": "2026-01-28T09:30:00Z",
    "status": "퇴청",
    "durationMinutes": 60
  }
}
```

---

### 오늘의 출석자 명단
오늘 출석한 교인 목록을 조회합니다.

```
GET /attendance/today
Authorization: Bearer {token}
```

**응답 (200)**:
```json
{
  "success": true,
  "date": "2026-01-28T00:00:00Z",
  "count": 5,
  "attendanceList": [
    {
      "id": "507f...",
      "userId": "507f...",
      "name": "홍길동",
      "position": "교인",
      "region": "양천",
      "checkInTime": "2026-01-28T08:30:00Z",
      "checkOutTime": "2026-01-28T09:30:00Z",
      "status": "퇴청",
      "durationMinutes": 60,
      "isAutoCheckOut": false
    }
  ]
}
```

---

### 기간별 통계
특정 기간의 출석 통계를 조회합니다.

```
GET /attendance/statistics?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer {token}
```

**응답 (200)**:
```json
{
  "success": true,
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-01-31T23:59:59Z",
  "count": 3,
  "statistics": [
    {
      "_id": "507f...",
      "userName": "홍길동",
      "userPosition": "교인",
      "userRegion": "양천",
      "totalDays": 10,
      "totalDurationMinutes": 600
    }
  ]
}
```

---

## 결재선 (ApprovalLine)

### 결재선 생성 (관리자만)
새로운 결재 라인을 생성합니다.

```
POST /approval-lines
Authorization: Bearer {token}
```

**요청 본문**:
```json
{
  "name": "기본 지출 결재선",
  "description": "일반 지출 결의용 기본 결재선",
  "approvers": [
    {
      "approverId": "507f1...",
      "order": 1
    },
    {
      "approverId": "507f2...",
      "order": 2
    },
    {
      "approverId": "507f3...",
      "order": 3
    }
  ]
}
```

**응답 (201)**:
```json
{
  "success": true,
  "message": "결재선이 생성되었습니다.",
  "approvalLine": {
    "_id": "507f...",
    "name": "기본 지출 결재선",
    "description": "일반 지출 결의용 기본 결재선",
    "approvers": [
      {
        "order": 1,
        "approverId": "507f1...",
        "approverName": "김부장",
        "approverPosition": "부장"
      },
      {
        "order": 2,
        "approverId": "507f2...",
        "approverName": "이장로",
        "approverPosition": "장로"
      },
      {
        "order": 3,
        "approverId": "507f3...",
        "approverName": "박목사",
        "approverPosition": "목사"
      }
    ],
    "isActive": true,
    "createdAt": "2026-01-28T00:00:00Z"
  }
}
```

---

### 모든 결재선 조회
등록된 모든 결재선을 조회합니다.

```
GET /approval-lines
Authorization: Bearer {token}
```

**응답 (200)**:
```json
{
  "success": true,
  "count": 2,
  "approvalLines": [
    {
      "_id": "507f1...",
      "name": "기본 지출 결재선",
      "approvers": [ ... ]
    },
    {
      "_id": "507f2...",
      "name": "대금 지출 결재선",
      "approvers": [ ... ]
    }
  ]
}
```

---

### 특정 결재선 조회
특정 결재선의 상세 정보를 조회합니다.

```
GET /approval-lines/{id}
Authorization: Bearer {token}
```

**응답 (200)**:
```json
{
  "success": true,
  "approvalLine": { ... }
}
```

---

## 에러 응답

### 401 - 미인증
```json
{
  "success": false,
  "message": "토큰이 유효하지 않습니다."
}
```

### 403 - 권한 없음
```json
{
  "success": false,
  "message": "관리자 권한이 필요합니다."
}
```

### 404 - 찾을 수 없음
```json
{
  "success": false,
  "message": "요청한 리소스를 찾을 수 없습니다."
}
```

### 500 - 서버 오류
```json
{
  "success": false,
  "message": "서버 오류가 발생했습니다.",
  "error": { ... }
}
```

---

## HTTP 상태 코드

| 코드 | 설명 |
|------|------|
| 200 | 요청 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 |
| 401 | 미인증 |
| 403 | 권한 없음 |
| 404 | 찾을 수 없음 |
| 500 | 서버 오류 |

---

## 인증 예제

모든 보호된 엔드포인트에 JWT 토큰을 포함해야 합니다:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**cURL 예제**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/attendance/today
```

**JavaScript (Axios) 예제**:
```javascript
const response = await axios.get('http://localhost:3000/api/attendance/today', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

**마지막 업데이트**: 2026년 1월 28일
