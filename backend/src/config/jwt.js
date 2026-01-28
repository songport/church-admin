const jwt = require('jsonwebtoken');

// JWT 생성
const generateToken = (userId, expiresIn = '24h') => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn }
  );
};

// JWT 검증
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
