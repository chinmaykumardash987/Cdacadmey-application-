import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CdAcademyLogo } from '../common/CdAcademyLogo';
import { Settings, Shield, Bell, Check, Save, Sparkles, RefreshCw, Key } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [academyName, setAcademyName] = useState('CD ACADEMY');
  const [tagline, setTagline] = useState('Har Bachha Padhega');
  const [supportEmail, setSupportEmail] = useState('support@cdacademy.com');
  const [supportPhone, setSupportPhone] = useState('+91 98999 88877');
  const [enableDppChecking, setEnableDppChecking] = useState(true);
  const [enableCbtExamSystem, setEnableCbtExamSystem] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Academy & System Settings
        </h1>
        <p className="text-xs text-slate-500">
          Configure educational platform branding, features, contact channels, and system defaults
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Branding & Identity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-sm text-slate-900">Institution Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Academy Name
              </label>
              <input
                type="text"
                value={academyName}
                onChange={e => setAcademyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Student Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Helpdesk Helpline Number
              </label>
              <input
                type="tel"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-sm text-slate-900">Future-Ready Modular Modules</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">DPP Answer Key & Solution Sheets</span>
                <span className="text-[11px] text-slate-500">Allow students to download solution sheets for daily practice problems</span>
              </div>
              <input
                type="checkbox"
                checked={enableDppChecking}
                onChange={e => setEnableDppChecking(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Full Online Examination (CBT Engine)</span>
                <span className="text-[11px] text-slate-500">Enable computerized tests, timer mock tests, and automated student ranking</span>
              </div>
              <input
                type="checkbox"
                checked={enableCbtExamSystem}
                onChange={e => setEnableCbtExamSystem(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Changes saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
