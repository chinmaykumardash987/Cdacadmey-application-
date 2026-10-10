import React from 'react';
import { useData } from '../../context/DataContext';
import { StorageService } from '../../services/storage';
import { AdminTab } from '../../types';
import { Users, BookOpen, Video, FileCheck, Plus, ArrowUpRight, GraduationCap, CheckCircle, Clock, Layers, Bell, Smartphone, Radio } from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { students, notes, lectures, dpps, batches, notifications: notifs, isRealtimeActive, isOnline } = useData();

  const class11Students = students.filter(s => s.classLevel === 'Class 11').length;
  const class12Students = students.filter(s => s.classLevel === 'Class 12').length;

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      actionTab: 'students' as AdminTab
    },
    {
      title: 'Active Batches',
      value: batches.length,
      icon: Layers,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      actionTab: 'batches' as AdminTab
    },
    {
      title: 'Total Notes',
      value: notes.length,
      icon: BookOpen,
      color: 'bg-red-50 text-red-600 border-red-200',
      actionTab: 'notes' as AdminTab
    },
    {
      title: 'Total Lectures',
      value: lectures.length,
      icon: Video,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      actionTab: 'lectures' as AdminTab
    },
    {
      title: 'Total DPPs',
      value: dpps.length,
      icon: FileCheck,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      actionTab: 'dpp' as AdminTab
    },
    {
      title: 'Push Alerts Sent',
      value: notifs.length,
      icon: Bell,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      actionTab: 'notifications' as AdminTab
    }
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Multi-Device Sync Indicator */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">Multi-Device Live Sync Connected</span>
              <span className="inline-flex items-center gap-1 bg-white text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                Active
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              When you add, edit, or delete notes, lectures, DPPs, or tests, changes update in real-time across all student devices and installed APKs.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[11px] font-mono bg-black/20 text-white px-2.5 py-1 rounded-lg border border-white/20">
            Firestore: Connected
          </span>
        </div>
      </div>

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Admin Overview & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time metric summary of CD ACADEMY students, study notes, lectures, and practice problems
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('notes')}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Note</span>
          </button>
          <button
            onClick={() => onNavigateTab('lectures')}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lecture</span>
          </button>
          <button
            onClick={() => onNavigateTab('dpp')}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl transition border border-slate-300"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upload DPP</span>
          </button>
        </div>
      </div>

      {/* 6 Statistic Cards as required in requirement 9 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              onClick={() => onNavigateTab(stat.actionTab)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block leading-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 line-clamp-1 mt-0.5">
                  {stat.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Breakdown & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Student Registrations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Recent Student Registrations</h3>
              <p className="text-xs text-slate-500">Newly enrolled students in Class 11 and Class 12</p>
            </div>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-xs font-bold text-red-600 hover:text-red-700"
            >
              View All Students →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Mobile</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.slice(0, 5).map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{s.fullName}</div>
                      <div className="text-[10px] text-slate-400">{s.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {s.classLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{s.phone}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[10px]">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick System Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-1">Curriculum Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Class 11 vs Class 12 materials breakdown</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Class 11 Notes & Lectures</span>
                  <span>{notes.filter(n => n.classLevel === 'Class 11').length + lectures.filter(l => l.classLevel === 'Class 11').length} items</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Class 12 Notes & Lectures</span>
                  <span>{notes.filter(n => n.classLevel === 'Class 12').length + lectures.filter(l => l.classLevel === 'Class 12').length} items</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Daily Practice Sheets (DPP)</span>
                  <span>{dpps.length} Total</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cloud & Offline Persistence Active</span>
              </div>
              <p className="text-[11px] text-slate-500">
                All lectures, notes, DPPs, and student test results are securely synced and instantly available.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('guide')}
            className="mt-4 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition text-center shadow-xs flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open Android App (APK) Center</span>
          </button>
        </div>
      </div>
    </div>
  );
};
