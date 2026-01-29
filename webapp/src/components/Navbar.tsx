import React from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const defaultNavItems: NavItem[] = [
  { label: '홈', href: '/dashboard' },
  { label: '출석', href: '/dashboard/attendance' },
  { label: '지출', href: '/dashboard/expenditure' },
  { label: '결재', href: '/dashboard/approval' },
  { label: '설정', href: '/dashboard/settings' },
];

interface NavbarProps {
  items?: NavItem[];
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  items = defaultNavItems,
  onLogout,
}) => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-bold text-lg">
              ✝️ 교회 행정
            </Link>
            <div className="hidden md:flex gap-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
