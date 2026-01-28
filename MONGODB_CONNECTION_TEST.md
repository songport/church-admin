# MongoDB 연결 테스트 가이드

## 📋 단계별 가이드

### Step 1: MongoDB Atlas에서 연결 문자열 복사

1. **MongoDB Atlas 콘솔 접속**
   - https://cloud.mongodb.com
   - songwonho@gmail.com로 로그인

2. **프로젝트 선택**
   - Project0 클릭

3. **Databases 메뉴로 이동**
   - 좌측 메뉴에서 "Databases" 클릭

4. **Church 클러스터의 Connect 클릭**
   - Cluster: church
   - "Connect" 버튼 클릭

5. **연결 문자열 복사**
   - "Connect your application" 선택
   - Driver: Node.js 18+
   - 연결 문자열 복사:
   ```
   mongodb+srv://<username>:<password>@church.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: 연결 문자열 확인

복사한 문자열에서 다음을 교체해야 합니다:
- `<username>` → 데이터베이스 사용자명 (예: churchadmin)
- `<password>` → 데이터베이스 비밀번호

**최종 예시:**
```
mongodb+srv://churchadmin:MyPassword123!@church.xxxxx.mongodb.net/church-admin?retryWrites=true&w=majority
```

⚠️ **주의**: 비밀번호에 특수문자가 있으면 URL 인코딩해야 합니다.
- ! → %21
- # → %23
- $ → %24
- @ → %40

### Step 3: 로컬에서 테스트

#### 방법 1: 환경 변수로 테스트 (권장)

```bash
# Windows PowerShell
$env:MONGODB_URI = "mongodb+srv://churchadmin:password@church.xxxxx.mongodb.net/church-admin?retryWrites=true&w=majority"
node test-mongodb-connection.js
```

#### 방법 2: .env 파일로 테스트

프로젝트 루트에 `.env` 파일 생성:
```env
MONGODB_URI=mongodb+srv://churchadmin:password@church.xxxxx.mongodb.net/church-admin?retryWrites=true&w=majority
```

그 후 실행:
```bash
node test-mongodb-connection.js
```

### Step 4: 테스트 결과 확인

성공 시:
```
✅ MongoDB 연결 성공!

📊 연결 정보:
  - 상태: 연결됨
  - 호스트: church.xxxxx.mongodb.net
  - 포트: 27017
  - 데이터베이스: church-admin

⚙️ 서버 상태:
  - 버전: 7.0.0
  - 가동 시간: 12345초
  - 프로세스: mongod

📦 컬렉션 목록:
  - (아직 생성된 컬렉션 없음)

✨ 테스트 완료!
```

실패 시:
```
❌ MongoDB 연결 실패!

오류: authentication failed
💡 해결 방법:
  1. MongoDB Atlas에서 사용자 이름/비밀번호 확인
  2. 특수문자가 있으면 URL 인코딩 확인
```

---

## 🔒 보안 주의사항

### ❌ 절대 하지 말 것
```
1. 연결 문자열을 GitHub에 커밋 금지
2. 비밀번호를 코드에 하드코딩 금지
3. 연결 문자열을 Slack/Email로 공유 금지
```

### ✅ 올바른 방법
```
1. .env 파일에만 저장
2. .env를 .gitignore에 추가
3. Vercel에 환경 변수로 설정
```

---

## 📊 MongoDB Atlas 설정 확인 체크리스트

- [ ] MongoDB Atlas 계정 생성 (songwonho@gmail.com)
- [ ] Project0 생성
- [ ] Church 클러스터 생성
- [ ] 데이터베이스 사용자 생성 (churchadmin)
- [ ] IP 화이트리스트 설정 (0.0.0.0/0 또는 특정 IP)
- [ ] 연결 문자열 복사
- [ ] 로컬에서 연결 테스트 (`node test-mongodb-connection.js`)
- [ ] Vercel 환경 변수 설정 준비

---

## 🆘 트러블슈팅

### Q: "Authentication failed" 오류
```
A: 1. 사용자명/비밀번호 다시 확인
   2. 특수문자 URL 인코딩
   3. 비밀번호 리셋 후 재시도
```

### Q: "connection timed out" 오류
```
A: 1. 인터넷 연결 확인
   2. IP 화이트리스트 확인 (0.0.0.0/0)
   3. 방화벽 설정 확인
```

### Q: "certificate verify failed" 오류
```
A: MongoDB 드라이버 버전 확인
   npm install mongodb@latest
```

---

*마지막 업데이트: 2026-01-28*
