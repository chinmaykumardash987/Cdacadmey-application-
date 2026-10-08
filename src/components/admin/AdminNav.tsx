import React from 'react';
import { CdAcademyLogo } from '../common/CdAcademyLogo';
import { useAuth } from '../../context/AuthContext';
import { AdminTab } from '../../types';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  FileCheck,
  Settings,
  BookMarked,
  LogOut,
  ExternalLink,
  ChevronRight,
  Smartphone,
  Layers,
  HelpCircle,
  Bell
} from 'lucide-react';

interface AdminNavProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onSwitchToStudentView: () => void;
}

export const AdminNav: React.FC<AdminNavProps> = ({
  activeTab,
  onTabChange,
  onSwitchToStudentView
}) => {
  const { user, logout } = useAuth();

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'batches', label: 'Batches', icon: Layers },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'lectures', label: 'Lectures', icon: Video },
    { id: 'dpp', label: 'DPP', icon: FileCheck },
    { id: 'tests', label: 'Test Series', icon: HelpCircle },
    { id: 'notifications', label: 'Push Notifications', icon: Bell },
    { id: 'guide', label: 'Download App (APK)', icon: Smartphone },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <CdAcademyLogo
          variant="badge"
          size="xs"
          showTagline={false}
          className="border-neutral-800"
        />
        <span className="text-[10px] font-extrabold uppercase bg-red-600/90 text-white px-2 py-0.5 rounded tracking-wider">
          Admin
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-1">
          Management
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 py-1">
            Quick Actions
          </div>
          <button
            onClick={onSwitchToStudentView}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <ExternalLink className="w-4 h-4 text-red-500" />
            <span>Open Student View</span>
          </button>
        </div>
      </nav>

      {/* Admin Profile & Logout Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Administrator'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@cdacademy.com'}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
