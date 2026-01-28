const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

// JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: '토큰이 제공되지 않았습니다.' 
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        success: false,
        message: '토큰이 유효하지 않습니다.' 
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: '사용자를 찾을 수 없습니다.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: '인증 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
};

// 관리자 권한 확인
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.permissions?.isAdmin) {
    return res.status(403).json({ 
      success: false,
      message: '관리자 권한이 필요합니다.' 
    });
  }
  next();
};

// 결재 권한 확인
const requireApprovalPermission = (req, res, next) => {
  if (!req.user || !req.user.permissions?.canApproveExpenditure) {
    return res.status(403).json({ 
      success: false,
      message: '결재 권한이 없습니다.' 
    });
  }
  next();
};

// 최종 승인 권한 확인
const requireFinalApprovalPermission = (req, res, next) => {
  if (!req.user || !req.user.permissions?.canFinalApprove) {
    return res.status(403).json({ 
      success: false,
      message: '최종 승인 권한이 없습니다.' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireApprovalPermission,
  requireFinalApprovalPermission
};
