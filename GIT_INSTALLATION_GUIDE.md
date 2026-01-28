# Git 설치 및 GitHub 코드 푸시 가이드

## ⚠️ 현재 상태

Git이 컴퓨터에 설치되지 않았습니다.

---

## 🔧 해결 방법 (3가지)

### 방법 1: Git 설치 (권장) ⭐

#### 1-1. Git 다운로드 및 설치
```
1. https://git-scm.com/download/win 접속
2. "Click here to download" 클릭
3. 설치 프로그램 실행 (git-x.xx.x-64-bit.exe)
4. 기본 설정으로 설치 완료
```

#### 1-2. 설치 확인
```powershell
git --version
# 출력: git version 2.xx.x
```

#### 1-3. Git 설정
```powershell
git config --global user.name "송원호"
git config --global user.email "songwonho@gmail.com"
```

#### 1-4. 코드 푸시
```powershell
cd c:\dev\church
git init
git add .
git commit -m "Initial commit: Church Admin App"
git remote add origin https://github.com/YOUR_USERNAME/church-admin.git
git branch -M main
git push -u origin main
```

---

### 방법 2: GitHub Desktop 사용

#### 2-1. GitHub Desktop 다운로드
```
https://desktop.github.com/
```

#### 2-2. 설치 및 로그인
```
1. 설치 프로그램 실행
2. GitHub 계정으로 로그인
3. songwonho@gmail.com 입력
```

#### 2-3. 저장소 생성
```
1. File → Clone Repository
2. 또는 File → New Repository
3. churchadmin 저장소 선택
```

#### 2-4. 코드 푸시
```
1. Current Branch 확인 (main이어야 함)
2. "Publish repository" 클릭
3. Public 선택
4. "Publish" 클릭
```

---

### 방법 3: GitHub 웹에서 파일 업로드

#### 3-1. GitHub 저장소 생성
```
https://github.com/new
Repository name: church-admin
"Create repository" 클릭
```

#### 3-2. 파일 업로드
```
1. 저장소 페이지에서 "Add file" → "Upload files" 클릭
2. 폴더별로 파일 업로드
3. "Commit changes" 클릭
```

⚠️ 단점: 많은 파일이 있어서 번거로움

---

## 🎯 추천: 방법 1 (Git 설치) 사용

### 📋 단계별 실행

#### Step 1: Git 설치 (3분)
```
1. https://git-scm.com/download/win 접속
2. 설치 프로그램 다운로드
3. 기본 설정으로 설치
4. 컴퓨터 재시작 (선택)
```

#### Step 2: GitHub 저장소 생성 (1분)
```
1. https://github.com/new 접속
2. Repository name: church-admin
3. Public 선택
4. "Create repository" 클릭
```

#### Step 3: 코드 푸시 (2분)
```powershell
cd c:\dev\church
git init
git config user.name "송원호"
git config user.email "songwonho@gmail.com"
git add .
git commit -m "Initial commit: Church Admin App with Vercel setup"
git remote add origin https://github.com/songwonho/church-admin.git
git branch -M main
git push -u origin main
```

✅ GitHub에서 코드 확인

#### Step 4: Vercel 배포 (3분)
```
1. https://vercel.com/dashboard
2. "New Project" 클릭
3. GitHub 저장소 선택 (church-admin)
4. 환경 변수 설정:
   - MONGODB_URI: mongodb+srv://songwonho_db_user:password@church.adaqcxm.mongodb.net/church-admin?retryWrites=true&w=majority
   - JWT_SECRET: church-admin-secret-2026-!@#$%^&*
   - NODE_ENV: production
5. Deploy 클릭
```

#### Step 5: 테스트 (5분)
```
배포 URL: https://church-admin.vercel.app (예시)
테스트: https://church-admin.vercel.app/dashboard
```

---

## 📝 현재 파일 구조 (배포 준비 완료)

```
✅ api/index.js              - Vercel 진입점
✅ vercel.json               - Vercel 설정
✅ backend/                  - Express 서버
✅ frontend/                 - React Native
✅ public/dashboard.html     - API 테스트 도구
✅ docs/                     - 배포 문서
```

모든 파일이 이미 준비되어 있으니, Git 설치 후 push만 하면 됩니다!

---

## ✨ 다음 단계 (지금 바로!)

1. **Git 설치** (3분)
   - https://git-scm.com/download/win

2. **GitHub 저장소 생성** (1분)
   - https://github.com/new

3. **PowerShell에서 실행** (2분)
```powershell
cd c:\dev\church
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/songwonho/church-admin.git
git branch -M main
git push -u origin main
```

4. **Vercel에 배포** (5분)
   - https://vercel.com/dashboard

---

*최종 업데이트: 2026-01-28*
