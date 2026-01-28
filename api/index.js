require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// 앱 초기화
const app = express();

// 데이터베이스 연결 (한 번만)
let dbConnected = false;

const connectDB = async () => {
  if (dbConnected) return;
  
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/church-admin';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB 데이터베이스에 연결되었습니다.');
    dbConnected = true;
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    throw error;
  }
};

// 라우트 import
const userRoutes = require('../backend/src/routes/userRoutes');
const attendanceRoutes = require('../backend/src/routes/attendanceRoutes');
const approvalLineRoutes = require('../backend/src/routes/approvalLineRoutes');

// 미들웨어
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:8081',
    'http://localhost:19000',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// DB 연결 미들웨어
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB 연결 실패:', error);
    res.status(500).json({
      success: false,
      message: '데이터베이스 연결 실패'
    });
  }
});

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API 라우트
app.use('/auth', userRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/approval-lines', approvalLineRoutes);

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '서버가 정상 작동 중입니다.',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 홈 페이지
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '주님의 교회 스마트 행정 앱 - API 서버',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      attendance: '/attendance',
      approvalLines: '/approval-lines',
      health: '/health',
      dashboard: '/dashboard.html'
    }
  });
});

// 대시보드
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
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

// Vercel serverless handler
module.exports = app;
