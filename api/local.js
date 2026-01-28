require('dotenv').config();

const app = require('./index');

// 로컬 개발용 서버
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║   주님의 교회 스마트 행정 앱 API           ║
    ║   서버가 ${PORT}번 포트에서 시작되었습니다.     ║
    ║   http://localhost:${PORT}                 ║
    ╚════════════════════════════════════════════╝
    `);
  });
}
