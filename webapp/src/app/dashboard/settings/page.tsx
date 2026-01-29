'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">설정</h1>

        {/* 사용자 정보 */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">👤 프로필</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">사용자명</p>
              <p className="text-lg font-medium text-gray-900">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">이메일</p>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">권한</p>
              <p className="text-lg font-medium text-gray-900">
                {user.role === 'admin' ? '관리자' : '일반 사용자'}
              </p>
            </div>
            {user.department && (
              <div>
                <p className="text-sm text-gray-600">부서</p>
                <p className="text-lg font-medium text-gray-900">{user.department}</p>
              </div>
            )}
          </div>
        </Card>

        {/* 보안 설정 */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">🔐 보안</h2>
          <div className="space-y-4">
            <Button variant="secondary" className="w-full">
              비밀번호 변경
            </Button>
            <Button variant="secondary" className="w-full">
              생체인증 설정
            </Button>
          </div>
        </Card>

        {/* 알림 설정 */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">🔔 알림</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-900">결재 알림</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900">출석 리마인더</span>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900">이메일 알림</span>
              <input type="checkbox" className="w-4 h-4" />
            </div>
          </div>
        </Card>

        {/* 앱 정보 */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">ℹ️ 앱 정보</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">버전</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">빌드</span>
              <span className="font-medium">2026.01.29</span>
            </div>
          </div>
        </Card>

        {/* 로그아웃 */}
        <Button
          variant="danger"
          size="lg"
          onClick={handleLogout}
          className="w-full"
        >
          로그아웃
        </Button>
      </main>
    </div>
  );
}
