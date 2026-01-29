import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: JWT 토큰 자동 주입
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
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
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료시 쿠키 삭제
      Cookies.remove('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 API
export const authAPI = {
  login: (username: string, password: string) =>
    apiClient.post('/auth/login', { username, password }),
  registerUser: (data: any) =>
    apiClient.post('/auth/register', data),
  getAllUsers: () =>
    apiClient.get('/auth/users'),
  getUserById: (id: string) =>
    apiClient.get(`/auth/users/${id}`),
  updateUser: (id: string, data: any) =>
    apiClient.put(`/auth/users/${id}`, data),
  deleteUser: (id: string) =>
    apiClient.delete(`/auth/users/${id}`),
};

// 출석 API
export const attendanceAPI = {
  checkGeofencing: (lat: number, lon: number) =>
    apiClient.post('/attendance/geofencing', { latitude: lat, longitude: lon }),
  checkIn: (lat: number, lon: number) =>
    apiClient.post('/attendance/checkin', { latitude: lat, longitude: lon }),
  checkOut: () =>
    apiClient.post('/attendance/checkout'),
  getTodayAttendance: () =>
    apiClient.get('/attendance/today'),
  getAttendanceStatistics: () =>
    apiClient.get('/attendance/statistics'),
};

// 지출 API
export const expenditureAPI = {
  createExpenditure: (data: any) =>
    apiClient.post('/expenditure', data),
  getAllExpenditures: () =>
    apiClient.get('/expenditure'),
  getExpenditureById: (id: string) =>
    apiClient.get(`/expenditure/${id}`),
  updateExpenditure: (id: string, data: any) =>
    apiClient.put(`/expenditure/${id}`, data),
  deleteExpenditure: (id: string) =>
    apiClient.delete(`/expenditure/${id}`),
  approveExpenditure: (id: string, comment?: string) =>
    apiClient.put(`/expenditure/${id}/approve`, { comment }),
  rejectExpenditure: (id: string, comment?: string) =>
    apiClient.put(`/expenditure/${id}/reject`, { comment }),
};

// 결재선 API
export const approvalLineAPI = {
  createApprovalLine: (data: any) =>
    apiClient.post('/approval-lines', data),
  getAllApprovalLines: () =>
    apiClient.get('/approval-lines'),
  getApprovalLineById: (id: string) =>
    apiClient.get(`/approval-lines/${id}`),
  updateApprovalLine: (id: string, data: any) =>
    apiClient.put(`/approval-lines/${id}`, data),
  deleteApprovalLine: (id: string) =>
    apiClient.delete(`/approval-lines/${id}`),
};

// 일반 API 객체
export const api = apiClient;

export default apiClient;
