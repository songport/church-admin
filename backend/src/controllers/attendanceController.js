const Attendance = require('../models/Attendance');
const ChurchLocation = require('../models/ChurchLocation');

// 두 좌표 사이의 거리 계산 (Haversine 공식)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// 가장 가까운 교회 위치 찾기
const getNearestChurch = async (userLat, userLon) => {
  const churches = await ChurchLocation.find({ isActive: true });
  
  let nearestChurch = null;
  let minDistance = Infinity;

  churches.forEach(church => {
    const distance = calculateDistance(
      userLat,
      userLon,
      church.latitude,
      church.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestChurch = { church, distance };
    }
  });

  return nearestChurch;
};

// 지오펜싱 확인
const checkGeofencing = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: '위치 정보가 필요합니다.'
      });
    }

    const nearestResult = await getNearestChurch(latitude, longitude);
    
    if (!nearestResult) {
      return res.status(400).json({
        success: false,
        message: '등록된 교회 위치가 없습니다.'
      });
    }

    const { church, distance } = nearestResult;
    const isInside = distance <= church.radius;

    res.json({
      success: true,
      isInside,
      distance: Math.round(distance),
      radius: church.radius,
      church: {
        id: church._id,
        name: church.name,
        latitude: church.latitude,
        longitude: church.longitude
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '지오펜싱 확인 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 출석 체크인
const checkIn = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;
    const userPosition = req.user.position;

    // 지오펜싱 확인
    const nearestResult = await getNearestChurch(latitude, longitude);
    if (!nearestResult || nearestResult.distance > nearestResult.church.radius) {
      return res.status(400).json({
        success: false,
        message: '교회 경계 내에 있지 않습니다.'
      });
    }

    // 오늘 중복 체크인 확인
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingCheckIn = await Attendance.findOne({
      userId,
      date: { $gte: today }
    });

    if (existingCheckIn && existingCheckIn.status === '출석') {
      return res.status(400).json({
        success: false,
        message: '이미 출석 체크인을 하셨습니다.'
      });
    }

    // 새로운 출석 기록 생성
    const attendance = new Attendance({
      userId,
      userName,
      userPosition,
      userRegion: req.user.region,
      checkInTime: new Date(),
      status: '출석',
      date: new Date()
    });

    // 5시간 후 자동 퇴청 예약
    setTimeout(async () => {
      try {
        const record = await Attendance.findById(attendance._id);
        if (record && record.status === '출석') {
          record.checkOutTime = new Date();
          record.status = '퇴청';
          record.isAutoCheckOut = true;
          record.durationMinutes = Math.round((record.checkOutTime - record.checkInTime) / 60000);
          await record.save();
          console.log(`자동 퇴청: ${userName} (${attendance._id})`);
        }
      } catch (error) {
        console.error('자동 퇴청 오류:', error);
      }
    }, 5 * 60 * 60 * 1000); // 5시간

    await attendance.save();

    res.json({
      success: true,
      message: '출석 체크인을 완료했습니다.',
      attendance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '출석 체크인 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 퇴청
const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: today },
      status: '출석'
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: '출석 기록을 찾을 수 없습니다.'
      });
    }

    // 퇴청 처리
    attendance.checkOutTime = new Date();
    attendance.status = '퇴청';
    attendance.durationMinutes = Math.round((attendance.checkOutTime - attendance.checkInTime) / 60000);
    
    await attendance.save();

    res.json({
      success: true,
      message: '퇴청을 완료했습니다.',
      attendance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '퇴청 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 오늘의 출석자 명단 조회 (평면적 데이터 구조)
const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendanceList = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    })
    .sort({ checkInTime: 1 })
    .lean();

    // 평면적 데이터 구조로 변환
    const flatData = attendanceList.map(record => ({
      id: record._id,
      userId: record.userId,
      name: record.userName,
      position: record.userPosition,
      region: record.userRegion,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      status: record.status,
      durationMinutes: record.durationMinutes,
      isAutoCheckOut: record.isAutoCheckOut
    }));

    res.json({
      success: true,
      date: today,
      count: flatData.length,
      attendanceList: flatData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '출석 명단 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 기간별 출석 통계
const getAttendanceStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const statistics = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$userId',
          userName: { $first: '$userName' },
          userPosition: { $first: '$userPosition' },
          userRegion: { $first: '$userRegion' },
          totalDays: { $sum: 1 },
          totalDurationMinutes: { $sum: '$durationMinutes' }
        }
      },
      {
        $sort: { totalDays: -1 }
      }
    ]);

    res.json({
      success: true,
      startDate: start,
      endDate: end,
      count: statistics.length,
      statistics
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '통계 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

module.exports = {
  checkGeofencing,
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceStatistics
};
