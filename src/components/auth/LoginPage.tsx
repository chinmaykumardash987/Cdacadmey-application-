import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CdAcademyLogo } from '../common/CdAcademyLogo';
import { Mail, Lock, ArrowRight, Shield, AlertCircle, CheckCircle, Sparkles, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onGoToSignUp: () => void;
  onGoToAdminLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onGoToSignUp,
  onGoToAdminLogin
}) => {
  const { loginStudent, quickLoginAs } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your Registered Email or Mobile Number');
      return;
    }
    setError(null);
    setLoading(true);
    const result = await loginStudent(identifier, password);
    setLoading(false);
    if (!result.success) {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotInput('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-red-50/30 flex flex-col justify-center items-center px-4 py-8 sm:px-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <CdAcademyLogo variant="badge" size="md" className="mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to CD ACADEMY
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Class 11 & 12 Academic Workspace • Har Bachha Padhega
          </p>
        </div>

        {/* 1-Click Fast Access Box for Reviewers */}
        <div className="mb-4 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xs rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-red-600" />
              <span>Instant 1-Click Test Login:</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">No typing needed</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickLoginAs('student11')}
              className="text-[11px] bg-slate-50 hover:bg-red-50 hover:border-red-300 hover:text-red-700 text-slate-700 font-bold py-1.5 px-2 rounded-xl border border-slate-200 transition text-center shadow-2xs"
            >
              Class 11 🎓
            </button>
            <button
              type="button"
              onClick={() => quickLoginAs('student12')}
              className="text-[11px] bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-700 font-bold py-1.5 px-2 rounded-xl border border-slate-200 transition text-center shadow-2xs"
            >
              Class 12 🎓
            </button>
            <button
              type="button"
              onClick={() => quickLoginAs('admin')}
              className="text-[11px] bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-2 rounded-xl transition text-center shadow-2xs"
            >
              Admin ⚡
            </button>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. student@cdacademy.com or 9876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-600/25 transition disabled:opacity-50 text-sm active:scale-[0.99]"
            >
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <span>Sign In to Student Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* New Student Sign Up */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-3">Don't have a student account yet?</p>
            <button
              onClick={onGoToSignUp}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition border border-slate-200/80"
            >
              New Student? Sign Up Here
            </button>
          </div>
        </div>

        {/* Administrator Access Portal Link */}
        <div className="mt-5 text-center">
          <button
            onClick={onGoToAdminLogin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Administrator Access Portal</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6">
            <h3 className="font-bold text-base text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your registered email address or mobile number to receive a secure password reset link.
            </p>

            {forgotSent ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password reset instructions have been sent successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="text"
                  value={forgotInput}
                  onChange={e => setForgotInput(e.target.value)}
                  placeholder="Enter email or mobile number"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  required
                />
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
