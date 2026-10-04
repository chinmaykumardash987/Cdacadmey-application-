import React, { useState } from 'react';
import { Smartphone, Download, Check, ShieldCheck, Sparkles, RefreshCw, KeyRound, Copy } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const AdminDeploymentGuide: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedCreds, setCopiedCreds] = useState(false);

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText('GMail: cdacademy992@gmail.com\nPassword: chinmay@2006');
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset sample student notes, video classes, and practice DPPs back to default?')) {
      StorageService.resetToDefaultData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Android App Distribution</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            CD ACADEMY Android App & APK Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Download the standalone Android APK or install the app directly onto your phone.
          </p>
        </div>
      </div>

      {/* Admin Credentials Card */}
      <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-1.5">
            <KeyRound className="w-4 h-4" />
            <span>Administrator Login Credentials</span>
          </div>
          <div className="text-xs font-mono space-y-1 text-slate-300">
            <div>GMail: <strong className="text-white">cdacademy992@gmail.com</strong></div>
            <div>Password: <strong className="text-white">chinmay@2006</strong></div>
          </div>
        </div>

        <button
          onClick={handleCopyCredentials}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          {copiedCreds ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCreds ? 'Copied!' : 'Copy Login Details'}</span>
        </button>
      </div>

      {/* 2 Big APK Download & Install Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Option 1: Direct 1-Tap Install */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-100">
              <Smartphone className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md">
              Method 1
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-2 mb-1">
              Direct Install to Android Phone
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Installs CD ACADEMY directly onto your device launcher. Launches in full-screen with offline notes support.
            </p>
          </div>

          <div>
            {isInstalled ? (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Installed on Device</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={install}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/25 transition flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install on Android Phone</span>
              </button>
            ) : (
              <button
                onClick={install}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/25 transition flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install on Android Phone</span>
              </button>
            )}
          </div>
        </div>

        {/* Option 2: Download Raw APK */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 border border-slate-200">
              <Download className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
              Method 2
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-2 mb-1">
              Direct Download APK Package
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Directly download the official <code className="font-mono font-bold text-slate-800">cd-academy-app.apk</code> file for direct installation and sharing with students.
            </p>
          </div>

          <a
            href="/cd-academy-app.apk"
            download="cd-academy-app.apk"
            onClick={handleDownloadApk}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
          >
            {downloadStarted ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Downloading APK...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-300" />
                <span>Download APK File (.apk)</span>
              </>
            )}
          </a>
        </div>
      </div>

      {/* 3 Step Android Guide */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Simple Android Installation Instructions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center mb-2">1</div>
            <div className="font-bold text-slate-900 mb-1">Download APK</div>
            <p className="text-[11px] leading-relaxed">
              Tap <strong>Install on Android</strong> or <strong>Download APK File</strong> above.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center mb-2">2</div>
            <div className="font-bold text-slate-900 mb-1">Confirm Install</div>
            <p className="text-[11px] leading-relaxed">
              Tap <strong>"Install"</strong> or <strong>"Open"</strong> when the download prompt appears on your phone.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center mb-2">3</div>
            <div className="font-bold text-slate-900 mb-1">Open CD ACADEMY</div>
            <p className="text-[11px] leading-relaxed">
              The app opens with full offline access to Class 11 and 12 study notes and videos!
            </p>
          </div>
        </div>
      </div>

      {/* Reset Data */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-800 block">Reset Practice Data</span>
          <span className="text-[11px] text-slate-500">
            Re-populate all sample notes, lectures, DPPs, and sample student accounts to initial state.
          </span>
        </div>
        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </div>
  );
};
