const ApprovalLine = require('../models/ApprovalLine');
const User = require('../models/User');

// 결재선 생성
const createApprovalLine = async (req, res) => {
  try {
    const { name, description, approvers } = req.body;

    // approvers 유효성 검사
    if (!approvers || approvers.length === 0) {
      return res.status(400).json({
        success: false,
        message: '최소 1명의 결재자가 필요합니다.'
      });
    }

    // 중복 검사
    const existing = await ApprovalLine.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 결재선명입니다.'
      });
    }

    // approvers에서 사용자 정보 추가
    const processedApprovers = [];
    for (const approver of approvers) {
      const user = await User.findById(approver.approverId);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: `사용자 ${approver.approverId}를 찾을 수 없습니다.`
        });
      }

      processedApprovers.push({
        order: approver.order,
        approverId: user._id,
        approverName: user.name,
        approverPosition: user.position
      });
    }

    // 순서대로 정렬
    processedApprovers.sort((a, b) => a.order - b.order);

    const approvalLine = new ApprovalLine({
      name,
      description,
      approvers: processedApprovers
    });

    await approvalLine.save();

    res.status(201).json({
      success: true,
      message: '결재선이 생성되었습니다.',
      approvalLine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '결재선 생성 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 결재선 조회
const getAllApprovalLines = async (req, res) => {
  try {
    const approvalLines = await ApprovalLine.find({ isActive: true })
      .populate('approvers.approverId', 'name position')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: approvalLines.length,
      approvalLines
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '결재선 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 특정 결재선 조회
const getApprovalLineById = async (req, res) => {
  try {
    const approvalLine = await ApprovalLine.findById(req.params.id)
      .populate('approvers.approverId', 'name position');

    if (!approvalLine) {
      return res.status(404).json({
        success: false,
        message: '결재선을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      approvalLine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '결재선 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 결재선 수정
const updateApprovalLine = async (req, res) => {
  try {
    const { name, description, approvers } = req.body;

    const approvalLine = await ApprovalLine.findById(req.params.id);
    if (!approvalLine) {
      return res.status(404).json({
        success: false,
        message: '결재선을 찾을 수 없습니다.'
      });
    }

    if (name) approvalLine.name = name;
    if (description) approvalLine.description = description;

    if (approvers && approvers.length > 0) {
      const processedApprovers = [];
      for (const approver of approvers) {
        const user = await User.findById(approver.approverId);
        if (!user) {
          return res.status(400).json({
            success: false,
            message: `사용자를 찾을 수 없습니다.`
          });
        }

        processedApprovers.push({
          order: approver.order,
          approverId: user._id,
          approverName: user.name,
          approverPosition: user.position
        });
      }

      processedApprovers.sort((a, b) => a.order - b.order);
      approvalLine.approvers = processedApprovers;
    }

    approvalLine.updatedAt = new Date();
    await approvalLine.save();

    res.json({
      success: true,
      message: '결재선이 수정되었습니다.',
      approvalLine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '결재선 수정 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 결재선 삭제
const deleteApprovalLine = async (req, res) => {
  try {
    const approvalLine = await ApprovalLine.findById(req.params.id);
    if (!approvalLine) {
      return res.status(404).json({
        success: false,
        message: '결재선을 찾을 수 없습니다.'
      });
    }

    approvalLine.isActive = false;
    await approvalLine.save();

    res.json({
      success: true,
      message: '결재선이 삭제되었습니다.'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '결재선 삭제 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

module.exports = {
  createApprovalLine,
  getAllApprovalLines,
  getApprovalLineById,
  updateApprovalLine,
  deleteApprovalLine
};
