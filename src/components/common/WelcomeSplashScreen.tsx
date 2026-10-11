import React, { useState, useEffect, useRef } from 'react';
import { CdAcademyLogo } from './CdAcademyLogo';
import { Sparkles, ArrowRight, GraduationCap, BookOpen, Video, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WelcomeSplashScreenProps {
  onFinish: () => void;
  autoDismissMs?: number;
}

export const WelcomeSplashScreen: React.FC<WelcomeSplashScreenProps> = ({
  onFinish,
  autoDismissMs = 1200
}) => {
  const { user, selectedClass } = useAuth();
  const [progress, setProgress] = useState(35);
  const [stageText, setStageText] = useState('Initializing CD ACADEMY...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const triggerFinish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      try {
        onFinishRef.current();
      } catch (err) {
        console.warn('Splash onFinish execution note:', err);
      }
    }, 150);
  };

  useEffect(() => {
    // Stage 1: Load curriculum assets quickly
    const t1 = setTimeout(() => {
      setProgress(75);
      setStageText('Loading Study Notes & Lectures...');
    }, 280);

    // Stage 2: Ready
    const t2 = setTimeout(() => {
      setProgress(100);
      setStageText('Ready! Welcome to CD ACADEMY.');
    }, 650);

    // Stage 3: Smooth automatic dismissal
    const t3 = setTimeout(() => {
      triggerFinish();
    }, autoDismissMs);

    // Stage 4: Absolute fail-safe hard timeout (never get stuck under any circumstances)
    const tFallback = setTimeout(() => {
      if (!finishedRef.current) {
        triggerFinish();
      }
    }, Math.max(1400, autoDismissMs + 200));

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tFallback);
    };
  }, [autoDismissMs]);

  return (
    <div
      onClick={triggerFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#050811] via-[#0b0f19] to-[#0f172a] text-white select-none overflow-hidden transition-all duration-300 cursor-pointer ${
        isFadingOut ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Status and Quick Skip */}
      <div
        className="w-full max-w-md flex items-center justify-between z-10 pt-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-emerald-400">
            Live Learning Portal
          </span>
        </div>

        <button
          onClick={triggerFinish}
          className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition flex items-center gap-1.5 shadow-md active:scale-95"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Hero Animation */}
      <div
        className="flex flex-col items-center justify-center text-center my-auto z-10 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Glowing Official CD ACADEMY Logo */}
        <div className="relative mb-5 group">
          <div className="absolute -inset-3 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-3xl blur-xl opacity-70 animate-pulse transition duration-1000" />
          <div className="relative p-5 sm:p-6 bg-[#0b0f19] rounded-3xl border-2 border-white/20 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center transform hover:scale-102 transition duration-300">
            <CdAcademyLogo variant="badge" size="lg" showTagline={true} />
          </div>
        </div>

        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/25 border border-red-500/50 text-red-400 text-xs font-black tracking-widest uppercase mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Har Bachha Padhega</span>
        </div>

        {/* Personalized Welcome or Tagline */}
        <p className="text-xs sm:text-sm font-semibold text-slate-300 max-w-xs leading-relaxed mb-5">
          {user?.fullName ? (
            <>
              Welcome, <span className="text-white font-bold">{user.fullName}</span>! Starting your{' '}
              <span className="text-amber-400 font-bold">{selectedClass}</span> prep.
            </>
          ) : (
            'Empowering Class 11 & Class 12 students with authentic notes, lectures & CBT tests.'
          )}
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 w-full mb-5">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col items-center text-center">
            <BookOpen className="w-4 h-4 text-red-400 mb-1" />
            <span className="text-[10px] font-bold text-slate-300">NCERT Notes</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col items-center text-center">
            <Video className="w-4 h-4 text-blue-400 mb-1" />
            <span className="text-[10px] font-bold text-slate-300">Live Lectures</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col items-center text-center">
            <GraduationCap className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[10px] font-bold text-slate-300">CBT Tests</span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full bg-slate-800/80 rounded-full h-2 p-0.5 border border-slate-700/60 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-400 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] font-medium text-slate-400 text-center flex items-center justify-center gap-1.5 min-h-[18px]">
            {progress === 100 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            )}
            <span>{stageText}</span>
          </p>
        </div>
      </div>

      {/* Bottom Footer Call to Action */}
      <div
        className="w-full max-w-md flex flex-col items-center gap-2.5 z-10 pb-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={triggerFinish}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm shadow-xl shadow-red-900/40 hover:shadow-red-600/30 transition transform active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Enter CD ACADEMY</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-slate-400 font-mono tracking-wide">
          v2.4.1 • Live updates active for all Android APKs & devices
        </p>
      </div>
    </div>
  );
};
