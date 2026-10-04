import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { CdAcademyLogo } from '../common/CdAcademyLogo';
import { User, Mail, Phone, GraduationCap, Shield, Download, LogOut, CheckCircle2, Smartphone, BookOpen, Video, FileCheck } from 'lucide-react';
import { ClassLevel } from '../../types';

export const StudentProfile: React.FC = () => {
  const { user, selectedClass, setSelectedClass, logout, isAdmin } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const notesCount = StorageService.getNotes().filter(n => n.classLevel === selectedClass).length;
  const lecturesCount = StorageService.getLectures().filter(l => l.classLevel === selectedClass).length;
  const dppCount = StorageService.getDPPs().filter(d => d.classLevel === selectedClass).length;

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

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-md border-4 border-white ring-2 ring-red-500/20">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {user?.fullName || 'Student Name'}
              </h1>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Student
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Registered Student • Enrolled in {user?.classLevel || selectedClass}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span className="truncate">{user?.email || 'student@cdacademy.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>{user?.phone || '+91 98765 43210'}</span>
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
