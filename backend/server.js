require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

// 라우트 import
const userRoutes = require('./src/routes/userRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const approvalLineRoutes = require('./src/routes/approvalLineRoutes');

// 앱 초기화
const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 연결
connectDB();

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 라우트
app.use('/api/auth', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/approval-lines', approvalLineRoutes);

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '서버가 정상 작동 중입니다.',
    timestamp: new Date()
  });
});

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 리소스를 찾을 수 없습니다.'
  });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════════╗
    ║   주님의 교회 스마트 행정 앱 백엔드         ║
    ║   서버가 ${PORT}번 포트에서 시작되었습니다.     ║
    ╚════════════════════════════════════════════╝
  `);
});

module.exports = app;
