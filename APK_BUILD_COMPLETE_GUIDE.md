# 🤖 Android APK 빌드 가이드

**상태**: EAS 클라우드 빌드 환경 설정 이슈 → 대체 방법 제시

---

## 💡 빠른 해결책 (5분 완성)

### 방법 1️⃣: **Expo Go 사용** (권장 - 가장 빠름)
```bash
cd frontend
npm install
expo start
```

그 후:
- **Android**: Expo Go 앱 다운로드 후 QR 코드 스캔
- **iOS**: 같은 방법

✅ **장점**: 설치 없음, 즉시 테스트 가능  
❌ **단점**: 배포용 APK가 아님

---

### 방법 2️⃣: **EAS 클라우드 빌드** (배포용)
```bash
cd c:\dev\church
eas build --platform android --profile preview
```

진행 상황:
```
✅ Expo 계정 생성 완료
✅ EAS 프로젝트 연결 완료
✅ Keystore 생성 완료
❌ 의존성 설치 단계에서 실패 (환경 이슈)
```

**해결 방법**:
1. 로컬 Android SDK 설치
2. `eas build --platform android --local` 실행

---

## 📱 APK 다운로드 방법

### Expo EAS 대시보드
```
https://expo.dev/accounts/wonhosong/projects/church-admin
```

**빌드 목록**:
- Build ID: `0de7bd30-73b1-4d88-916b-7c0a864298c0` (최신)
- Status: In Progress / Failed

완료되면 APK 다운로드 링크 표시됨

---

## 🛠️ Android Studio를 사용한 로컬 빌드

### 1단계: Android Studio 설치
```
https://developer.android.com/studio
```

### 2단계: 환경 변수 설정
```powershell
# PowerShell (관리자)
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", "C:\Users\YourUsername\AppData\Local\Android\sdk", "User")
```

### 3단계: 로컬 빌드 실행
```bash
cd c:\dev\church
eas build --platform android --local
```

---

## 📋 현재 프로젝트 설정

### Expo 계정
- **계정명**: wonhosong
- **이메일**: songport@msn.com
- **프로젝트**: @wonhosong/church-admin

### 패키지 정보
- **Package**: com.wonhosong.churchadmin
- **Version**: 1.0.0
- **SDK**: 48.0.0

### 필수 권한 설정 완료 ✅
```
- INTERNET
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
```

---

## ✅ 체크리스트

- [x] Expo CLI 설치
- [x] EAS CLI 설치
- [x] Expo 계정 생성 및 로그인
- [x] EAS 프로젝트 생성
- [x] app.json 설정 (아이콘, 스플래시, 권한)
- [x] eas.json 설정 (빌드 프로필)
- [x] 클라우드 빌드 시도 (환경 문제로 실패)
- [ ] 로컬 Android SDK 설치
- [ ] 로컬 빌드 실행
- [ ] APK 생성 및 다운로드

---

## 🎯 다음 단계

### 즉시 테스트 (권장)
```bash
cd frontend && expo start
# Expo Go 앱으로 스캔하여 테스트
```

### 배포 준비
```bash
# Android Studio 설치 후
eas build --platform android --local
```

### 수동 APK 빌드
Android Studio → Build → Build Bundle(s) / APK(s)

---

## 🔗 유용한 링크

- [Expo 공식 문서](https://docs.expo.dev)
- [EAS Build 가이드](https://docs.expo.dev/build/introduction/)
- [Android Studio 설치](https://developer.android.com/studio)
- [Church Admin 프로젝트](https://expo.dev/accounts/wonhosong/projects/church-admin)

---

## 💬 문제 해결

**Q: "Unknown error. See logs of the Install dependencies build phase"**  
A: EAS 서버의 의존성 설치 단계에서 실패. 로컬 빌드 사용 권장.

**Q: APK는 어디에 있나?**  
A: Expo EAS 대시보드에서 빌드 완료 후 다운로드 가능.

**Q: Expo Go 없이 테스트할 수 있나?**  
A: Android 에뮬레이터 또는 실제 디바이스에서 Expo Go 앱 설치 필요.

---

**마지막 업데이트**: 2026년 1월 29일  
**상태**: 배포 준비 완료, APK 생성 대기 중
