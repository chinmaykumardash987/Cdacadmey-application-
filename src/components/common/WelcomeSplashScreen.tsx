import React, { useState, useEffect } from 'react';
import { CdAcademyLogo } from './CdAcademyLogo';
import { Sparkles, ArrowRight, GraduationCap, BookOpen, Video, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WelcomeSplashScreenProps {
  onFinish: () => void;
  autoDismissMs?: number;
}

export const WelcomeSplashScreen: React.FC<WelcomeSplashScreenProps> = ({
  onFinish,
  autoDismissMs = 2400
}) => {
  const { user, selectedClass } = useAuth();
  const [progress, setProgress] = useState(15);
  const [stageText, setStageText] = useState('Initializing CD ACADEMY...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Stage 1: Fast initial progress
    const t1 = setTimeout(() => {
      setProgress(55);
      setStageText('Loading Class 11 & 12 Study Notes & Lectures...');
    }, 600);

    // Stage 2: Ready
    const t2 = setTimeout(() => {
      setProgress(100);
      setStageText('Welcome! Your learning portal is ready.');
    }, 1500);

    // Stage 3: Smooth exit transition
    const t3 = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onFinish();
      }, 400);
    }, autoDismissMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [autoDismissMs, onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish();
    }, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#070b14] via-[#0b0f19] to-[#0f172a] text-white select-none overflow-hidden transition-opacity duration-400 ${
        isFadingOut ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Skip Button */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-emerald-400">
            Live Learning Portal
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition flex items-center gap-1 group"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      {/* Center Hero Animation */}
      <div className="flex flex-col items-center justify-center text-center my-auto z-10 max-w-sm w-full">
        {/* Animated Glowing Logo Badge */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 animate-pulse transition duration-1000" />
          <div className="relative p-6 sm:p-7 bg-[#0b0f19]/90 rounded-3xl border-2 border-white/15 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center">
            <CdAcademyLogo variant="badge" size="lg" showTagline={false} />
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-2 mb-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
            CD ACADEMY
          </h1>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-extrabold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Har Bachha Padhega</span>
          </div>
        </div>

        {/* Personalized Welcome or Tagline */}
        <p className="text-sm font-semibold text-slate-300 max-w-xs leading-relaxed mb-6">
          {user?.fullName ? (
            <>
              Welcome back, <span className="text-white font-bold">{user.fullName}</span>! Ready for your{' '}
              <span className="text-amber-400 font-bold">{selectedClass}</span> prep?
            </>
          ) : (
            'Empowering Class 11 & Class 12 students with premier notes, lectures & tests.'
          )}
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 w-full mb-6">
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

        {/* Progress Bar Container */}
        <div className="w-full space-y-2">
          <div className="w-full bg-slate-800/80 rounded-full h-2 p-0.5 border border-slate-700/60 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out shadow-xs"
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
      <div className="w-full max-w-md flex flex-col items-center gap-3 z-10 pb-4">
        <button
          onClick={handleSkip}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm shadow-xl shadow-red-900/40 hover:shadow-red-600/30 transition transform active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Enter CD ACADEMY</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-slate-400 font-mono tracking-wide">
          v2.4.0 • Updated for all Android APKs & Devices
        </p>
      </div>
    </div>
  );
};
