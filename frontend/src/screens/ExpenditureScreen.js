import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  FlatList,
  Text,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { PrimaryButton, SecondaryButton, DangerButton } from '../components/Button';

export const ExpenditureScreen = ({ navigation }) => {
  const [expenditures, setExpenditures] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '기타',
    description: ''
  });

  useEffect(() => {
    fetchExpenditures();
  }, []);

  const fetchExpenditures = async () => {
    try {
      const response = await api.get('/expenditure');
      setExpenditures(response.data.data || []);
    } catch (error) {
      console.error('지출 조회 오류:', error);
    }
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('카메라 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.amount) {
      alert('필수 항목을 입력하세요.');
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('amount', formData.amount);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);

      if (selectedImage) {
        const filename = selectedImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        submitData.append('receipt', {
          uri: selectedImage,
          name: filename,
          type
        });
      }

      const response = await api.post('/expenditure', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('지출 결의서가 제출되었습니다.');
        setModalVisible(false);
        setFormData({ title: '', amount: '', category: '기타', description: '' });
        setSelectedImage(null);
        fetchExpenditures();
      }
    } catch (error) {
      console.error('제출 오류:', error);
      alert('제출 중 오류가 발생했습니다.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '승인':
        return '#10B981';
      case '결재 대기':
        return '#F59E0B';
      case '반려':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return '✅ 승인됨';
      case 'pending':
        return '🟡 결재 대기';
      case 'rejected':
        return '🔴 반려됨';
      default:
        return '⚫ 대기 중';
    }
  };

  const renderExpenditureItem = ({ item }) => (
    <Card
      style={styles.expenditureCard}
      onPress={() => navigation.navigate('ExpenditureDetail', { id: item._id })}
    >
      <Card.Content>
        <View style={styles.expenditureHeader}>
          <View style={styles.expenditureInfo}>
            <Text style={styles.expenditureTitle}>📄 {item.title}</Text>
            <Text style={styles.expenditureCategory}>{item.category}</Text>
          </View>
          <Text style={styles.expenditureAmount}>₩{item.amount.toLocaleString()}</Text>
        </View>

        <View style={styles.expenditureFooter}>
          <View>
            <Text
              style={[
                styles.expenditureStatus,
                { color: getStatusColor(item.status) }
              ]}
            >
              {getStatusLabel(item.status)}
            </Text>
            <Text style={styles.expenditureDate}>
              {new Date(item.createdAt).toLocaleDateString('ko-KR')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('ExpenditureDetail', { id: item._id })}
          >
            <Text style={styles.viewButtonText}>상세보기 →</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>지출 결의</Text>
          <Text style={styles.subtitle}>
            작성: {expenditures.filter(e => e.status === 'draft').length}건 | 
            대기: {expenditures.filter(e => e.status === 'pending').length}건
          </Text>
        </View>

        <FlatList
          data={expenditures}
          renderItem={renderExpenditureItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>지출 결의가 없습니다.</Text>
            </View>
          }
        />

        {/* 새 결의서 작성 버튼 */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
          label="새 결의서"
        />

        {/* 새 지출 결의서 모달 */}
        <Portal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalCloseButton}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>새 지출 결의서</Text>
                  <View style={{ width: 30 }} />
                </View>

                <ScrollView style={styles.modalForm}>
                  {/* 제목 */}
                  <Text style={styles.label}>제목 *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="예: 교육용품 구매"
                    value={formData.title}
                    onChangeText={(text) =>
                      setFormData({ ...formData, title: text })
                    }
                  />

                  {/* 금액 */}
                  <Text style={styles.label}>금액 *</Text>
                  <View style={styles.amountInputContainer}>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="0"
                      keyboardType="numeric"
                      value={formData.amount}
                      onChangeText={(text) =>
                        setFormData({ ...formData, amount: text })
                      }
                    />
                    <Text style={styles.currencyLabel}>₩</Text>
                  </View>

                  {/* 카테고리 */}
                  <Text style={styles.label}>카테고리</Text>
                  <View style={styles.categorySelect}>
                    {['교육', '물품 구매', '유지보수', '인테리어', '기타'].map(
                      (cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.categoryButton,
                            formData.category === cat && styles.categoryButtonActive
                          ]}
                          onPress={() => setFormData({ ...formData, category: cat })}
                        >
                          <Text
                            style={[
                              styles.categoryButtonText,
                              formData.category === cat &&
                                styles.categoryButtonTextActive
                            ]}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>

                  {/* 설명 */}
                  <Text style={styles.label}>설명</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="지출 사유를 입력하세요."
                    multiline={true}
                    numberOfLines={4}
                    value={formData.description}
                    onChangeText={(text) =>
                      setFormData({ ...formData, description: text })
                    }
                  />

                  {/* 영수증 */}
                  <Text style={styles.label}>영수증 *</Text>
                  {selectedImage ? (
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: selectedImage }}
                        style={styles.selectedImage}
                      />
                      <TouchableOpacity
                        style={styles.changeImageButton}
                        onPress={() => setSelectedImage(null)}
                      >
                        <Text style={styles.changeImageText}>변경</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.imagePickerContainer}>
                      <Button
                        mode="outlined"
                        icon="camera"
                        onPress={handleTakePhoto}
                        style={styles.imageButton}
                      >
                        사진 촬영
                      </Button>
                      <Button
                        mode="outlined"
                        icon="folder"
                        onPress={handleSelectImage}
                        style={styles.imageButton}
                      >
                        파일 선택
                      </Button>
                    </View>
                  )}

                  {/* 버튼 */}
                  <View style={styles.modalButtonContainer}>
                    <Button
                      mode="outlined"
                      onPress={() => setModalVisible(false)}
                      style={styles.modalButton}
                    >
                      취소
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleSubmit}
                      style={styles.modalButton}
                    >
                      제출
                    </Button>
                  </View>
                </ScrollView>
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
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  expenditureCard: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  },
  expenditureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  expenditureInfo: {
    flex: 1
  },
  expenditureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4
  },
  expenditureCategory: {
    fontSize: 12,
    color: '#6B7280'
  },
  expenditureAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB'
  },
  expenditureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  expenditureStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  expenditureDate: {
    fontSize: 12,
    color: '#6B7280'
  },
  viewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6
  },
  viewButtonText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600'
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280'
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2563EB'
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
  modalCloseButton: {
    fontSize: 24,
    color: '#6B7280'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  modalForm: {
    padding: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937'
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 10
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937'
  },
  currencyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12
  },
  categorySelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB'
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB'
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#6B7280'
  },
  categoryButtonTextActive: {
    color: '#FFFFFF'
  },
  imagePickerContainer: {
    flexDirection: 'row',
    gap: 12
  },
  imageButton: {
    flex: 1
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8
  },
  changeImageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2563EB',
    borderRadius: 6,
    alignItems: 'center'
  },
  changeImageText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20
  },
  modalButton: {
    flex: 1
  }
});

export { ExpenditureScreen };
