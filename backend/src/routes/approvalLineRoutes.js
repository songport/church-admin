const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const approvalLineController = require('../controllers/approvalLineController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 결재선 생성 (관리자 전용)
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  [
    body('name').notEmpty().withMessage('결재선명을 입력하세요.'),
    body('approvers').isArray({ min: 1 }).withMessage('최소 1명의 결재자가 필요합니다.')
  ],
  approvalLineController.createApprovalLine
);

// 모든 결재선 조회
router.get(
  '/',
  authenticateToken,
  approvalLineController.getAllApprovalLines
);

// 특정 결재선 조회
router.get(
  '/:id',
  authenticateToken,
  approvalLineController.getApprovalLineById
);

// 결재선 수정 (관리자 전용)
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  approvalLineController.updateApprovalLine
);

// 결재선 삭제 (관리자 전용)
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  approvalLineController.deleteApprovalLine
);

module.exports = router;
