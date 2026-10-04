import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CdAcademyLogo } from '../common/CdAcademyLogo';
import { Shield, Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginPageProps {
  onBackToStudentPortal: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToStudentPortal }) => {
  const { loginAdmin, quickLoginAs } = useAuth();
  const [email, setEmail] = useState('admin@cdacademy.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter admin email address.');
      return;
    }
    setError(null);
    setLoading(true);
    const result = await loginAdmin(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.message || 'Access Denied. Unauthorized credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-8 sm:px-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-4">
          <button
            onClick={onBackToStudentPortal}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student Portal</span>
          </button>
        </div>

        {/* Brand Card Header */}
        <div className="text-center mb-6">
          <CdAcademyLogo variant="badge" size="md" className="mx-auto mb-4 border-neutral-700" />
          <div className="inline-flex items-center gap-1.5 bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Authorized Administration Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Administrator Sign In
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access CD ACADEMY content management, students, and curriculum controls
          </p>
        </div>

        {/* Quick Demo Credentials Box */}
        <div className="mb-4 bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-red-400" />
              <span>Default Admin Credentials:</span>
            </span>
            <button
              type="button"
              onClick={() => quickLoginAs('admin')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-0.5 rounded text-[11px] transition shadow-xs"
            >
              1-Click Admin Login ⚡
            </button>
          </div>
          <div className="mt-1 text-[11px] font-mono text-slate-400">
            Email: <span className="text-white">admin@cdacademy.com</span> • Password: <span className="text-white">admin123</span>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@cdacademy.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-600/25 transition disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span>Verifying Administrator...</span>
              ) : (
                <>
                  <span>Enter Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
