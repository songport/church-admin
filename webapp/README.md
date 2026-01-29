# 🌐 교회 행정 웹앱

Next.js와 TypeScript를 사용한 교회 행정 시스템 웹 버전입니다.

## ✨ 주요 기능

### 🔐 인증
- 로그인/로그아웃
- JWT 토큰 기반 인증
- 쿠키 기반 자동 로그인 유지
- 역할 기반 접근 제어 (관리자/사용자)

### 📍 출석 관리
- 실시간 GPS 위치 확인
- 지오펜싱 (교회 범위 자동 감지)
- 체크인/체크아웃 처리
- 출석 기록 조회

### 💰 지출 관리
- 지출 결의서 작성
- 제목, 금액, 카테고리, 설명 입력
- 지출 목록 조회
- 상태 표시 (대기/승인/반려)

### 🔏 결재 관리 (관리자 전용)
- 대기 중인 결의서 목록 조회
- 필터링 (전체/대기/승인/반려)
- 승인/반려 처리
- 결재 의견 입력

### ⚙️ 사용자 설정
- 프로필 정보 조회
- 보안 설정
- 알림 설정
- 앱 정보

## 📦 기술 스택

### 프론트엔드
- **Next.js 16.1** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Zustand** - 상태 관리
- **Axios** - HTTP 클라이언트
- **js-cookie** - 쿠키 관리

### 백엔드 연동
- REST API (Node.js + Express + MongoDB)
- JWT 토큰 기반 인증
- CORS 지원

## 🚀 시작하기

### 설치
```bash
npm install
```

### 환경 변수 설정
`.env.local` 파일:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속하세요.

### 프로덕션 빌드
```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
webapp/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # 루트 페이지 (리다이렉트)
│   │   ├── login/
│   │   │   └── page.tsx             # 로그인 페이지
│   │   └── dashboard/
│   │       ├── page.tsx             # 대시보드 홈
│   │       ├── attendance/
│   │       │   └── page.tsx         # 출석 관리
│   │       ├── expenditure/
│   │       │   └── page.tsx         # 지출 관리
│   │       ├── approval/
│   │       │   └── page.tsx         # 결재 관리
│   │       └── settings/
│   │           └── page.tsx         # 설정
│   ├── components/
│   │   ├── Button.tsx               # 재사용 가능 버튼
│   │   ├── Input.tsx                # 재사용 가능 입력 필드
│   │   ├── Card.tsx                 # 카드 컴포넌트
│   │   └── Navbar.tsx               # 네비게이션 바
│   ├── lib/
│   │   └── api.ts                   # API 클라이언트
│   └── stores/
│       └── authStore.ts             # Zustand 인증 스토어
├── public/                          # 정적 파일
├── .env.local                       # 환경 변수
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🧪 테스트 계정

```
일반 사용자:
- 사용자명: testuser
- 비밀번호: password123

관리자:
- 사용자명: admin
- 비밀번호: admin123
```

## 📝 주요 페이지

### 로그인 페이지 (/login)
- 사용자명과 비밀번호 입력
- 로그인 유지 옵션
- 에러 메시지 표시

### 대시보드 (/dashboard)
- 환영 메시지
- 빠른 메뉴 카드 (출석, 지출, 결재, 설정)
- 현황 표시

### 출석 관리 (/dashboard/attendance)
- 위치 권한 요청
- 거리 계산 (Haversine 공식)
- 교회 범위 내 자동 감지
- 체크인/체크아웃 버튼
- 출석 기록 조회

### 지출 관리 (/dashboard/expenditure)
- 새 결의서 작성 폼
- 지출 목록 조회
- 상태 배지 (대기/승인/반려)

### 결재 관리 (/dashboard/approval) - 관리자만
- 필터링 (전체/대기/승인/반려)
- 승인/반려 처리
- 결재 의견 입력

### 설정 (/dashboard/settings)
- 프로필 정보 표시
- 보안 설정
- 알림 설정
- 로그아웃

## 🔒 보안 기능

### JWT 인증
- Authorization 헤더에 Bearer 토큰 자동 주입
- 토큰 만료 시 재로그인 유도

### 쿠키 관리
- js-cookie 사용
- 자동 토큰 저장/로드

### 역할 기반 접근
- 관리자 확인 후 결재 페이지 표시
- 비인증 사용자 자동 로그인 리다이렉트

## 📱 브라우저 지원

- Chrome/Edge (최신)
- Firefox (최신)
- Safari (최신)
- Mobile browsers

## 🌐 배포

### Vercel 배포
```bash
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./.next
COPY public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 문서 및 리소스

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com)

## 🎯 향후 계획

- 다크 모드 지원
- 다국어 지원 (i18n)
- 통계 차트 추가
- 실시간 알림 (WebSocket)
- PWA 지원
