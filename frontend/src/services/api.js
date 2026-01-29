import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://church-two-pi.vercel.app';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// 인증 API
export const authAPI = {
  login: (username, password) =>
    apiClient.post('/auth/login', { username, password }),
  
  registerUser: (userData) =>
    apiClient.post('/auth/register', userData),
  
  getAllUsers: () =>
    apiClient.get('/auth'),
  
  getUserById: (userId) =>
    apiClient.get(`/auth/${userId}`),
  
  updateUser: (userId, userData) =>
    apiClient.put(`/auth/${userId}`, userData),
  
  deleteUser: (userId) =>
    apiClient.delete(`/auth/${userId}`)
};

// 출석 API
export const attendanceAPI = {
  checkGeofencing: (latitude, longitude) =>
    apiClient.post('/attendance/geofencing', { latitude, longitude }),
  
  checkIn: (latitude, longitude) =>
    apiClient.post('/attendance/check-in', { latitude, longitude }),
  
  checkOut: () =>
    apiClient.post('/attendance/check-out', {}),
  
  getTodayAttendance: () =>
    apiClient.get('/attendance/today'),
  
  getAttendanceStatistics: (startDate, endDate) =>
    apiClient.get('/attendance/statistics', {
      params: { startDate, endDate }
    })
};

// 결재선 API
export const approvalLineAPI = {
  createApprovalLine: (data) =>
    apiClient.post('/approval-lines', data),
  
  getAllApprovalLines: () =>
    apiClient.get('/approval-lines'),
  
  getApprovalLineById: (id) =>
    apiClient.get(`/approval-lines/${id}`),
  
  updateApprovalLine: (id, data) =>
    apiClient.put(`/approval-lines/${id}`, data),
  
  deleteApprovalLine: (id) =>
    apiClient.delete(`/approval-lines/${id}`)
};

// 지출 API
export const expenditureAPI = {
  createExpenditure: (data) =>
    apiClient.post('/expenditure', data),
  
  getAllExpenditures: () =>
    apiClient.get('/expenditure'),
  
  getExpenditureById: (id) =>
    apiClient.get(`/expenditure/${id}`),
  
  updateExpenditure: (id, data) =>
    apiClient.put(`/expenditure/${id}`, data),
  
  deleteExpenditure: (id) =>
    apiClient.delete(`/expenditure/${id}`),
  
  approveExpenditure: (id, comment) =>
    apiClient.post(`/expenditure/${id}/approve`, { comment }),
  
  rejectExpenditure: (id, reason) =>
    apiClient.post(`/expenditure/${id}/reject`, { reason })
};

// 일반 API 호출 함수
export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config)
};

export default apiClient;
