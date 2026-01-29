// ApprovalScreen.jsx - 결재 관리 화면 (관리자)
// 경로: frontend/src/screens/ApprovalScreen.jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  Text,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { PrimaryButton, DangerButton } from '../components/Button';

export const ApprovalScreen = ({ navigation }) => {
  const [approvals, setApprovals] = useState([]);
  const [filteredApprovals, setFilteredApprovals] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');

  const filters = ['전체', '대기', '승인', '반려'];

  useEffect(() => {
    fetchApprovals();
  }, []);

  useEffect(() => {
    filterApprovals();
  }, [selectedFilter, approvals]);

  const fetchApprovals = async () => {
    try {
      const response = await api.get('/expenditure/approval/list');
      setApprovals(response.data.data || []);
    } catch (error) {
      console.error('결재 목록 조회 오류:', error);
    }
  };

  const filterApprovals = () => {
    let filtered = approvals;

    switch (selectedFilter) {
      case '대기':
        filtered = approvals.filter((a) => a.status === 'pending');
        break;
      case '승인':
        filtered = approvals.filter((a) => a.status === 'approved');
        break;
      case '반려':
        filtered = approvals.filter((a) => a.status === 'rejected');
        break;
      default:
        filtered = approvals;
    }

    // 긴급 항목을 상단으로 정렬
    filtered.sort((a, b) => {
      if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
      if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredApprovals(filtered);
  };

  const handleApprove = async () => {
    if (!selectedApproval) return;

    try {
      const response = await api.post(`/expenditure/${selectedApproval._id}/approve`, {
        comment: approvalNote
      });

      if (response.data.success) {
        alert('승인되었습니다.');
        setModalVisible(false);
        setApprovalNote('');
        setSelectedApproval(null);
        fetchApprovals();
      }
    } catch (error) {
      console.error('승인 오류:', error);
      alert('승인 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async () => {
    if (!selectedApproval || !approvalNote) {
      alert('반려 사유를 입력하세요.');
      return;
    }

    try {
      const response = await api.post(`/expenditure/${selectedApproval._id}/reject`, {
        reason: approvalNote
      });

      if (response.data.success) {
        alert('반려되었습니다.');
        setModalVisible(false);
        setApprovalNote('');
        setSelectedApproval(null);
        fetchApprovals();
      }
    } catch (error) {
      console.error('반려 오류:', error);
      alert('반려 중 오류가 발생했습니다.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return '✅ 승인 완료';
      case 'pending':
        return '🟡 검토 대기';
      case 'rejected':
        return '🔴 반려됨';
      default:
        return '⚫ 대기 중';
    }
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'urgent') {
      return <Text style={styles.urgentBadge}>🔴 긴급</Text>;
    }
    return null;
  };

  const getApprovalProgressLabel = (stage, totalStages) => {
    return `${stage}단계/${totalStages}단계`;
  };

  const renderApprovalItem = ({ item }) => (
    <Card
      style={styles.approvalCard}
      onPress={() => {
        setSelectedApproval(item);
        setModalVisible(true);
      }}
    >
      <Card.Content>
        {/* 헤더: 우선순위와 상태 */}
        <View style={styles.approvalHeader}>
          <View style={styles.approvalTitle}>
            {getPriorityBadge(item.priority)}
            <Text style={styles.approvalTitleText}>{item.title}</Text>
          </View>
          <Text
            style={[
              styles.approvalStatus,
              { color: getStatusColor(item.status) }
            ]}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>

        {/* 신청자 정보 */}
        <View style={styles.approvalInfo}>
          <Text style={styles.approvalInfoText}>
            신청자: <Text style={styles.infoValue}>{item.submittedBy?.name}</Text>
          </Text>
          <Text style={styles.approvalInfoText}>
            금액: <Text style={styles.infoValue}>₩{item.amount.toLocaleString()}</Text>
          </Text>
        </View>

        {/* 결재선 진행 상황 */}
        <View style={styles.approvalSteps}>
          {item.approvalLine?.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View
                style={[
                  styles.stepIndicator,
                  index < (item.currentApprovalStep || 0)
                    ? styles.stepCompleted
                    : index === (item.currentApprovalStep || 0)
                    ? styles.stepInProgress
                    : styles.stepPending
                ]}
              >
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.stepLabel}>{step.position}</Text>
            </View>
          ))}
        </View>

        {/* 하단: 진행 상황과 버튼 */}
        <View style={styles.approvalFooter}>
          <View>
            <Text style={styles.progressLabel}>
              {getApprovalProgressLabel(
                item.currentApprovalStep + 1,
                item.approvalLine?.length || 1
              )}
            </Text>
            <Text style={styles.dateLabel}>
              신청: {new Date(item.createdAt).toLocaleDateString('ko-KR')}
            </Text>
          </View>
          {item.status === 'pending' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setSelectedApproval(item);
                setModalVisible(true);
              }}
            >
              <Text style={styles.actionButtonText}>검토</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const isEmpty = filteredApprovals.length === 0;

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>결재 관리</Text>
          <Text style={styles.subtitle}>
            총 {filteredApprovals.length}건
          </Text>
        </View>

        {/* 필터 탭 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map((filter) => (
            <Chip
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive
              ]}
              textStyle={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              {filter}
            </Chip>
          ))}
        </ScrollView>

        {/* 결재 목록 */}
        <FlatList
          data={filteredApprovals}
          renderItem={renderApprovalItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>
                {selectedFilter === '대기' ? '대기 중인 결재가 없습니다.' : '결재 항목이 없습니다.'}
              </Text>
            </View>
          }
        />

        {/* 결재 상세 모달 */}
        <Portal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              setSelectedApproval(null);
              setApprovalNote('');
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {selectedApproval && (
                  <ScrollView>
                    {/* 모달 헤더 */}
                    <View style={styles.modalHeader}>
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible(false);
                          setSelectedApproval(null);
                          setApprovalNote('');
                        }}
                      >
                        <Text style={styles.closeButton}>✕</Text>
                      </TouchableOpacity>
                      <Text style={styles.modalTitle}>지출 결의서</Text>
                      <View style={{ width: 30 }} />
                    </View>

                    {/* 상태 섹션 */}
                    <View style={styles.statusSection}>
                      <View style={styles.statusBadgeContainer}>
                        <Text
                          style={[
                            styles.statusBadge,
                            {
                              color: getStatusColor(selectedApproval.status),
                              backgroundColor:
                                getStatusColor(selectedApproval.status) + '20'
                            }
                          ]}
                        >
                          {getStatusLabel(selectedApproval.status)}
                        </Text>
                      </View>

                      {/* 결재선 진행 */}
                      <View style={styles.approvalLineContainer}>
                        {selectedApproval.approvalLine?.map((step, index) => (
                          <View key={index} style={styles.lineStepContainer}>
                            <View
                              style={[
                                styles.lineStepCircle,
                                index < (selectedApproval.currentApprovalStep || 0)
                                  ? styles.lineStepCompleted
                                  : index === (selectedApproval.currentApprovalStep || 0)
                                  ? styles.lineStepInProgress
                                  : styles.lineStepPending
                              ]}
                            >
                              <Text style={styles.lineStepNumber}>{index + 1}</Text>
                            </View>
                            <Text style={styles.lineStepLabel}>{step.position}</Text>
                            {index < (selectedApproval.approvalLine?.length || 0) - 1 && (
                              <View style={styles.lineArrow}>→</View>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* 기본 정보 */}
                    <View style={styles.infoSection}>
                      <Text style={styles.sectionTitle}>기본 정보</Text>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>신청자:</Text>
                        <Text style={styles.infoValue}>
                          {selectedApproval.submittedBy?.name}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>제목:</Text>
                        <Text style={styles.infoValue}>{selectedApproval.title}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>금액:</Text>
                        <Text style={styles.infoValue}>
                          ₩{selectedApproval.amount.toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>카테고리:</Text>
                        <Text style={styles.infoValue}>{selectedApproval.category}</Text>
                      </View>
                    </View>

                    {/* 설명 */}
                    <View style={styles.infoSection}>
                      <Text style={styles.sectionTitle}>설명</Text>
                      <Text style={styles.descriptionText}>
                        {selectedApproval.description}
                      </Text>
                    </View>

                    {/* 결재 의견 (대기 중일 때만 표시) */}
                    {selectedApproval.status === 'pending' && (
                      <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>결재 의견</Text>
                        <View style={styles.noteInputContainer}>
                          <TextInput
                            style={styles.noteInput}
                            placeholder="승인 의견 또는 반려 사유를 입력하세요."
                            multiline={true}
                            numberOfLines={4}
                            value={approvalNote}
                            onChangeText={setApprovalNote}
                          />
                        </View>
                      </View>
                    )}

                    {/* 액션 버튼 */}
                    {selectedApproval.status === 'pending' && (
                      <View style={styles.actionButtonContainer}>
                        <Button
                          mode="outlined"
                          onPress={handleReject}
                          style={styles.rejectButton}
                          buttonColor="#EF4444"
                        >
                          👎 반려
                        </Button>
                        <Button
                          mode="contained"
                          onPress={handleApprove}
                          style={styles.approveButton}
                          buttonColor="#10B981"
                        >
                          👍 승인
                        </Button>
                      </View>
                    )}
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: '#F3F4F6'
  },
  filterChipActive: {
    backgroundColor: '#2563EB'
  },
  filterChipText: {
    color: '#6B7280'
  },
  filterChipTextActive: {
    color: '#FFFFFF'
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  approvalCard: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  },
  approvalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  approvalTitle: {
    flex: 1,
    marginRight: 12
  },
  approvalTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4
  },
  urgentBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4
  },
  approvalStatus: {
    fontSize: 12,
    fontWeight: '600'
  },
  approvalInfo: {
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  approvalInfoText: {
    fontSize: 13,
    color: '#6B7280',
    marginVertical: 3
  },
  infoValue: {
    fontWeight: '600',
    color: '#1F2937'
  },
  approvalSteps: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8
  },
  stepContainer: {
    alignItems: 'center'
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2
  },
  stepCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981'
  },
  stepInProgress: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B'
  },
  stepPending: {
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB'
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  stepLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center'
  },
  approvalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937'
  },
  dateLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#2563EB',
    borderRadius: 6
  },
  actionButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  statusSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  statusBadgeContainer: {
    marginBottom: 12
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'flex-start'
  },
  approvalLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  lineStepContainer: {
    alignItems: 'center'
  },
  lineStepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 2
  },
  lineStepCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981'
  },
  lineStepInProgress: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B'
  },
  lineStepPending: {
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB'
  },
  lineStepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  lineStepLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center'
  },
  lineArrow: {
    fontSize: 16,
    color: '#D1D5DB',
    marginHorizontal: 4
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280'
  },
  descriptionText: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20
  },
  noteInputContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden'
  },
  noteInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
    textAlignVertical: 'top'
  },
  actionButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  approveButton: {
    flex: 1
  },
  rejectButton: {
    flex: 1
  }
});

export { ApprovalScreen };
