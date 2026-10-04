import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CdAcademyLogo } from './CdAcademyLogo';
import { LogOut, User as UserIcon, Shield, Bell, Check, ChevronDown, Sparkles } from 'lucide-react';
import { ClassLevel, ActiveTab } from '../../types';

interface HeaderProps {
  activeTab?: ActiveTab;
  onNavigateTab?: (tab: ActiveTab) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'dashboard',
  onNavigateTab,
  onOpenAdmin
}) => {
  const { user, selectedClass, setSelectedClass, logout, isAdmin } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const notifications = [
    { id: 1, title: 'New DPP uploaded for Physics Chapter 3', time: '10 min ago' },
    { id: 2, title: 'Class 12 Chemistry Organic notes published', time: '2 hours ago' },
    { id: 3, title: 'Welcome to CD ACADEMY! - Har Bachha Padhega', time: 'Yesterday' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <CdAcademyLogo
            variant="inline"
            size="sm"
            onClick={() => onNavigateTab && onNavigateTab('dashboard')}
          />
        </div>

        {/* Center / Class Selector for Student */}
        {!isAdmin && (
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full border border-slate-300 transition"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span>{selectedClass}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              </button>

              {showClassDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowClassDropdown(false)}
                  />
                  <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-36 z-20 animate-in fade-in zoom-in-95">
                    <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                      Switch Class
                    </div>
                    {(['Class 11', 'Class 12'] as ClassLevel[]).map(cls => (
                      <button
                        key={cls}
                        onClick={() => {
                          setSelectedClass(cls);
                          setShowClassDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-red-50 hover:text-red-700 transition ${
                          selectedClass === cls ? 'text-red-600 font-bold bg-red-50/60' : 'text-slate-700'
                        }`}
                      >
                        <span>{cls}</span>
                        {selectedClass === cls && <Check className="w-3.5 h-3.5 text-red-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin shortcut if admin */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="hidden sm:inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-20 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900">Notifications</span>
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                      3 New
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 mt-1 max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="py-2 px-1 text-xs hover:bg-slate-50 rounded-lg transition">
                        <p className="font-medium text-slate-800">{n.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Chip */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
            <button
              onClick={() => onNavigateTab && onNavigateTab('profile')}
              className="flex items-center gap-2 hover:opacity-80 transition text-left"
              title="View Profile"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.fullName || 'Student'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isAdmin ? 'Administrator' : selectedClass}
                </div>
              </div>
            </button>

            {/* Logout button */}
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition ml-0.5"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
