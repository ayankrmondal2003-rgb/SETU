import { LocalizedText } from '../../components/common/LocalizedText';
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Key, Compass, Store, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../context/LanguageContext';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { getHomeRouteForRole } from '../../utils/navigation';
import { GoogleSignIn } from '../../components/common/GoogleSignIn';

export const LoginPage: React.FC = () => {
  const { login, googleLogin } = useAuth();
  const { showToast } = useToast();
  const { t, translate } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role');
  const [role, setRole] = useState<'TOURIST' | 'VENDOR' | 'ADMIN'>(
    initialRole === 'VENDOR' || initialRole === 'ADMIN' ? initialRole : 'TOURIST'
  );
  const roleLabel = role === 'VENDOR' ? 'Vendor' : role === 'ADMIN' ? 'Admin' : 'Tourist';
  const selectRole = (nextRole: typeof role) => {
    setRole(nextRole);
    setErrorMsg('');
    setPassword('');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const handleGoogleCredential = async (credential: string) => {
    if (role === 'ADMIN') return;
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await googleLogin(credential, role);
      setLoggedInUser(user);
      showToast(`${translate('Welcome back')}, ${user.name}!`, 'success');
      setShowSuccessAnim(true);
    } catch (error: any) {
      setErrorMsg(translate(error.response?.data?.error || 'Google sign-in failed'));
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await login({ email, password, role });
      setLoggedInUser(user);
      localStorage.setItem('setu_entry_completed', 'true');
      showToast(`${translate('Welcome back')}, ${user.name}!`, 'success');
      setShowSuccessAnim(true);
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Invalid email or password';
      setErrorMsg(translate(message));
      showToast(translate(message), 'error');
      setLoading(false);
    }
  };

  if (showSuccessAnim) {
    return (
      <LoadingScreen
        brandText={translate('AUTHENTICATING SESSION & PREPARING DASHBOARD...')}
        onComplete={() => {
          localStorage.setItem('setu_entry_completed', 'true');
          const target = getHomeRouteForRole(loggedInUser);
          navigate(target, { replace: true });
        }}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-24 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, rgba(15, 8, 4, 0.45) 0%, rgba(10, 5, 2, 0.88) 100%)'
      }}
    >
      {/* Double Border Outer Container Frame with Micro-Animation Entrance */}
      <div className="w-full max-w-md p-1 bg-gradient-to-b from-brand-gold/50 via-brand-gold/25 to-brand-gold/50 rounded-2xl shadow-2xl animate-fadeIn">
        {/* Main Inner Card Frame */}
        <div className="relative bg-white/95 backdrop-blur-md border border-brand-brown/20 p-6 sm:p-9 md:p-10 rounded-xl overflow-hidden shadow-inner">

          {/* Low-Opacity Jaali / Geometric Pattern Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B88A28' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3Cpath d='M20 0L0 20v20l40-40H20z'/%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '36px 36px'
            }}
          />

          {/* Corner Flourish 1: Top-Left */}
          <svg className="absolute top-2 left-2 w-8 h-8 text-brand-gold/30 pointer-events-none z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Corner Flourish 2: Top-Right */}
          <svg className="absolute top-2 right-2 w-8 h-8 text-brand-gold/30 pointer-events-none transform rotate-90 z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Corner Flourish 3: Bottom-Left */}
          <svg className="absolute bottom-2 left-2 w-8 h-8 text-brand-gold/30 pointer-events-none transform -rotate-90 z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Corner Flourish 4: Bottom-Right */}
          <svg className="absolute bottom-2 right-2 w-8 h-8 text-brand-gold/30 pointer-events-none transform rotate-180 z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Wordmark Header & Ornamental Gold Line */}
          <div className="text-center space-y-2 mb-7 relative z-10">
            <Link
              to="/"
              className="font-serif text-4xl font-medium tracking-[0.25em] text-brand-gold hover:opacity-90 transition-opacity inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
            >
              SETU
            </Link>

            {/* Gold Line with Centered Diamond Motif */}
            <div className="flex items-center justify-center space-x-2.5 my-1.5">
              <div className="h-[1px] w-14 bg-gradient-to-r from-transparent via-brand-gold/60 to-brand-gold" />
              <span className="text-brand-gold text-[10px] font-serif">◆</span>
              <div className="h-[1px] w-14 bg-gradient-to-l from-transparent via-brand-gold/60 to-brand-gold" />
            </div>

            <span className="sub-nav-label text-brand-maroon text-[10px] tracking-widest block font-semibold"><LocalizedText text={" BIHAR TOURISM MARKETPLACE "} /></span>
            <h2 className="text-xl sm:text-2xl font-serif text-brand-black pt-1">
              {t('auth.signInTitle', 'Sign In to Your Account')}
            </h2>
          </div>

          <div className="relative z-10 mb-6">
            <p className="text-center text-[10px] font-sans uppercase tracking-[0.2em] text-brand-brown/70 mb-3"><LocalizedText text={"Your journey begins here"} /></p>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-brand-gold/30 bg-cream/80 p-1.5" role="group" aria-label="Sign-in account type">
              {(['TOURIST', 'VENDOR'] as const).map((option) => {
                const Icon = option === 'TOURIST' ? Compass : Store;
                return (
                  <button key={option} type="button" disabled={loading} aria-pressed={role === option} onClick={() => selectRole(option)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg px-3 py-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:opacity-50 ${role === option ? 'bg-brand-black text-brand-gold shadow-md' : 'text-brand-brown hover:bg-white/80'}`}>
                    <Icon className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-serif text-base">{translate(option === 'TOURIST' ? 'Tourist' : 'Vendor')}</span>
                    <span className="font-sans text-[10px] opacity-75">{translate(option === 'TOURIST' ? 'Discover Bihar' : 'Grow your business')}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-center text-xs font-sans text-brand-brown/80" aria-live="polite">
              {translate(role === 'ADMIN' ? 'Administrator access · Authorized accounts only' : `Sign in to your ${roleLabel.toLowerCase()} account`)}
            </p>
          </div>

          <details className="mb-5 bg-cream/70 p-3 rounded-lg border border-brand-gold/25 text-xs font-sans text-brand-brown relative z-10">
            <summary className="cursor-pointer font-semibold text-[10px] uppercase tracking-wider focus-visible:outline-brand-gold">
              <Key className="inline-block w-3.5 h-3.5 text-brand-gold mr-1.5" aria-hidden="true" /><LocalizedText text={" Try a demo account "} /></summary>
            <div className="grid grid-cols-1 gap-1 text-[11px] pt-0.5">
              <div className="break-all">{translate(roleLabel)}: <span className="font-mono font-semibold text-brand-black">{role.toLowerCase()}@setu.local</span> / {role.toLowerCase()}123</div>
            </div>
          </details>

          {errorMsg && (
            <div role="alert" className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-sans relative z-10">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 font-sans relative z-10">
            <div>
              <label htmlFor="login-email" className="block text-xs sub-nav-label text-brand-black/75 mb-2 font-semibold">
                {t('auth.emailLabel', 'EMAIL ADDRESS').toUpperCase()}
              </label>
              <input
                type="email"
                id="login-email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`e.g. ${role.toLowerCase()}@setu.local`}
                className="w-full bg-cream/60 border border-brand-brown/25 rounded-lg p-3 text-sm text-brand-black placeholder-brand-brown/40 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="login-password" className="text-xs sub-nav-label text-brand-black/75 font-semibold">
                  {t('auth.passwordLabel', 'PASSWORD').toUpperCase()}
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cream/60 border border-brand-brown/25 rounded-lg p-3 pr-10 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-brown/60 hover:text-brand-black transition-colors focus:outline-none"
                  aria-label={translate(showPassword ? 'Hide password' : 'Show password')}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold hover:from-amber-400 hover:to-brand-gold text-brand-black font-bold p-3.5 rounded-lg text-xs sub-nav-label tracking-widest transition-all duration-300 shadow-md shadow-brand-gold/25 hover:shadow-lg hover:shadow-brand-gold/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {translate(loading ? 'AUTHENTICATING...' : `SIGN IN AS ${roleLabel.toUpperCase()}`)}
            </button>
          </form>
          {role !== 'ADMIN' && <GoogleSignIn role={role} disabled={loading} onCredential={handleGoogleCredential} />}

          {role !== 'ADMIN' && <div className="mt-6 text-center text-xs font-sans text-brand-brown/80 relative z-10">
            {t('auth.dontHaveAccount', "Don't have an account?")}<LocalizedText text={' '} />
            <Link to={`/register?role=${role}`} className="text-brand-maroon font-semibold hover:underline">
              {t('nav.register', 'Create an account')}
            </Link>
          </div>}
          <div className="mt-5 pt-4 border-t border-brand-gold/20 text-center relative z-10">
            <button type="button" disabled={loading} aria-pressed={role === 'ADMIN'} onClick={() => selectRole(role === 'ADMIN' ? 'TOURIST' : 'ADMIN')}
              className="inline-flex items-center gap-1.5 text-[11px] font-sans text-brand-brown/70 hover:text-brand-maroon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded px-2 py-1 disabled:opacity-50">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              {translate(role === 'ADMIN' ? 'Back to tourist sign in' : 'Admin login')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
