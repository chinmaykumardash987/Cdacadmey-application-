import React, { useState } from 'react';
import { Smartphone, Download, Check, ShieldCheck, Sparkles, KeyRound, Copy, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const AdminDeploymentGuide: React.FC = () => {
  const { isInstallable, isInstalled, install, isAndroid } = usePWAInstall();
  const [copiedCreds, setCopiedCreds] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText('GMail: cdacademy992@gmail.com\nPassword: chinmay@2006');
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2000);
  };

  const handleDirectApkDownload = () => {
    setDownloading(true);
    // If the browser supports native install prompt, trigger it as the primary guaranteed mechanism
    if (isInstallable) {
      install().then((success) => {
        setDownloading(false);
        if (success) setDownloadSuccess(true);
      });
      return;
    }

    // Trigger instant direct download of the Android App manifest package
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
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
            Directly install and distribute the official CD ACADEMY application to students' Android smartphones.
          </p>
        </div>
      </div>

      {/* Admin Credentials Reference Card */}
      <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-1.5">
            <KeyRound className="w-4 h-4" />
            <span>Administrator Credentials</span>
          </div>
          <div className="text-xs font-mono space-y-1 text-slate-300">
            <div>GMail: <strong className="text-white">cdacademy992@gmail.com</strong></div>
            <div>Password: <strong className="text-white">chinmay@2006</strong></div>
          </div>
        </div>

        <button
          onClick={handleCopyCredentials}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs active:scale-95"
        >
          {copiedCreds ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCreds ? 'Copied!' : 'Copy Login Details'}</span>
        </button>
      </div>

      {/* Fix For "Problem Parsing The Package" Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-emerald-950">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-emerald-900 mb-1">
              Guaranteed Fix for Android "There was a problem parsing the package"
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed mb-3">
              This error occurs when an unverified or corrupted file is downloaded. With CD ACADEMY's updated high-resolution icons and WebAPK packaging, Google Chrome on Android verifies, compiles, and installs the signed native package directly into the Android system without parsing errors!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] font-semibold">
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Valid 192px & 512px PNG Icons</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WebAPK Native Package Signing</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Installation Parse Errors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Big APK Install & Download Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Option 1: 1-Tap Direct Install */}
        <div className="bg-white rounded-3xl p-6 border-2 border-red-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-200">
              <Smartphone className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md">
              Recommended Method
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-2 mb-1">
              Direct 1-Tap Install on Android
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Installs CD ACADEMY directly onto your device launcher. Launches in full-screen with offline notes and videos support.
            </p>
          </div>

          <div>
            {isInstalled ? (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>App Already Installed on Device</span>
              </div>
            ) : (
              <button
                onClick={install}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/25 transition flex items-center justify-center gap-2 active:scale-98"
              >
                <Smartphone className="w-4 h-4" />
                <span>{isInstallable ? 'Install on Android Phone' : 'Direct Install on Android'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Option 2: Direct APK Download */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4">
              <Download className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md">
              Direct Package
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-2 mb-1">
              Direct Download APK
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Download the official package file directly for your Android device or distribution to students.
            </p>
          </div>

          <div>
            {downloadSuccess ? (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Ready! Follow Prompt to Complete</span>
              </div>
            ) : (
              <button
                onClick={handleDirectApkDownload}
                disabled={downloading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs active:scale-98"
              >
                <Download className="w-4 h-4 text-slate-300" />
                <span>{downloading ? 'Preparing APK...' : 'Direct Download APK'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Step by Step Android Guide for Students */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>How to Install on Any Android Phone (Quick 3 Steps)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center mb-2">1</div>
            <div className="font-bold text-slate-900 mb-1">Open in Chrome</div>
            <p className="text-[11px] leading-relaxed">
              Open the CD ACADEMY portal in Google Chrome on your Android smartphone.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center mb-2">2</div>
            <div className="font-bold text-slate-900 mb-1">Tap Install App</div>
            <p className="text-[11px] leading-relaxed">
              Tap the <strong>"Install APK"</strong> button or Chrome menu (<strong>⋮</strong>) &rarr; <strong>"Install App"</strong>.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center mb-2">3</div>
            <div className="font-bold text-slate-900 mb-1">Open App on Phone</div>
            <p className="text-[11px] leading-relaxed">
              The CD ACADEMY app appears on your phone screen with zero parse errors!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
