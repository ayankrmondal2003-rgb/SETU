import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Store, Check, ArrowRight, Globe } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getHomeRouteForRole } from '../../utils/navigation';
import { SetuLogoMark } from '../../components/common/SetuLogoMark';

export type UserTypeRole = 'TOURIST' | 'VENDOR';

export const EntryWelcomePage: React.FC<{ onCompleteEntry?: () => void }> = ({ onCompleteEntry }) => {
  const { setLanguage, t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserTypeRole>('TOURIST');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');

  // When role changes, ensure selected language is valid for that role
  const handleRoleSelect = (role: UserTypeRole) => {
    setSelectedRole(role);
    if (role === 'TOURIST' && selectedLang === 'bho') {
      setSelectedLang('hi'); // Fallback from Bhojpuri if Tourist selected
    }
  };

  const handleEnter = () => {
    // 1. Set language in i18n system
    setLanguage(selectedLang);

    // 2. Mark entry completion in localStorage
    localStorage.setItem('setu_entry_completed', 'true');
    localStorage.setItem('setu_preferred_role', selectedRole);

    if (onCompleteEntry) {
      onCompleteEntry();
    }

    // 3. Perform Role-aware Navigation
    if (user) {
      navigate(getHomeRouteForRole(user));
    } else {
      if (selectedRole === 'VENDOR') {
        navigate('/vendor/local-dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-cream flex flex-col justify-between items-center p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background Image: login.jpeg */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed pointer-events-none"
        style={{ backgroundImage: `url('/login.jpeg')` }}
      />

      {/* Dark Vignette Overlay for Readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-brand-black/85 via-brand-black/75 to-brand-black/90 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-brand-black/60 to-brand-black/90 pointer-events-none" />

      {/* Header / Brand */}
      <div className="relative z-10 text-center space-y-3 pt-6 max-w-2xl mx-auto animate-fadeIn">
        <SetuLogoMark className="w-14 h-14 text-brand-gold mx-auto drop-shadow-[0_0_15px_rgba(198,155,69,0.7)] mb-1" />
        
        <span className="sub-nav-label text-brand-gold tracking-[0.3em] block text-xs font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          WELCOME TO BIHAR TOURISM & LOCAL MARKETPLACE
        </span>

        <h1 className="font-serif text-5xl md:text-7xl text-brand-gold font-bold tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          SETU
        </h1>

        {/* Gold Line with Centered Diamond Motif */}
        <div className="flex items-center justify-center space-x-3 my-2">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-brand-gold/70 to-brand-gold" />
          <span className="text-brand-gold text-xs font-serif drop-shadow-[0_0_8px_rgba(198,155,69,0.6)]">◆</span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-brand-gold/70 to-brand-gold" />
        </div>

        <p className="text-sm md:text-base font-serif text-cream/90 max-w-lg mx-auto leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          Please select your profile and language to personalize your Bihar experience.
        </p>
      </div>

      {/* Main Choice Container (Miniature Painting Frame & Jaali Pattern) */}
      <div className="relative z-10 w-full max-w-2xl p-[1px] rounded-3xl bg-gradient-to-b from-brand-gold/40 via-brand-gold/20 to-brand-gold/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] my-8 animate-slideUp">
        <div className="relative bg-brand-black/85 backdrop-blur-xl rounded-[23px] border border-brand-gold/30 p-6 sm:p-10 space-y-8 overflow-hidden">
          
          {/* Subtle Jaali / Lattice Overlay Pattern */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#c69b45_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Corner Flourish 1: Top-Left */}
          <svg className="absolute top-3 left-3 w-8 h-8 text-brand-gold/25 pointer-events-none z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Corner Flourish 2: Top-Right */}
          <svg className="absolute top-3 right-3 w-8 h-8 text-brand-gold/25 pointer-events-none transform rotate-90 z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Corner Flourish 3: Bottom-Left */}
          <svg className="absolute bottom-3 left-3 w-8 h-8 text-brand-gold/25 pointer-events-none transform -rotate-90 z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* Corner Flourish 4: Bottom-Right */}
          <svg className="absolute bottom-3 right-3 w-8 h-8 text-brand-gold/25 pointer-events-none transform rotate-180 z-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 18V6a2 2 0 0 1 2-2h12" />
            <path d="M4 4l12 12" />
            <circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6" />
          </svg>

          {/* STEP 1: ROLE SELECTION */}
          <div className="space-y-4 relative z-10">
            <div className="flex items-center space-x-2 text-xs font-bold sub-nav-label text-brand-gold">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-gold to-amber-600 text-brand-black flex items-center justify-center text-xs font-bold ring-2 ring-brand-gold/40 shadow-sm">
                1
              </span>
              <span>WHO ARE YOU? / आप कौन हैं?</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tourist Option */}
              <button
                type="button"
                onClick={() => handleRoleSelect('TOURIST')}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center space-y-3 relative overflow-hidden ${
                  selectedRole === 'TOURIST'
                    ? 'bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-black border-brand-gold shadow-[0_0_20px_rgba(198,155,69,0.4)] font-bold scale-[1.02]'
                    : 'bg-white/5 text-cream border-white/15 hover:border-brand-gold/60 hover:bg-white/10 hover:scale-[1.01]'
                }`}
              >
                {/* Decorative Diamond Accent on Selected */}
                {selectedRole === 'TOURIST' && (
                  <span className="absolute top-2 right-2 text-[10px] text-brand-black font-serif">◆</span>
                )}
                <div className={`p-3.5 rounded-full ${selectedRole === 'TOURIST' ? 'bg-brand-black text-brand-gold shadow-md' : 'bg-white/10 text-brand-gold'}`}>
                  <Compass className="w-8 h-8" />
                </div>
                <div>
                  <span className="block text-lg font-serif font-bold">Tourist / Traveler</span>
                  <span className="text-xs opacity-90 font-sans block mt-0.5">सैलानी / यात्री</span>
                  <span className="text-[11px] opacity-80 block mt-2 font-serif">Explore circuits, festivals & heritage</span>
                </div>
              </button>

              {/* Vendor Option */}
              <button
                type="button"
                onClick={() => handleRoleSelect('VENDOR')}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center space-y-3 relative overflow-hidden ${
                  selectedRole === 'VENDOR'
                    ? 'bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-black border-brand-gold shadow-[0_0_20px_rgba(198,155,69,0.4)] font-bold scale-[1.02]'
                    : 'bg-white/5 text-cream border-white/15 hover:border-brand-gold/60 hover:bg-white/10 hover:scale-[1.01]'
                }`}
              >
                {/* Decorative Diamond Accent on Selected */}
                {selectedRole === 'VENDOR' && (
                  <span className="absolute top-2 right-2 text-[10px] text-brand-black font-serif">◆</span>
                )}
                <div className={`p-3.5 rounded-full ${selectedRole === 'VENDOR' ? 'bg-brand-black text-brand-gold shadow-md' : 'bg-white/10 text-brand-gold'}`}>
                  <Store className="w-8 h-8" />
                </div>
                <div>
                  <span className="block text-lg font-serif font-bold">Local Vendor / Artisan</span>
                  <span className="text-xs opacity-90 font-sans block mt-0.5">स्थानीय विक्रेता / कारीगर</span>
                  <span className="text-[11px] opacity-80 block mt-2 font-serif">List handicrafts, products & stays</span>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 2: LANGUAGE SELECTION */}
          <div className="space-y-4 border-t border-brand-gold/20 pt-6 relative z-10">
            <div className="flex items-center space-x-2 text-xs font-bold sub-nav-label text-brand-gold">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-gold to-amber-600 text-brand-black flex items-center justify-center text-xs font-bold ring-2 ring-brand-gold/40 shadow-sm">
                2
              </span>
              <span>CHOOSE LANGUAGE / भाषा चुनें</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* English */}
              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`py-3.5 px-4 rounded-xl border-2 text-sm font-sans flex items-center justify-between transition-all duration-300 ${
                  selectedLang === 'en'
                    ? 'bg-gradient-to-r from-cream via-amber-50 to-cream text-brand-black border-brand-gold font-bold shadow-[0_2px_10px_rgba(198,155,69,0.3)]'
                    : 'bg-white/5 text-cream border-white/15 hover:border-brand-gold/50 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>🇬🇧</span>
                  <span>English</span>
                </div>
                {selectedLang === 'en' && <Check className="w-4 h-4 text-brand-maroon stroke-[3]" />}
              </button>

              {/* Hindi */}
              <button
                type="button"
                onClick={() => setSelectedLang('hi')}
                className={`py-3.5 px-4 rounded-xl border-2 text-sm font-sans flex items-center justify-between transition-all duration-300 ${
                  selectedLang === 'hi'
                    ? 'bg-gradient-to-r from-cream via-amber-50 to-cream text-brand-black border-brand-gold font-bold shadow-[0_2px_10px_rgba(198,155,69,0.3)]'
                    : 'bg-white/5 text-cream border-white/15 hover:border-brand-gold/50 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>🇮🇳</span>
                  <span>हिन्दी (Hindi)</span>
                </div>
                {selectedLang === 'hi' && <Check className="w-4 h-4 text-brand-maroon stroke-[3]" />}
              </button>

              {/* Bhojpuri - Only visible for Vendor selection per requirements */}
              {selectedRole === 'VENDOR' ? (
                <button
                  type="button"
                  onClick={() => setSelectedLang('bho')}
                  className={`py-3.5 px-4 rounded-xl border-2 text-sm font-sans flex items-center justify-between transition-all duration-300 ${
                    selectedLang === 'bho'
                      ? 'bg-gradient-to-r from-cream via-amber-50 to-cream text-brand-black border-brand-gold font-bold shadow-[0_2px_10px_rgba(198,155,69,0.3)]'
                      : 'bg-white/5 text-cream border-white/15 hover:border-brand-gold/50 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>🇮🇳</span>
                    <span>भोजपुरी (Bhojpuri)</span>
                  </div>
                  {selectedLang === 'bho' && <Check className="w-4 h-4 text-brand-maroon stroke-[3]" />}
                </button>
              ) : (
                <div className="py-3.5 px-4 rounded-xl border border-white/10 bg-black/30 text-cream/40 text-xs flex items-center justify-center text-center">
                  <span>Bhojpuri available for Vendors</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleEnter}
            className="w-full py-4 px-6 bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-black font-bold sub-nav-label text-sm tracking-[0.2em] rounded-xl hover:from-amber-400 hover:to-brand-gold hover:shadow-[0_0_25px_rgba(198,155,69,0.5)] transition-all duration-300 shadow-xl flex items-center justify-center space-x-3 group active:scale-[0.99] relative z-10"
          >
            <span>ENTER SETU BIHAR TOURISM</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform duration-300 text-brand-black" />
          </button>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="relative z-10 text-center text-xs font-sans text-cream/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <p>You can change your language anytime from the top navigation bar.</p>
      </div>
    </div>
  );
};
