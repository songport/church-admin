# 지출결의 및 결재 기능 구현 가이드

## 📋 개요

이 문서는 AI-OCR 기반 지출결의서 및 전자결재 워크플로우를 구현하는 방법을 설명합니다.

## 🏗️ 시스템 아키텍처

```
┌─────────────┐
│  교인(작성자) │ ← 영수증 촬영/업로드
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│  AI-OCR 처리         │
│  (Google Vision API) │
└──────┬───────────────┘
       │ 자동 데이터 추출
       ▼
┌──────────────────────┐
│  결의서 자동 생성    │
│  (항목, 금액, 날짜) │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  부장 1차 승인       │
│  (1단계 검토)        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  목사 최종 승인      │
│  (최종 승인)         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  재정 DB 반영        │
│  (통계 업데이트)     │
└──────────────────────┘
```

## 🔧 구현 단계

### 1. 지출결의 모델 생성

이미 생성된 `backend/src/models/Expenditure.js` 참고

### 2. Google Vision API 설정

#### 2-1. Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 방문
2. 새 프로젝트 생성
3. Vision API 활성화
4. 서비스 계정 키 생성
5. JSON 키 파일 다운로드

#### 2-2. 환경 변수 설정

`.env`에 추가:
```env
GOOGLE_VISION_API_KEY=your_google_vision_api_key
GOOGLE_PROJECT_ID=your_project_id
```

### 3. 지출결의 컨트롤러 구현

`backend/src/controllers/expenditureController.js` 생성:

```javascript
const Expenditure = require('../models/Expenditure');
const ApprovalLine = require('../models/ApprovalLine');
const vision = require('@google-cloud/vision');

// Google Vision 클라이언트
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_VISION_KEY_FILE
});

// 영수증 OCR 처리
const processReceiptOCR = async (imagePath) => {
  try {
    const request = {
      image: { source: { filename: imagePath } }
    };

    const [result] = await client.documentTextDetection(request);
    const fullTextAnnotation = result.fullTextAnnotation;
    const text = fullTextAnnotation.text;

    // 추출된 텍스트에서 항목, 금액, 날짜 추출
    const ocrData = parseReceiptText(text);
    return ocrData;

  } catch (error) {
    console.error('OCR 처리 오류:', error);
    throw error;
  }
};

// 텍스트에서 항목 및 금액 추출
const parseReceiptText = (text) => {
  // 정규표현식으로 금액 패턴 찾기
  const amountPattern = /(\d+,?\d*)/g;
  const amounts = text.match(amountPattern) || [];
  
  // 날짜 패턴 찾기
  const datePattern = /(\d{4})-(\d{2})-(\d{2})/;
  const dateMatch = text.match(datePattern);

  return {
    items: [
      { item: '상품/서비스', amount: amounts[0] ? parseInt(amounts[0].replace(/,/g, '')) : 0 }
    ],
    totalAmount: amounts[0] ? parseInt(amounts[0].replace(/,/g, '')) : 0,
    receiptDate: dateMatch ? new Date(dateMatch[0]) : new Date(),
    vendor: '영수증 업체명' // 추가 처리 필요
  };
};

// 지출결의서 작성
const createExpenditure = async (req, res) => {
  try {
    const { title, description, amount, category, expenditureDate, ocrData } = req.body;
    const userId = req.user._id;

    const expenditure = new Expenditure({
      submittedBy: userId,
      submitterName: req.user.name,
      submitterPosition: req.user.position,
      title,
      description,
      amount,
      category,
      expenditureDate,
      ocrData,
      approvalStatus: '작성중'
    });

    await expenditure.save();

    res.status(201).json({
      success: true,
      message: '지출결의서가 작성되었습니다.',
      expenditure
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '지출결의서 작성 실패',
      error: error.message
    });
  }
};

// 지출결의서 제출
const submitExpenditure = async (req, res) => {
  try {
    const { expenditureId, approvalLineId } = req.body;

    const expenditure = await Expenditure.findById(expenditureId);
    if (!expenditure) {
      return res.status(404).json({
        success: false,
        message: '지출결의서를 찾을 수 없습니다.'
      });
    }

    // 결재선 조회
    const approvalLine = await ApprovalLine.findById(approvalLineId);
    if (!approvalLine) {
      return res.status(404).json({
        success: false,
        message: '결재선을 찾을 수 없습니다.'
      });
    }

    // 결재자 정보 입력
    expenditure.approvalLine = approvalLine.approvers.map(approver => ({
      approverId: approver.approverId,
      approverName: approver.approverName,
      approverPosition: approver.approverPosition,
      status: '대기'
    }));

    expenditure.approvalStatus = '제출';
    expenditure.submittedAt = new Date();

    await expenditure.save();

    // 첫번째 결재자에게 알림 (푸시 알림 구현)
    await sendPushNotification(
      approvalLine.approvers[0].approverId,
      '새로운 지출결의서 승인 대기',
      `${expenditure.submitterName}이 지출 ${expenditure.amount}원을 결의했습니다.`
    );

    res.json({
      success: true,
      message: '지출결의서가 제출되었습니다.',
      expenditure
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '제출 실패',
      error: error.message
    });
  }
};

// 지출결의서 승인
const approveExpenditure = async (req, res) => {
  try {
    const { expenditureId, approverPosition } = req.body;
    const approverId = req.user._id;

    const expenditure = await Expenditure.findById(expenditureId);
    if (!expenditure) {
      return res.status(404).json({
        success: false,
        message: '지출결의서를 찾을 수 없습니다.'
      });
    }

    // 현재 결재자 찾기
    const approverIndex = expenditure.approvalLine.findIndex(
      app => app.approverId.toString() === approverId.toString()
    );

    if (approverIndex === -1) {
      return res.status(403).json({
        success: false,
        message: '승인 권한이 없습니다.'
      });
    }

    // 현재 결재자의 상태만 승인으로 변경
    expenditure.approvalLine[approverIndex].status = '승인';
    expenditure.approvalLine[approverIndex].approvedAt = new Date();

    // 모든 결재가 완료되었는지 확인
    const allApproved = expenditure.approvalLine.every(app => app.status === '승인');

    if (allApproved) {
      expenditure.approvalStatus = '승인됨';
    } else {
      expenditure.approvalStatus = '진행중';
      // 다음 결재자에게 알림
      const nextApprover = expenditure.approvalLine[approverIndex + 1];
      if (nextApprover) {
        await sendPushNotification(
          nextApprover.approverId,
          '지출결의서 승인 대기',
          `${expenditure.submitterName}이 ${expenditure.amount}원을 결의했습니다.`
        );
      }
    }

    await expenditure.save();

    res.json({
      success: true,
      message: '지출결의서가 승인되었습니다.',
      expenditure
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '승인 실패',
      error: error.message
    });
  }
};

// 지출결의서 반려
const rejectExpenditure = async (req, res) => {
  try {
    const { expenditureId, rejectionReason } = req.body;
    const approverId = req.user._id;

    const expenditure = await Expenditure.findById(expenditureId);
    if (!expenditure) {
      return res.status(404).json({
        success: false,
        message: '지출결의서를 찾을 수 없습니다.'
      });
    }

    // 현재 결재자 찾기
    const approverIndex = expenditure.approvalLine.findIndex(
      app => app.approverId.toString() === approverId.toString()
    );

    if (approverIndex === -1) {
      return res.status(403).json({
        success: false,
        message: '반려 권한이 없습니다.'
      });
    }

    // 결의서 반려 처리
    expenditure.approvalLine[approverIndex].status = '반려';
    expenditure.approvalLine[approverIndex].rejectionReason = rejectionReason;
    expenditure.approvalStatus = '반려됨';

    await expenditure.save();

    // 작성자에게 반려 알림
    await sendPushNotification(
      expenditure.submittedBy,
      '지출결의서 반려',
      `사유: ${rejectionReason}`
    );

    res.json({
      success: true,
      message: '지출결의서가 반려되었습니다.',
      expenditure
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '반려 실패',
      error: error.message
    });
  }
};

// 지출 통계 조회
const getExpenditureStatistics = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    const query = {
      approvalStatus: '승인됨',
      expenditureDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    if (category) {
      query.category = category;
    }

    const statistics = await Expenditure.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$expenditureDate' } },
            category: '$category'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    const totalAmount = statistics.reduce((sum, stat) => sum + stat.totalAmount, 0);

    res.json({
      success: true,
      startDate,
      endDate,
      totalAmount,
      count: statistics.length,
      statistics
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '통계 조회 실패',
      error: error.message
    });
  }
};

module.exports = {
  processReceiptOCR,
  createExpenditure,
  submitExpenditure,
  approveExpenditure,
  rejectExpenditure,
  getExpenditureStatistics
};
```

### 4. 지출결의 라우트 추가

`backend/src/routes/expenditureRoutes.js` 생성:

```javascript
const express = require('express');
const router = express.Router();
const expenditureController = require('../controllers/expenditureController');
const { authenticateToken, requireApprovalPermission } = require('../middleware/auth');

// 지출결의서 작성
router.post('/', authenticateToken, expenditureController.createExpenditure);

// 지출결의서 제출
router.post('/:id/submit', authenticateToken, expenditureController.submitExpenditure);

// 지출결의서 승인
router.post('/:id/approve', authenticateToken, requireApprovalPermission, expenditureController.approveExpenditure);

// 지출결의서 반려
router.post('/:id/reject', authenticateToken, requireApprovalPermission, expenditureController.rejectExpenditure);

// 지출 통계
router.get('/statistics', authenticateToken, expenditureController.getExpenditureStatistics);

module.exports = router;
```

### 5. 프론트엔드 지출결의 화면

`frontend/src/screens/ExpenditureScreen.js` 생성:

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Picker,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { expenditureAPI } from '../services/api';

export const ExpenditureScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '식비',
    expenditureDate: new Date().toISOString().split('T')[0]
  });

  const [receiptImage, setReceiptImage] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 영수증 촬영/업로드
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });

      if (!result.cancelled) {
        setReceiptImage(result.uri);
        // OCR 처리 (선택사항)
        await processOCR(result.uri);
      }
    } catch (error) {
      Alert.alert('오류', '이미지 선택 실패');
    }
  };

  // OCR 처리
  const processOCR = async (imageUri) => {
    try {
      setLoading(true);
      // API 호출로 OCR 처리
      // const response = await expenditureAPI.processOCR(imageUri);
      // setOcrData(response.data.ocrData);
    } catch (error) {
      Alert.alert('오류', 'OCR 처리 실패');
    } finally {
      setLoading(false);
    }
  };

  // 지출결의서 제출
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await expenditureAPI.createExpenditure({
        ...formData,
        amount: parseInt(formData.amount),
        ocrData
      });

      if (response.data.success) {
        Alert.alert('성공', '지출결의서가 작성되었습니다.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('오류', '제출 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 영수증 사진 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>영수증 촬영</Text>
          
          {receiptImage ? (
            <Image source={{ uri: receiptImage }} style={styles.receiptImage} />
          ) : (
            <TouchableOpacity style={styles.imagePickerButton} onPress={handlePickImage}>
              <Text style={styles.imagePickerText}>📸 사진 촬영/업로드</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* OCR 데이터 표시 */}
        {ocrData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>인식된 정보</Text>
            <Text>금액: {ocrData.totalAmount}원</Text>
            <Text>날짜: {new Date(ocrData.receiptDate).toLocaleDateString('ko-KR')}</Text>
          </View>
        )}

        {/* 기본 정보 입력 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지출 정보</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.input}
              placeholder="지출 내용"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>금액 *</Text>
            <TextInput
              style={styles.input}
              placeholder="금액 입력"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>분류</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <Picker.Item label="식비" value="식비" />
                <Picker.Item label="교재비" value="교재비" />
                <Picker.Item label="시설비" value="시설비" />
                <Picker.Item label="선교비" value="선교비" />
                <Picker.Item label="기타" value="기타" />
              </Picker>
            </View>
          </View>
        </View>

        {/* 제출 버튼 */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading || !formData.title || !formData.amount}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>상신하기</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { padding: 16 },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  receiptImage: { width: '100%', height: 300, borderRadius: 8, marginBottom: 12 },
  imagePickerButton: {
    backgroundColor: '#E3F2FD',
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed'
  },
  imagePickerText: { fontSize: 16, color: '#2196F3', fontWeight: '600' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10 },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, overflow: 'hidden' },
  submitButton: { backgroundColor: '#2196F3', paddingVertical: 14, borderRadius: 6, alignItems: 'center' },
  disabledButton: { opacity: 0.6 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
```

## 📊 지출 통계 화면

추후 구현할 내용:
- 월별 지출 그래프
- 카테고리별 분석
- 기간별 합계
- 결재 상태 모니터링

---

**다음 단계**: 지출 통계 및 리포팅 기능 구현

**마지막 업데이트**: 2026년 1월 28일
