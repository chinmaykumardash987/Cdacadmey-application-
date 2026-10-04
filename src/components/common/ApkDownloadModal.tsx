import React, { useState } from 'react';
import { X, Smartphone, Download, Check, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isAndroid } = usePWAInstall();
  const [installing, setInstalling] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    setInstalling(true);
    const success = await install();
    setInstalling(false);
    if (success) {
      onClose();
    }
  };

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-5 sm:p-7 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-13 h-13 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              <Sparkles className="w-3 h-3" />
              <span>Android App (.APK)</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Download CD ACADEMY
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          Get the official CD ACADEMY app for your Android phone with offline support, fast loading, and full-screen experience.
        </p>

        {/* Action 1: Direct Install on Android Phone (1-Tap WebAPK) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/50 border border-red-200 shadow-2xs mb-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md">
              Option 1 • Instant Install
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">Android 8.0+</span>
          </div>

          <h3 className="font-bold text-sm text-slate-900 mb-1">
            Install on Android Phone
          </h3>
          <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
            Instantly adds the CD ACADEMY native app icon to your Android Home Screen and App Drawer.
          </p>

          {isInstalled ? (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>App Already Installed on Device!</span>
            </div>
          ) : isInstallable ? (
            <button
              onClick={handleNativeInstall}
              disabled={installing}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-600/25 transition flex items-center justify-center gap-2 active:scale-98"
            >
              <Smartphone className="w-4 h-4" />
              <span>{installing ? 'Installing App...' : 'Install App on Android'}</span>
            </button>
          ) : (
            <button
              onClick={handleNativeInstall}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-600/25 transition flex items-center justify-center gap-2 active:scale-98"
            >
              <Smartphone className="w-4 h-4" />
              <span>Install App on Android</span>
            </button>
          )}
        </div>

        {/* Action 2: Direct Download APK File (.apk package) */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
              Option 2 • Package File
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">cd-academy-app.apk</span>
          </div>

          <h3 className="font-bold text-sm text-slate-900 mb-1">
            Direct Download APK File
          </h3>
          <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
            Download the raw APK file to install manually or share with other students.
          </p>

          <a
            href="/cd-academy-app.apk"
            download="cd-academy-app.apk"
            onClick={handleDownloadApk}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            {downloadStarted ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Downloading APK File...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-300" />
                <span>Download APK File (.apk)</span>
              </>
            )}
          </a>
        </div>

        {/* 3 Simple Steps */}
        <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 text-xs text-slate-700 space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>How to Install on Android:</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
              <span>Tap <strong>"Install App on Android"</strong> or <strong>"Download APK File"</strong> above.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
              <span>Tap <strong>"Install"</strong> or <strong>"Open"</strong> when the notification appears.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
              <span>The <strong>CD ACADEMY</strong> app will be ready on your phone with full access!</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
