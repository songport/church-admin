const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken } = require('../middleware/auth');

// 지오펜싱 확인
router.post(
  '/geofencing',
  [
    body('latitude').isFloat().withMessage('올바른 위도 형식이 아닙니다.'),
    body('longitude').isFloat().withMessage('올바른 경도 형식이 아닙니다.')
  ],
  attendanceController.checkGeofencing
);

// 출석 체크인
router.post(
  '/check-in',
  authenticateToken,
  [
    body('latitude').isFloat().withMessage('올바른 위도 형식이 아닙니다.'),
    body('longitude').isFloat().withMessage('올바른 경도 형식이 아닙니다.')
  ],
  attendanceController.checkIn
);

// 퇴청
router.post(
  '/check-out',
  authenticateToken,
  attendanceController.checkOut
);

// 오늘의 출석자 명단
router.get(
  '/today',
  authenticateToken,
  attendanceController.getTodayAttendance
);

// 기간별 통계
router.get(
  '/statistics',
  authenticateToken,
  [
    query('startDate').isISO8601().withMessage('올바른 날짜 형식이 아닙니다.'),
    query('endDate').isISO8601().withMessage('올바른 날짜 형식이 아닙니다.')
  ],
  attendanceController.getAttendanceStatistics
);

module.exports = router;
