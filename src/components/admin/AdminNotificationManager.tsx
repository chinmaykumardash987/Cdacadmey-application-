import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { NotificationItem, Batch } from '../../types';
import { Bell, Send, Sparkles, Check, Users, BookOpen, Video, FileCheck, Award, MessageSquare } from 'lucide-react';

export const AdminNotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const batches = StorageService.getBatches();
  const students = StorageService.getStudents();

  // Notification Composer Form
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'class' | 'batch' | 'student'>('all');
  const [targetClass, setTargetClass] = useState('Class 12');
  const [targetBatch, setTargetBatch] = useState(batches[0]?.batchName || 'UDAAN 1.0');
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [actionTab, setActionTab] = useState<'dashboard' | 'notes' | 'lectures' | 'dpp' | 'tests'>('dashboard');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Preset templates
  const applyTemplate = (type: 'lecture' | 'notes' | 'dpp' | 'test' | 'announcement') => {
    switch (type) {
      case 'lecture':
        setTitle('New Lecture Available 🎥');
        setMessage('Your new Physics lecture is now available. Start learning now.');
        setActionTab('lectures');
        break;
      case 'notes':
        setTitle('New Notes Uploaded 📚');
        setMessage('New Class 12 Physics notes are now available.');
        setActionTab('notes');
        break;
      case 'dpp':
        setTitle("Today's DPP is Live 📝");
        setMessage("Practice today's DPP and improve your preparation.");
        setActionTab('dpp');
        break;
      case 'test':
        setTitle('New Test Available 🏆');
        setMessage('Your new test is now available. Test your preparation.');
        setActionTab('tests');
        break;
      case 'announcement':
        setTitle('Important Academy Notice 📢');
        setMessage('Please review the revised weekly class and doubt clearing session schedule.');
        setActionTab('dashboard');
        break;
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setSending(true);
    const newNotif = StorageService.addNotification({
      title: title.trim(),
      message: message.trim(),
      targetType,
      targetClass: targetType === 'class' ? targetClass : undefined,
      targetBatch: targetType === 'batch' ? targetBatch : undefined,
      targetStudentId: targetType === 'student' ? targetStudentId : undefined,
      actionTab
    });

    setNotifications([newNotif, ...notifications]);
    setSending(false);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);

    // Reset inputs
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>FCM Push Notification Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Push Notification & Alert Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast in-app and APK push alerts to all students, specific batches, classes, or individual learners
          </p>
        </div>
      </div>

      {/* Preset Quick Templates */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
          1-Click Quick Notification Templates:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => applyTemplate('lecture')}
            className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition flex flex-col gap-1 text-xs"
          >
            <Video className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-blue-900">New Lecture</span>
            <span className="text-[10px] text-blue-700">Lecture alert</span>
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('notes')}
            className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-left transition flex flex-col gap-1 text-xs"
          >
            <BookOpen className="w-4 h-4 text-rose-600" />
            <span className="font-bold text-rose-900">New Notes</span>
            <span className="text-[10px] text-rose-700">PDF release</span>
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('dpp')}
            className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition flex flex-col gap-1 text-xs"
          >
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-emerald-900">Daily DPP</span>
            <span className="text-[10px] text-emerald-700">Practice live</span>
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('test')}
            className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition flex flex-col gap-1 text-xs"
          >
            <Award className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-purple-900">New Test</span>
            <span className="text-[10px] text-purple-700">CBT Mock</span>
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('announcement')}
            className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition flex flex-col gap-1 text-xs"
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-amber-900">Notice</span>
            <span className="text-[10px] text-amber-700">Custom alert</span>
          </button>
        </div>
      </div>

      {/* Composer Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-red-600" />
          <span>Compose & Dispatch Notification</span>
        </h2>

        {sentSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Notification successfully dispatched to targeted audience!</span>
          </div>
        )}

        <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notification Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. New Lecture Available 🎥"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notification Message Body *
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              placeholder="Enter student push notification body..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              required
            />
          </div>

          {/* Audience Targeting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Target Audience *
              </label>
              <select
                value={targetType}
                onChange={e => setTargetType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-800"
              >
                <option value="all">All Students (Entire Academy)</option>
                <option value="class">Specific Class (e.g. Class 12)</option>
                <option value="batch">Specific Batch</option>
                <option value="student">Individual Student</option>
              </select>
            </div>

            {targetType === 'class' && (
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Select Class
                </label>
                <select
                  value={targetClass}
                  onChange={e => setTargetClass(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-800"
                >
                  <option value="Class 12">Class 12</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                </select>
              </div>
            )}

            {targetType === 'batch' && (
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Select Batch
                </label>
                <select
                  value={targetBatch}
                  onChange={e => setTargetBatch(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-800"
                >
                  {batches.map(b => (
                    <option key={b.batchId} value={b.batchName}>{b.batchName}</option>
                  ))}
                </select>
              </div>
            )}

            {targetType === 'student' && (
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Select Student
                </label>
                <select
                  value={targetStudentId}
                  onChange={e => setTargetStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-800"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.email})</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                On-Tap Action (Deep Link Destination)
              </label>
              <select
                value={actionTab}
                onChange={e => setActionTab(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs text-slate-800"
              >
                <option value="dashboard">Student Dashboard</option>
                <option value="lectures">Video Lectures Page</option>
                <option value="notes">Study Notes Page</option>
                <option value="dpp">Daily Practice Problems (DPP)</option>
                <option value="tests">Mock CBT Tests Series</option>
              </select>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-red-600/20"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Dispatching...' : 'Dispatch Push Notification Now'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dispatched History */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3">Recent Dispatched Alerts</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {notifications.map(n => (
            <div key={n.notificationId} className="py-3 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{n.title}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase">
                    Audience: {n.targetType} {n.targetClass ? `(${n.targetClass})` : ''}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">
                {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
