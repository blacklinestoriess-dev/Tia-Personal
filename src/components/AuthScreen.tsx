import React, { useState, useId } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Calendar,
  MapPin,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import type { AuthSession } from '../types';

interface AuthScreenProps {
  isDark: boolean;
  onAuthSuccess: (session: AuthSession) => void;
}

// Age calculation helper
function calculateAgeFromDob(dob: string): number | null {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ isDark, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('unspecified');

  const calculatedAge = calculateAgeFromDob(dob);

  // Quick fill helper for testing
  const handleQuickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to log in. Please check your credentials.');
      }

      onAuthSuccess({
        token: data.token,
        user: data.user,
        profile: data.profile,
        isNewUser: false,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('A valid email address is required.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!dob) {
      setErrorMessage('Date of birth is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          date_of_birth: dob,
          address: address.trim() || 'India',
          occupation_status: occupation.trim() || 'Working on goals',
          gender,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create account.');
      }

      onAuthSuccess({
        token: data.token,
        user: data.user,
        profile: data.profile,
        isNewUser: true,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please provide your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setSuccessMessage(
        data.message || 'Password reset instructions have been dispatched.'
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-container"
      className={`min-h-screen w-full flex flex-col items-center p-4 sm:p-6 pt-8 sm:pt-12 pb-24 sm:pb-32 transition-colors ${
        isDark ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="w-full max-w-md my-auto">
        {/* Brand Logo & Headline */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 shadow-xl shadow-rose-500/20 mb-3 animate-pulse">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1
            id="auth-title"
            className={`text-2xl sm:text-3xl font-bold tracking-tight font-display ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Meet Tia
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your personal, witty & private AI companion
          </p>
        </div>

        {/* Card Container */}
        <div
          id="auth-card"
          className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-md shadow-2xl transition-all ${
            isDark
              ? 'bg-slate-900/80 border-slate-800 text-slate-100'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/50'
          }`}
        >
          {/* Top Mode Tabs */}
          {mode !== 'forgot' ? (
            <div className="flex border-b border-slate-700/40 pb-3 mb-6">
              <button
                type="button"
                id="tab-login"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 pb-2 text-sm font-semibold text-center border-b-2 transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'border-rose-500 text-rose-500 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                id="tab-signup"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 pb-2 text-sm font-semibold text-center border-b-2 transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'border-rose-500 text-rose-500 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-700/40">
              <span className="text-sm font-semibold text-rose-400 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" /> Reset Password
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                Back to Log In
              </button>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div
              id="auth-error-alert"
              className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2 animate-shake"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div
              id="auth-success-alert"
              className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form id="form-login" onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. anurag@tia.ai"
                    className={`w-full pl-10 pr-3 py-2 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    id="btn-goto-forgot-pass"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage(null);
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-login"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-medium text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log In to Tia</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Test Demo Accounts */}
              <div className="pt-4 border-t border-slate-700/30">
                <p className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quick Test Accounts (Isolated Profiles):</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="btn-quick-anurag"
                    onClick={() => handleQuickFill('anurag@tia.ai', 'password123')}
                    className={`px-2.5 py-1.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      isDark
                        ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-700/50 text-slate-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-rose-400">Anurag</div>
                    <div className="text-[10px] text-slate-400">Patna • Startup</div>
                  </button>
                  <button
                    type="button"
                    id="btn-quick-testuser"
                    onClick={() => handleQuickFill('test@tia.ai', 'password123')}
                    className={`px-2.5 py-1.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      isDark
                        ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-700/50 text-slate-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-indigo-400">Test User</div>
                    <div className="text-[10px] text-slate-400">Delhi • Student</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form id="form-signup" onSubmit={handleSignup} className="space-y-3.5">
              {/* Full Name (Required) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="input-signup-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>

              {/* Email (Required) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="input-signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>

              {/* Password (Required) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Password <span className="text-rose-400">*</span> (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="input-signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-10 py-2 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Date of Birth (Required) + Auto-calculated Age */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-400">
                    Date of Birth <span className="text-rose-400">*</span>
                  </label>
                  {calculatedAge !== null && (
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Age: {calculatedAge} years
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="input-signup-dob"
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>

              {/* Address / City (Optional) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Location / City <span className="text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="input-signup-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Patna, India or Mumbai"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>

              {/* Current Work / Occupation (Optional) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Current Work / Role <span className="text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    id="input-signup-occupation"
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Working on a startup, Student"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>

              {/* Gender (Optional) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Gender <span className="text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <select
                  id="select-signup-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm border outline-none transition-all ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 text-white focus:border-rose-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                  }`}
                >
                  <option value="unspecified">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-signup"
                disabled={loading}
                className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-medium text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Profile & Meet Tia</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form id="form-forgot" onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-400">
                Enter your account email and we'll send you instructions to reset your password.
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    id="input-forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-3 py-2 rounded-xl text-sm border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-800/80 border-slate-700 text-white focus:border-rose-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-forgot"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Send Reset Instructions</span>
                )}
              </button>
            </form>
          )}

          {/* Privacy & RLS note */}
          <div className="mt-6 pt-4 border-t border-slate-700/30 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Row-Level Security & Private User Memory Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
