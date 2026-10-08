import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { FirestoreDataService } from '../../services/firestoreData';
import { CdAcademyLogo } from '../common/CdAcademyLogo';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Shield,
  Download,
  LogOut,
  CheckCircle2,
  Smartphone,
  BookOpen,
  Video,
  FileCheck,
  Bell,
  Award,
  IdCard,
  Edit2,
  Check,
  Save,
  X
} from 'lucide-react';
import { ClassLevel, TestResultItem } from '../../types';

export const StudentProfile: React.FC = () => {
  const { user, selectedClass, setSelectedClass, logout, isAdmin, requestNotificationPermission, updateProfile } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editBoard, setEditBoard] = useState(user?.board || 'CBSE Board');
  const [editRoll, setEditRoll] = useState(user?.rollNumber || 'CD-1001');
  const [saving, setSaving] = useState(false);

  const notesCount = StorageService.getNotes().filter(n => n.classLevel === selectedClass).length;
  const lecturesCount = StorageService.getLectures().filter(l => l.classLevel === selectedClass).length;
  const dppCount = StorageService.getDPPs().filter(d => d.classLevel === selectedClass).length;

  useEffect(() => {
    if (user?.id) {
      FirestoreDataService.getStudentTestResults(user.id).then(setTestResults);
    }
  }, [user]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      alert('To install CD ACADEMY on your Android phone, tap the browser menu (⋮) and tap "Install app" or "Add to Home screen"!');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      fullName: editName.trim(),
      name: editName.trim(),
      phone: editPhone.trim(),
      board: editBoard.trim(),
      rollNumber: editRoll.trim()
    });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-md border-4 border-white ring-2 ring-red-500/20 shrink-0">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
                {user?.fullName || 'Student Name'}
              </h1>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Student
              </span>
              <button
                onClick={() => {
                  setEditName(user?.fullName || '');
                  setEditPhone(user?.phone || '');
                  setEditBoard(user?.board || 'CBSE Board');
                  setEditRoll(user?.rollNumber || 'CD-1001');
                  setEditing(true);
                }}
                className="text-slate-400 hover:text-red-600 transition p-1"
                title="Edit Profile"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Enrolled in {user?.classLevel || selectedClass} • {user?.board || 'CBSE Board'} • Roll: <strong className="text-slate-700">{user?.rollNumber || 'CD-1001'}</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span className="truncate">{user?.email || 'student@cdacademy.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>{user?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate col-span-1 sm:col-span-2">
                <IdCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">UID: {user?.id?.slice(0, 18) || 'std-guest'}...</span>
                <span className="text-slate-300">|</span>
                <span>Created: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Statistics */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
          <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
            <BookOpen className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <span className="text-lg font-black text-slate-900 block">{notesCount}</span>
            <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
              {selectedClass} Notes
            </span>
          </div>
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
            <Video className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <span className="text-lg font-black text-slate-900 block">{lecturesCount}</span>
            <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
              {selectedClass} Lectures
            </span>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <FileCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-lg font-black text-slate-900 block">{dppCount}</span>
            <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
              {selectedClass} DPPs
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Edit Student Profile</h3>
              <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Board</label>
                  <select
                    value={editBoard}
                    onChange={e => setEditBoard(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="CBSE Board">CBSE Board</option>
                    <option value="CHSE Odisha">CHSE Odisha</option>
                    <option value="State Board">State Board</option>
                    <option value="ICSE / ISC">ICSE / ISC</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Roll / Student ID</label>
                  <input
                    type="text"
                    value={editRoll}
                    onChange={e => setEditRoll(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Push Notification Controls Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Push Notifications & Live Alerts</h4>
            <p className="text-[11px] text-slate-500">
              Status: <span className="font-bold text-emerald-600 capitalize">{user?.notificationPermission || 'Default'}</span> • Real-time notifications for lectures, notes and tests
            </p>
          </div>
        </div>
        <button
          onClick={requestNotificationPermission}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition shrink-0"
        >
          {user?.notificationPermission === 'granted' ? 'Alerts Active ✓' : 'Enable Alerts'}
        </button>
      </div>

      {/* Class Level Preference */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-red-600" />
          <span>Active Learning Class</span>
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Switch between Class 11 and Class 12 anytime to review concepts or prepare ahead.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {(['Class 11', 'Class 12'] as ClassLevel[]).map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                selectedClass === cls
                  ? 'border-red-600 bg-red-50 text-red-700 shadow-2xs ring-1 ring-red-500/20'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{cls}</span>
              {selectedClass === cls && (
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Install as Android App Card */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Install CD ACADEMY Mobile App</h4>
            <p className="text-xs text-red-100 mt-0.5">
              Add CD ACADEMY to your phone's home screen for fast 1-tap offline-ready access.
            </p>
          </div>
        </div>
        <button
          onClick={handleInstallApp}
          className="bg-white text-red-700 hover:bg-slate-100 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs whitespace-nowrap self-stretch sm:self-auto"
        >
          {isInstallable ? 'Install Android App' : 'Add to Home Screen'}
        </button>
      </div>

      {/* Brand & Mission Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center text-center">
        <CdAcademyLogo variant="badge" size="sm" className="mb-2" />
        <p className="text-xs text-slate-500 max-w-md mt-1">
          CD ACADEMY is dedicated to empowering students of Class 11 and Class 12 with crystal clear fundamentals, quality notes, and guided lectures.
        </p>
        <p className="text-xs font-bold text-red-600 tracking-wider uppercase mt-2">
          "Har Bachha Padhega"
        </p>

        <div className="mt-5 w-full pt-4 border-t border-slate-100 flex justify-center">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
