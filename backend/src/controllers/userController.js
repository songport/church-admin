const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { validationResult } = require('express-validator');

// 로그인
const login = async (req, res) => {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;

    // 사용자 조회
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: '사용자명 또는 비밀번호가 잘못되었습니다.' 
      });
    }

    // 비밀번호 확인
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: '사용자명 또는 비밀번호가 잘못되었습니다.' 
      });
    }

    // 활성 사용자 확인
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false,
        message: '비활성 계정입니다.' 
      });
    }

    // 토큰 생성
    const token = generateToken(user._id);

    // 리프레시 토큰 저장 (선택사항)
    const refreshToken = generateToken(user._id, '7d');
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      message: '로그인 성공',
      token,
      refreshToken,
      user: user.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '로그인 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 회원가입 (관리자 전용)
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      username,
      password,
      name,
      email,
      phone,
      position,
      region,
      department,
      canSubmitExpenditure
    } = req.body;

    // 사용자 존재 여부 확인
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 사용자명입니다.'
      });
    }

    // 새 사용자 생성
    const newUser = new User({
      username,
      password,
      name,
      email,
      phone,
      position,
      region: position !== '목사' && position !== '관리자' ? region : null,
      department: position !== '목사' && position !== '관리자' ? department : null,
      canSubmitExpenditure: canSubmitExpenditure !== undefined ? canSubmitExpenditure : true,
      isActive: true
    });

    // 직분에 따른 권한 설정
    if (position === '부장' || position === '권사') {
      newUser.permissions.canApproveExpenditure = true;
    }
    if (position === '목사' || position === '담임목사') {
      newUser.permissions.canFinalApprove = true;
    }
    if (position === '관리자') {
      newUser.permissions.isAdmin = true;
      newUser.permissions.canFinalApprove = true;
    }

    await newUser.save();

    res.status(201).json({
      success: true,
      message: '사용자가 등록되었습니다.',
      user: newUser.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '회원가입 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 사용자 조회 (관리자 전용)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '사용자 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 특정 사용자 조회
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '사용자 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 사용자 수정 (관리자 전용)
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, position, region, department, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    // 업데이트할 필드
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (position) user.position = position;
    if (region) user.region = region;
    if (department) user.department = department;
    if (isActive !== undefined) user.isActive = isActive;

    // 직분 변경시 권한 재설정
    if (position) {
      user.permissions = {
        canApproveExpenditure: position === '부장' || position === '권사',
        canFinalApprove: position === '목사' || position === '담임목사',
        isAdmin: position === '관리자'
      };
    }

    await user.save();

    res.json({
      success: true,
      message: '사용자가 수정되었습니다.',
      user: user.toJSON()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '사용자 수정 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 사용자 삭제 (관리자 전용)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    // 물리적 삭제 대신 비활성화
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: '사용자가 삭제되었습니다.'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '사용자 삭제 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

module.exports = {
  login,
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
