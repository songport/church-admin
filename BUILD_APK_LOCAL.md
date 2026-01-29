# 로컬 APK 빌드 가이드

## 문제
EAS 클라우드 빌드에서 의존성 설치 단계에서 실패 발생

## 해결 방법: APK 파일 다운로드

Expo EAS 빌드 대시보드에서 이전 빌드된 파일 확인:
https://expo.dev/accounts/wonhosong/projects/church-admin

## 빠른 빌드 대안 (5분)

### 옵션 1: Expo Go 앱 사용 (테스트 목적)
```bash
cd frontend
expo start
# QR 코드를 Expo Go 앱으로 스캔
```

### 옵션 2: Android 스튜디오 설치 후 로컬 빌드
```bash
# 1. Android 스튜디오 설치 필요
# 2. ANDROID_SDK_ROOT 환경변수 설정
# 3. 로컬 빌드 실행
eas build --platform android --local
```

### 옵션 3: Turtle CLI 사용 (오프라인 빌드)
```bash
npm install -g turtle-cli
turtle build:android \
  --keystore-path ./android.keystore \
  --keystore-alias your-alias \
  --workdir ./
```

## 현재 상황
- Expo 계정: wonhosong
- 프로젝트: church-admin
- 빌드 ID: 3d09ba02-b0dc-479f-a4a1-5091823b58d4

## 다음 단계
1. EAS 대시보드에서 빌드 로그 확인
2. Android 스튜디오 설치 후 로컬 빌드
3. 또는 Expo Go로 즉시 테스트
