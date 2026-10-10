import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CdAcademyLogo } from './CdAcademyLogo';
import { LogOut, User as UserIcon, Shield, Bell, Check, ChevronDown, Sparkles, Smartphone, Download, CheckCheck } from 'lucide-react';
import { ClassLevel, ActiveTab, NotificationItem } from '../../types';
import { ApkDownloadModal } from './ApkDownloadModal';
import { StorageService } from '../../services/storage';

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
  const { user, selectedClass, setSelectedClass, logout, isAdmin, requestNotificationPermission } = useAuth();
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  // Relevant notifications for current user
  const relevantNotifications = notifications.filter(n => {
    if (!n.isActive) return false;
    if (isAdmin) return true;
    if (n.targetType === 'all') return true;
    if (n.targetType === 'class' && n.targetClass === selectedClass) return true;
    if (n.targetType === 'student' && n.targetStudentId === user?.id) return true;
    return true;
  });

  const unreadCount = relevantNotifications.filter(
    n => user?.id && !(n.readBy || []).includes(user.id)
  ).length;

  const handleMarkAllRead = () => {
    if (user?.id) {
      markAllNotificationsAsRead(user.id);
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (user?.id) {
      markNotificationAsRead(notif.notificationId, user.id);
    }
    if (notif.actionTab && onNavigateTab) {
      onNavigateTab(notif.actionTab);
      setShowNotifications(false);
    }
  };

  const handleEnablePush = async () => {
    await requestNotificationPermission();
    setShowPermissionPrompt(false);
  };

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
          {/* Install APK Button */}
          <button
            onClick={() => setShowApkModal(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-red-600 text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs transition"
            title="Download & Install Android APK"
          >
            <Smartphone className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Install APK</span>
            <span className="sm:hidden text-[11px]">APK</span>
          </button>

          {/* Admin shortcut if admin */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg shadow-xs transition"
              title="Open Admin Panel"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden text-[11px]">Admin</span>
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-20 animate-in fade-in max-w-[92vw]">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount} Unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 transition"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Push Permission Prompt if not granted */}
                  {user?.notificationPermission !== 'granted' && (
                    <div className="mt-2.5 p-2.5 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl text-xs flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-700">
                        <span className="font-bold text-red-700 block">Enable Live Alerts 🔔</span>
                        <span>Receive lecture, DPP & test updates</span>
                      </div>
                      <button
                        onClick={handleEnablePush}
                        className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition shadow-2xs"
                      >
                        Enable
                      </button>
                    </div>
                  )}

                  {/* List */}
                  <div className="divide-y divide-slate-100 mt-2 max-h-72 overflow-y-auto">
                    {relevantNotifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No notifications yet
                      </div>
                    ) : (
                      relevantNotifications.map(n => {
                        const isRead = user?.id && (n.readBy || []).includes(user.id);
                        return (
                          <div
                            key={n.notificationId}
                            onClick={() => handleNotificationClick(n)}
                            className={`py-2.5 px-2 text-xs rounded-xl transition cursor-pointer ${
                              isRead ? 'hover:bg-slate-50 opacity-80' : 'bg-red-50/40 hover:bg-red-50/70 font-semibold'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <p className="font-bold text-slate-900 leading-snug">{n.title}</p>
                              {!isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                              <span>{new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              {n.actionTab && <span className="text-red-600 font-bold">Open →</span>}
                            </div>
                          </div>
                        );
                      })
                    )}
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

      {/* Android APK Download & Installation Modal */}
      <ApkDownloadModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />
    </header>
  );
};
