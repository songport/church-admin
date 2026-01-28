import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Picker,
  Alert,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';

const POSITIONS = ['교인', '집사', '권사', '장로', '심방장', '전도사', '목사'];
const REGIONS = ['양천', '송파', '강남', '강동', '강북', '기타'];
const DEPARTMENTS = ['8남전도회', '5여전도회', '청년회', '기타'];
const CATEGORIES = ['식비', '교재비', '시설비', '선교비', '기타'];

export const AdminRegisterScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 회원가입 폼 상태
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    region: '',
    department: '',
    canSubmitExpenditure: true
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.name || !formData.position) {
      Alert.alert('입력 오류', '필수 항목을 입력해주세요.');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('입력 오류', '비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }

    if (formData.position !== '목사' && formData.position !== '관리자') {
      if (!formData.region || !formData.department) {
        Alert.alert('입력 오류', '구역과 소속을 선택해주세요.');
        return false;
      }
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await authAPI.registerUser(formData);

      if (response.data.success) {
        Alert.alert('가입 완료', `${formData.name} 사용자가 등록되었습니다.`);
        setFormData({
          username: '',
          password: '',
          name: '',
          email: '',
          phone: '',
          position: '',
          region: '',
          department: '',
          canSubmitExpenditure: true
        });
        setModalVisible(false);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || '회원가입 실패';
      Alert.alert('오류', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', onPress: () => {} },
      {
        text: '확인',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>관리자</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 관리 메뉴 */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>관리 기능</Text>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.menuButtonText}>👥 회원 등록</Text>
            <Text style={styles.menuButtonDesc}>새로운 사용자를 등록합니다</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('ApprovalLineManagement')}
          >
            <Text style={styles.menuButtonText}>📋 결재선 관리</Text>
            <Text style={styles.menuButtonDesc}>결재 라인을 설정합니다</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <Text style={styles.menuButtonText}>👤 사용자 관리</Text>
            <Text style={styles.menuButtonDesc}>사용자 정보를 관리합니다</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('FinancialReport')}
          >
            <Text style={styles.menuButtonText}>💰 재정 현황</Text>
            <Text style={styles.menuButtonDesc}>지출 내역을 조회합니다</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 회원 등록 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>새 사용자 등록</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* 기본 정보 */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>기본 정보</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>사용자명 *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="사용자명"
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  editable={!loading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>비밀번호 *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호 (최소 6자)"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>이름 *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="이름"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  editable={!loading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>이메일</Text>
                <TextInput
                  style={styles.input}
                  placeholder="이메일"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>연락처</Text>
                <TextInput
                  style={styles.input}
                  placeholder="연락처"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
            </View>

            {/* 직분 및 소속 */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>직분 및 소속</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>직분 *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.position}
                    onValueChange={(value) => handleInputChange('position', value)}
                    enabled={!loading}
                  >
                    <Picker.Item label="직분 선택" value="" />
                    {POSITIONS.map((pos) => (
                      <Picker.Item key={pos} label={pos} value={pos} />
                    ))}
                  </Picker>
                </View>
              </View>

              {formData.position !== '목사' && formData.position !== '관리자' && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>구역</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={formData.region}
                        onValueChange={(value) => handleInputChange('region', value)}
                        enabled={!loading}
                      >
                        <Picker.Item label="구역 선택" value="" />
                        {REGIONS.map((region) => (
                          <Picker.Item key={region} label={region} value={region} />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>소속</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={formData.department}
                        onValueChange={(value) => handleInputChange('department', value)}
                        enabled={!loading}
                      >
                        <Picker.Item label="소속 선택" value="" />
                        {DEPARTMENTS.map((dept) => (
                          <Picker.Item key={dept} label={dept} value={dept} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* 권한 설정 */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>권한 설정</Text>
              <View style={styles.permissionItem}>
                <Text style={styles.permissionLabel}>지출 결의 가능</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.canSubmitExpenditure ? 'yes' : 'no'}
                    onValueChange={(value) => 
                      handleInputChange('canSubmitExpenditure', value === 'yes')
                    }
                    enabled={!loading}
                  >
                    <Picker.Item label="가능" value="yes" />
                    <Picker.Item label="불가" value="no" />
                  </Picker>
                </View>
              </View>
            </View>

            {/* 제출 버튼 */}
            <View style={styles.formSection}>
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>등록하기</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8
  },
  greeting: {
    fontSize: 14,
    color: '#666'
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f44336'
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  menuContainer: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  menuButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  menuButtonDesc: {
    fontSize: 12,
    color: '#999'
  },
  // 모달 스타일
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  modalContent: {
    flex: 1,
    padding: 16
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 32,
    color: '#999'
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fafafa'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#fafafa',
    overflow: 'hidden'
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  permissionLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center'
  },
  disabledButton: {
    opacity: 0.6
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
