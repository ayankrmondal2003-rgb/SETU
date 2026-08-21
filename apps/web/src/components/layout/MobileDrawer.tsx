import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, MapPin, Calendar, Compass, User, Store, Shield, ShoppingBag, UtensilsCrossed, ChevronDown, Bell, MessageSquare, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { getHomeRouteForRole } from '../../utils/navigation';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

import { SetuLogoMark } from '../common/SetuLogoMark';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAi: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onOpenAi }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const homeRoute = getHomeRouteForRole(user);
  const [experienceOpen, setExperienceOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-black/95 text-cream flex flex-col justify-between p-6 transition-all duration-300 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cream/15 pb-4 shrink-0">
        <Link to={homeRoute} onClick={onClose} className="font-serif text-2xl sm:text-3xl font-light text-brand-gold tracking-widest flex items-center space-x-2.5">
          <SetuLogoMark className="w-6 h-6 text-brand-gold shrink-0" />
          <span>SETU</span>
          <span className="text-[10px] sub-nav-label tracking-widest border border-brand-gold/40 px-1.5 py-0.5 rounded text-brand-gold">
            {t('nav.logoTag', 'BIHAR TOURISM')}
          </span>
        </Link>
        <div className="flex items-center space-x-3">
          <LanguageSwitcher compact={true} />
          <button onClick={onClose} className="p-2 text-cream/70 hover:text-white" aria-label="Close menu">
            <X className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Main Links */}
      <nav className="flex flex-col space-y-5 my-6 text-lg sm:text-xl font-serif">
        {user?.role !== 'VENDOR' && (
          <>
            <Link to="/explore/circuits" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold py-1">
              <Compass className="w-5 h-5 text-brand-gold shrink-0" />
              <span>{t('nav.circuits', 'EXPLORE CIRCUITS').toUpperCase()}</span>
            </Link>
            <Link to="/explore/destinations" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold py-1">
              <MapPin className="w-5 h-5 text-brand-gold shrink-0" />
              <span>{t('nav.destinations', 'DESTINATIONS').toUpperCase()}</span>
            </Link>
            <Link to="/offerings" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold py-1">
              <ShoppingBag className="w-5 h-5 text-brand-gold shrink-0" />
              <span>{t('nav.book', 'BOOK TOURISM OFFERINGS').toUpperCase()}</span>
            </Link>
            <Link to="/maps" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold py-1">
              <MapPin className="w-5 h-5 text-brand-gold shrink-0" />
              <span>{t('nav.maps', 'INTERACTIVE MAPS').toUpperCase()}</span>
            </Link>
            <Link to="/calendar" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold py-1">
              <Calendar className="w-5 h-5 text-brand-gold shrink-0" />
              <span>{t('nav.calendar', 'CULTURAL CALENDAR').toUpperCase()}</span>
            </Link>

            {/* EXPERIENCE Expandable Section */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Link to="/experience" onClick={onClose} className="flex items-center space-x-4 hover:text-brand-gold py-1">
                  <UtensilsCrossed className="w-5 h-5 text-brand-gold shrink-0" />
                  <span>EXPERIENCE & CUISINE</span>
                </Link>
                <button
                  onClick={() => setExperienceOpen(!experienceOpen)}
                  className="p-2 text-brand-gold hover:text-white"
                  aria-label="Toggle Experience Submenu"
                >
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${experienceOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {experienceOpen && (
                <div className="pl-9 flex flex-col space-y-2 text-base text-cream/80 border-l border-brand-gold/30 ml-2 py-1">
                  <Link to="/experience" onClick={onClose} className="hover:text-brand-gold">
                    Festivals & Cultural Fairs
                  </Link>
                  <Link to="/experience/cuisine" onClick={onClose} className="hover:text-brand-gold">
                    Traditional Bihari Cuisine & Taste
                  </Link>
                </div>
              )}
            </div>

            {(!user || user.role === 'TOURIST') && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAi();
                }}
                className="flex items-center space-x-4 text-brand-gold hover:text-white text-left font-serif py-1"
              >
                <Sparkles className="w-5 h-5 animate-pulse shrink-0" />
                <span>{t('nav.aiGuide', 'SETU AI COMPANION').toUpperCase()}</span>
              </button>
            )}
          </>
        )}

        {user?.role === 'VENDOR' && (
          <div className="flex flex-col space-y-3">
            <span className="text-[10px] sub-nav-label text-brand-gold tracking-widest">VENDOR MANAGEMENT PORTAL</span>
            
            <Link to="/vendor/notifications" onClick={onClose} className="flex items-center justify-between text-base hover:text-brand-gold py-1">
              <span className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-brand-gold shrink-0" />
                <span>VENDOR NOTIFICATIONS</span>
              </span>
              <span className="text-xs bg-brand-gold text-brand-black px-2 py-0.5 rounded-full font-bold">ALERTS</span>
            </Link>

            <Link to="/vendor/messages" onClick={onClose} className="flex items-center justify-between text-base hover:text-brand-gold py-1">
              <span className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-brand-gold shrink-0" />
                <span>TOURIST MESSAGES</span>
              </span>
              <span className="text-xs bg-brand-gold text-brand-black px-2 py-0.5 rounded-full font-bold">INBOX</span>
            </Link>

            <Link to="/vendor/storefront-preview" onClick={onClose} className="flex items-center space-x-3 text-base hover:text-brand-gold py-1">
              <Eye className="w-5 h-5 text-brand-gold shrink-0" />
              <span>REVIEW PUBLIC STOREFRONT</span>
            </Link>

            <Link to={homeRoute} onClick={onClose} className="flex items-center space-x-3 text-base text-amber-300 hover:text-amber-200 py-1">
              <Store className="w-5 h-5 shrink-0" />
              <span>VENDOR DASHBOARD</span>
            </Link>
          </div>
        )}

        {user?.role === 'ADMIN' && (
          <Link to="/admin" onClick={onClose} className="flex items-center space-x-4 text-emerald-300 hover:text-emerald-200 py-1">
            <Shield className="w-5 h-5 shrink-0" />
            <span>{t('nav.adminDashboard', 'ADMIN CONSOLE').toUpperCase()}</span>
          </Link>
        )}
      </nav>

      {/* Footer / Account */}
      <div className="border-t border-cream/15 pt-6 flex flex-col space-y-3">
        {user ? (
          <div className="flex items-center justify-between">
            <Link to="/account" onClick={onClose} className="flex items-center space-x-3 text-sm font-sans">
              <User className="w-5 h-5 text-brand-gold" />
              <span>{user.name} ({user.role})</span>
            </Link>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-xs uppercase tracking-widest text-red-300 hover:text-red-100"
            >
              {t('nav.signOut', 'Sign Out')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/login"
              onClick={onClose}
              className="py-3 text-center border border-cream/30 text-xs tracking-widest uppercase hover:bg-white/10"
            >
              {t('nav.signIn', 'Sign In')}
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="py-3 text-center bg-brand-gold text-brand-black text-xs tracking-widest uppercase font-bold hover:bg-white"
            >
              {t('nav.register', 'Register')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
