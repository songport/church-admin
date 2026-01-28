const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/church-admin';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB 데이터베이스에 연결되었습니다.');

    // 초기 데이터 생성 (필요시)
    await initializeDefaultData();
    
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

// 초기 데이터 생성 함수
const initializeDefaultData = async () => {
  try {
    const ChurchLocation = require('../models/ChurchLocation');
    const existingLocations = await ChurchLocation.find();

    if (existingLocations.length === 0) {
      // 두 개의 교회 위치 생성
      const locations = [
        {
          name: '주님의 교회 - 강서지부',
          latitude: 37.6379499,
          longitude: 126.8747216,
          address: '서울시 강서구',
          radius: 30,
          isActive: true
        },
        {
          name: '주님의 교회 - 송파지부',
          latitude: 37.5524510,
          longitude: 126.8589197,
          address: '서울시 송파구',
          radius: 30,
          isActive: true
        }
      ];

      await ChurchLocation.insertMany(locations);
      console.log('교회 위치 초기 데이터가 생성되었습니다.');
    }
  } catch (error) {
    console.error('초기 데이터 생성 중 오류:', error);
  }
};

module.exports = connectDB;
