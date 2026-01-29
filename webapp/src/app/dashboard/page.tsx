'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/Card';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isSignedIn, logout, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    if (!isSignedIn && !user) {
      router.push('/login');
    }
  }, [isSignedIn, user, router, initializeAuth]);

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
        {/* 환영 섹션 */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
          <div>
            <h1 className="text-3xl font-bold mb-2">반갑습니다, {user.username}님!</h1>
            <p className="text-blue-100">
              스마트 교회 행정 시스템에 접속했습니다. 오늘의 활동을 시작하세요.
            </p>
          </div>
        </Card>

        {/* 빠른 메뉴 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/attendance">
            <Card className="h-32 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">📍</div>
              <h3 className="font-bold text-lg">출석</h3>
              <p className="text-sm text-gray-600">출석 관리</p>
            </Card>
          </Link>

          <Link href="/dashboard/expenditure">
            <Card className="h-32 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="font-bold text-lg">지출</h3>
              <p className="text-sm text-gray-600">지출 결의</p>
            </Card>
          </Link>

          {user.role === 'admin' && (
            <Link href="/dashboard/approval">
              <Card className="h-32 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">🔏</div>
                <h3 className="font-bold text-lg">결재</h3>
                <p className="text-sm text-gray-600">결재 관리</p>
              </Card>
            </Link>
          )}

          <Link href="/dashboard/settings">
            <Card className="h-32 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-2">⚙️</div>
              <h3 className="font-bold text-lg">설정</h3>
              <p className="text-sm text-gray-600">계정 설정</p>
            </Card>
          </Link>
        </div>

        {/* 오늘의 현황 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-bold text-lg mb-4 text-gray-900">출석 현황</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">-</div>
            <p className="text-sm text-gray-600">아직 출석하지 않음</p>
          </Card>

          <Card>
            <h3 className="font-bold text-lg mb-4 text-gray-900">대기 중인 지출</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">-</div>
            <p className="text-sm text-gray-600">결재 대기 중인 항목</p>
          </Card>

          <Card>
            <h3 className="font-bold text-lg mb-4 text-gray-900">권한</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {user.role === 'admin' ? '관리자' : '사용자'}
            </div>
            <p className="text-sm text-gray-600">{user.department || '부서 없음'}</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
