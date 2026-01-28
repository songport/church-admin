# 설치 및 실행 가이드

## 📋 사전 요구사항

### 필수 소프트웨어
- **Node.js** (v16 이상)
- **npm** 또는 **yarn**
- **MongoDB** (로컬 또는 클라우드)
- **Git**

### 선택 사항
- **Visual Studio Code** (권장 에디터)
- **Android Studio** (Android 개발용)
- **Xcode** (iOS 개발용)

## 🚀 빠른 시작

### 1단계: 프로젝트 클론

```bash
git clone https://github.com/your-repo/church-admin.git
cd church
```

### 2단계: 백엔드 설정

#### 2-1. 의존성 설치
```bash
cd backend
npm install
```

#### 2-2. 환경 설정
`.env` 파일을 생성하고 다음과 같이 설정합니다:

```env
# 기본 설정
PORT=3000
NODE_ENV=development

# MongoDB 설정
MONGODB_URI=mongodb://localhost:27017/church-admin

# JWT 설정
JWT_SECRET=your_very_secure_secret_key_here_change_in_production

# Google Cloud Vision API (선택사항)
GOOGLE_VISION_API_KEY=your_google_vision_api_key
```

#### 2-3. MongoDB 시작

**Windows (WSL 또는 PowerShell)**:
```bash
# MongoDB가 이미 설치되어 있다면
mongod

# 또는 Docker 사용
docker run -d -p 27017:27017 --name mongodb mongo
```

**macOS**:
```bash
# Homebrew로 설치된 경우
brew services start mongodb-community

# 또는 직접 실행
mongod
```

#### 2-4. 초기 데이터 생성 (선택)

```bash
# 관리자 계정 생성 및 교회 위치 초기화
node scripts/init-data.js
```

#### 2-5. 서버 실행

```bash
# 프로덕션 모드
npm start

# 개발 모드 (자동 재시작)
npm run dev
```

✅ 서버가 `http://localhost:3000`에서 시작됩니다.

### 3단계: 프론트엔드 설정

#### 3-1. 의존성 설치
```bash
cd ../frontend
npm install
```

#### 3-2. 환경 설정 (필요시)

`.env` 파일 생성:
```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_DEBUG=true
```

또는 `frontend/src/services/api.js`에서 직접 수정:
```javascript
const API_BASE_URL = 'http://YOUR_IP:3000/api'; // 기기의 IP 주소 사용
```

#### 3-3. Expo 앱 실행

```bash
# Metro bundler 시작
npm start

# 또는
expo start
```

터미널에서 다음 옵션이 표시됩니다:

```
› Metro waiting on exp://192.168.1.100:19000
› Scan QR code above with Expo Go app ›

Press i – open iOS simulator
Press a – open Android emulator
Press w – open web
Press r – restart Metro
Press m – toggle menu
```

#### 3-4. 모바일에서 실행

**Android**:
```bash
npm run android
# 또는
expo start --android
```

**iOS**:
```bash
npm run ios
# 또는
expo start --ios
```

**Web**:
```bash
npm run web
# 또는
expo start --web
```

## 📱 테스트 계정

### 테스트용 초기 사용자

서버 시작 시 다음 계정들이 자동으로 생성됩니다 (`init-data.js` 실행 시):

| 사용자 | 비밀번호 | 역할 | 권한 |
|--------|----------|------|------|
| admin | admin123 | 관리자 | 전체 |
| user1 | user123 | 교인 | 기본 |
| user2 | user123 | 부장 | 1차 승인 |
| user3 | user123 | 목사 | 최종 승인 |

### 직접 생성하기

1. 로그인 화면에서 관리자 계정으로 로그인
2. 관리자 페이지 → '회원 등록'
3. 새 사용자 정보 입력
4. '등록하기' 클릭

## 🔧 문제 해결

### MongoDB 연결 오류

**오류 메시지**:
```
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
```

**해결책**:
1. MongoDB 데몬이 실행 중인지 확인
2. MongoDB URI가 올바른지 확인
3. `.env` 파일의 `MONGODB_URI` 재확인

```bash
# MongoDB 상태 확인
mongosh

# 또는 mongod 직접 실행
mongod --dbpath /path/to/data
```

### 위치 권한 오류 (모바일)

**오류 메시지**:
```
Location permission denied
```

**해결책**:
1. 앱 설정에서 위치 권한 활성화
2. 정확한 위치 서비스 활성화
3. 백그라운드 위치 추적 허용

### API 연결 실패

**문제**: 프론트엔드가 백엔드에 연결할 수 없음

**해결책**:
1. 백엔드 서버가 실행 중인지 확인 (`http://localhost:3000`)
2. 프론트엔드의 API URL 확인
3. 방화벽 설정 확인
4. 모바일 기기에서 로컬 IP 사용:

```javascript
// api.js에서
const API_BASE_URL = 'http://192.168.1.100:3000/api'; // 자신의 IP로 변경
```

### 모듈 찾을 수 없음

**오류 메시지**:
```
Cannot find module 'express'
```

**해결책**:
```bash
# 의존성 재설치
npm install

# 또는 특정 패키지만 설치
npm install express
```

### 포트 충돌

**포트 3000이 이미 사용 중인 경우**:

```bash
# 다른 포트 사용
PORT=3001 npm start
```

## 🌐 배포

### 백엔드 배포 (Heroku 예시)

```bash
# Heroku CLI 설치 후
heroku login
heroku create your-app-name
git push heroku main
```

### 프론트엔드 배포

**Expo EAS Build** 사용:
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

또는 **Google Play Store**와 **Apple App Store**에 직접 배포

## 📊 데이터베이스 초기화

기존 데이터를 삭제하고 초기 상태로 복원:

```bash
# 프롬프트 또는 스크립트로 실행
node scripts/reset-db.js
```

## 🔒 보안 체크리스트

배포 전에 다음을 확인하세요:

- [ ] JWT_SECRET을 강력한 임의 문자열로 변경
- [ ] MongoDB 인증 활성화
- [ ] HTTPS 활성화 (프로덕션)
- [ ] CORS 설정 검토
- [ ] 환경 변수 노출 방지
- [ ] Rate limiting 설정
- [ ] 입력 유효성 검사 확인
- [ ] 로깅 및 모니터링 설정

## 📚 추가 리소스

- [Express.js 공식 문서](https://expressjs.com/)
- [MongoDB 공식 문서](https://docs.mongodb.com/)
- [React Native 공식 문서](https://reactnative.dev/)
- [Expo 공식 문서](https://docs.expo.dev/)

## 💡 팁

1. **개발 중 핫 리로드**: 자동 재시작 활성화
   ```bash
   npm run dev
   ```

2. **API 테스트**: Postman 또는 Insomnia 사용

3. **로그 확인**: 터미널에서 실시간 로그 모니터링

4. **모바일 테스트**: 실제 기기에서 테스트 권장

## 🚨 주의사항

- **로컬 개발에서만 사용**: 프로덕션 배포 전 보안 체크 필수
- **데이터 백업**: 중요 데이터는 정기적으로 백업
- **의존성 업데이트**: 보안 패치 정기 적용

---

**도움이 필요하면**: Issues 탭에서 버그 리포트를 작성해주세요.

**마지막 업데이트**: 2026년 1월 28일
