const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 로그인
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('사용자명을 입력하세요.'),
    body('password').notEmpty().withMessage('비밀번호를 입력하세요.')
  ],
  userController.login
);

// 회원가입 (관리자 전용)
router.post(
  '/register',
  authenticateToken,
  requireAdmin,
  [
    body('username').notEmpty().withMessage('사용자명을 입력하세요.'),
    body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
    body('name').notEmpty().withMessage('이름을 입력하세요.'),
    body('position').notEmpty().withMessage('직분을 선택하세요.')
  ],
  userController.registerUser
);

// 모든 사용자 조회 (관리자 전용)
router.get(
  '/',
  authenticateToken,
  requireAdmin,
  userController.getAllUsers
);

// 특정 사용자 조회
router.get(
  '/:id',
  authenticateToken,
  userController.getUserById
);

// 사용자 수정 (관리자 전용)
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  userController.updateUser
);

// 사용자 삭제 (관리자 전용)
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  userController.deleteUser
);

module.exports = router;
