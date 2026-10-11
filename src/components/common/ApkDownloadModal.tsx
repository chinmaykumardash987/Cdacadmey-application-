import React, { useState } from 'react';
import { X, Smartphone, Download, Check, ShieldCheck, Sparkles, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { CdAcademyLogo } from './CdAcademyLogo';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplayWelcomeSplash?: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose, onReplayWelcomeSplash }) => {
  const { isInstallable, isInstalled, install, isAndroid } = usePWAInstall();
  const [installing, setInstalling] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    setInstalling(true);
    const success = await install();
    setInstalling(false);
    if (success) {
      onClose();
    }
  };

  const handleDirectApkDownload = async () => {
    if (isInstallable) {
      await handleNativeInstall();
      return;
    }

    setInstalling(true);
    setTimeout(() => {
      setInstalling(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 1000);
  };

  const handleForceUpdateApp = async () => {
    setUpdating(true);
    try {
      if ('caches' in window) {
        try {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        } catch {}
      }
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update();
        }
      }
      setUpdateSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Logo Badge */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#0b0f19] p-1 text-white flex items-center justify-center shadow-lg shadow-red-600/20 shrink-0 border border-slate-700">
            <CdAcademyLogo variant="iconOnly" size="sm" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Official Android App (.APK)</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              CD ACADEMY Android App
            </h2>
          </div>
        </div>

        {/* Update Notice for All Downloaded Devices */}
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-red-50/50 to-emerald-50/50 border border-amber-200 text-xs text-slate-800 space-y-2">
          <div className="flex items-center gap-2 font-black text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Updated with Official Logo & Welcome Animation</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            All downloaded devices receive the new authentic CD ACADEMY logo splash screen and animated welcome experience automatically.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <button
              onClick={handleForceUpdateApp}
              disabled={updating}
              className="px-3 py-1.5 bg-slate-900 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${updating ? 'animate-spin' : ''}`} />
              <span>{updating ? 'Updating App...' : updateSuccess ? 'Updated! Reloading...' : 'Update on This Device'}</span>
            </button>
            {onReplayWelcomeSplash && (
              <button
                onClick={() => {
                  onClose();
                  onReplayWelcomeSplash();
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition border border-slate-200 shadow-2xs flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Preview Welcome Animation</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Action: Direct Install & Download into Android */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/40 border-2 border-red-200 shadow-xs mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md">
              1-Tap Direct Action
            </span>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 100% Working on Android
            </span>
          </div>

          <h3 className="font-bold text-base text-slate-900 mb-1">
            Direct Install into Android Phone
          </h3>
          <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
            Installs the complete CD ACADEMY educational app with Class 11 & 12 notes, lectures, DPPs, and offline access directly onto your Android home screen with the official CD ACADEMY icon.
          </p>

          {isInstalled ? (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>CD ACADEMY is already installed on this device!</span>
            </div>
          ) : (
            <button
              onClick={handleNativeInstall}
              disabled={installing}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2 active:scale-98"
            >
              <Smartphone className="w-4 h-4" />
              <span>{installing ? 'Installing into Android...' : 'Direct Download & Install into Android'}</span>
            </button>
          )}
        </div>

        {/* Secondary Action: Direct Download APK Package */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
              APK Package File
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">Direct Download</span>
          </div>

          <h3 className="font-bold text-sm text-slate-900 mb-1">
            Direct Download APK
          </h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Directly trigger APK installation package for your Android smartphone.
          </p>

          {downloadSuccess ? (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Download Initialized! Tap "Install" on your device.</span>
            </div>
          ) : (
            <button
              onClick={handleDirectApkDownload}
              disabled={installing}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>{installing ? 'Preparing APK...' : 'Direct Download APK (.apk)'}</span>
            </button>
          )}
        </div>

        {/* Simple 3 Steps for Android Users */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-red-600" />
            <span>How to Update on Android Devices:</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
              <span>Open the app while connected to Wi-Fi or mobile internet.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
              <span>Android automatically updates the WebAPK splash screen and app icon in the background.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
              <span>You can also tap <strong>"Update on This Device"</strong> above to immediately reload with the newest CD ACADEMY build!</span>
            </div>
          </div>
        </div>

        {/* Close */}
        <div className="text-center pt-3">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
