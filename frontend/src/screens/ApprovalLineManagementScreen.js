import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { approvalLineAPI, authAPI } from '../services/api';

export const ApprovalLineManagementScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [approvalLines, setApprovalLines] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // 초기 로드
  useEffect(() => {
    loadApprovalLines();
    loadUsers();
  }, []);

  const loadApprovalLines = async () => {
    try {
      setLoading(true);
      const response = await approvalLineAPI.getAllApprovalLines();
      setApprovalLines(response.data.approvalLines || []);
    } catch (error) {
      console.error('결재선 로드 오류:', error);
      Alert.alert('오류', '결재선을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      // 승인 권한이 있는 사용자만 필터링
      const approvers = response.data.users.filter(u => 
        u.permissions?.canApproveExpenditure || u.permissions?.canFinalApprove
      );
      setUsers(approvers);
    } catch (error) {
      console.error('사용자 로드 오류:', error);
    }
  };

  const handleAddUser = (userId) => {
    if (!selectedUsers.find(u => u === userId)) {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u !== userId));
  };

  const handleCreateApprovalLine = async () => {
    if (!formData.name || selectedUsers.length === 0) {
      Alert.alert('입력 오류', '결재선명과 최소 1명의 결재자가 필요합니다.');
      return;
    }

    try {
      setLoading(true);
      
      // 선택된 사용자를 순서대로 배열로 변환
      const approvers = selectedUsers.map((userId, index) => ({
        approverId: userId,
        order: index + 1
      }));

      const response = await approvalLineAPI.createApprovalLine({
        name: formData.name,
        description: formData.description,
        approvers
      });

      if (response.data.success) {
        Alert.alert('성공', '결재선이 생성되었습니다.');
        setFormData({ name: '', description: '' });
        setSelectedUsers([]);
        setModalVisible(false);
        loadApprovalLines();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || '결재선 생성 실패';
      Alert.alert('오류', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApprovalLine = async (id) => {
    Alert.alert('삭제 확인', '이 결재선을 삭제하시겠습니까?', [
      { text: '취소', onPress: () => {} },
      {
        text: '삭제',
        onPress: async () => {
          try {
            setLoading(true);
            await approvalLineAPI.deleteApprovalLine(id);
            Alert.alert('성공', '결재선이 삭제되었습니다.');
            loadApprovalLines();
          } catch (error) {
            Alert.alert('오류', '결재선 삭제 실패');
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  const renderApprovalLineItem = ({ item }) => (
    <View style={styles.approvalLineItem}>
      <View style={styles.approvalLineHeader}>
        <Text style={styles.approvalLineName}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteApprovalLine(item._id)}
          disabled={loading}
        >
          <Text style={styles.deleteButton}>🗑</Text>
        </TouchableOpacity>
      </View>
      
      {item.description && (
        <Text style={styles.approvalLineDesc}>{item.description}</Text>
      )}

      <View style={styles.approversList}>
        {item.approvers.map((approver, index) => (
          <View key={approver._id} style={styles.approverItem}>
            <Text style={styles.approverOrder}>{index + 1}단계</Text>
            <Text style={styles.approverName}>{approver.approverName}</Text>
            <Text style={styles.approverPosition}>({approver.approverPosition})</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderUserSelector = ({ item }) => {
    const isSelected = selectedUsers.includes(item._id);
    
    return (
      <TouchableOpacity
        style={[
          styles.userItem,
          isSelected && styles.userItemSelected
        ]}
        onPress={() => 
          isSelected
            ? handleRemoveUser(item._id)
            : handleAddUser(item._id)
        }
      >
        <View style={styles.userItemContent}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userPosition}>{item.position}</Text>
        </View>
        <View style={[
          styles.checkbox,
          isSelected && styles.checkboxSelected
        ]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 돌아가기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>결재선 관리</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* 생성 버튼 */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>+ 새 결재선 생성</Text>
        </TouchableOpacity>

        {/* 결재선 목록 */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>등록된 결재선</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
          ) : approvalLines.length > 0 ? (
            <FlatList
              data={approvalLines}
              renderItem={renderApprovalLineItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <Text style={styles.emptyText}>등록된 결재선이 없습니다.</Text>
          )}
        </View>
      </ScrollView>

      {/* 결재선 생성 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>결재선 생성</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* 결재선명 입력 */}
            <View style={styles.formSection}>
              <Text style={styles.label}>결재선명 *</Text>
              <TextInput
                style={styles.input}
                placeholder="예: 기본 지출 결재선"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                editable={!loading}
              />
            </View>

            {/* 설명 입력 */}
            <View style={styles.formSection}>
              <Text style={styles.label}>설명</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="이 결재선의 목적을 설명하세요"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
                editable={!loading}
              />
            </View>

            {/* 결재자 선택 */}
            <View style={styles.formSection}>
              <Text style={styles.label}>결재자 선택 (순서대로) *</Text>
              <Text style={styles.helperText}>
                선택 순서가 결재 순서가 됩니다 (1 → 2 → 3)
              </Text>

              {selectedUsers.length > 0 && (
                <View style={styles.selectedList}>
                  <Text style={styles.selectedListTitle}>선택된 결재자:</Text>
                  {selectedUsers.map((userId, index) => {
                    const user = users.find(u => u._id === userId);
                    return (
                      <View key={userId} style={styles.selectedItem}>
                        <Text style={styles.selectedItemText}>
                          {index + 1}. {user?.name} ({user?.position})
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              <FlatList
                data={users}
                renderItem={renderUserSelector}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
              />
            </View>

            {/* 생성 버튼 */}
            <View style={styles.formSection}>
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleCreateApprovalLine}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>결재선 생성</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  backButton: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  listSection: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  loader: {
    marginVertical: 24
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 24
  },
  approvalLineItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 0
  },
  approvalLineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  approvalLineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  deleteButton: {
    fontSize: 20,
    paddingHorizontal: 8
  },
  approvalLineDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic'
  },
  approversList: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTopVertical: 12
  },
  approverItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3'
  },
  approverOrder: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold'
  },
  approverName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  approverPosition: {
    fontSize: 12,
    color: '#666'
  },
  separator: {
    height: 8,
    backgroundColor: 'transparent'
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic'
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
  descriptionInput: {
    textAlignVertical: 'top'
  },
  selectedList: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12
  },
  selectedListTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8
  },
  selectedItem: {
    paddingVertical: 6
  },
  selectedItemText: {
    fontSize: 13,
    color: '#1976D2',
    fontWeight: '500'
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  userItemSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3'
  },
  userItemContent: {
    flex: 1
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  userPosition: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3'
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
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
