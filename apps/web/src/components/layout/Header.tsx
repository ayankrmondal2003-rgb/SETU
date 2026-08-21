import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Menu,
  ChevronDown,
  User,
  Store,
  Shield,
  Bell,
  MessageSquare,
  Eye,
  LogOut,
  Settings,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MegaMenuExplore } from './MegaMenuExplore';
import { MegaMenuExperience } from './MegaMenuExperience';
import { MobileDrawer } from './MobileDrawer';
import { SetuLogoMark } from '../common/SetuLogoMark';
import api from '../../api/client';
import { formatDistanceToNow } from 'date-fns';

interface HeaderProps {
  onOpenAi: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAi }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'explore' | 'experience' | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<'notifications' | 'messages' | 'profile' | null>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);

  const [conversations, setConversations] = useState<any[]>([]);
  const [unreadMsgCount, setUnreadMsgCount] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
    setMobileDrawerOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Click Outside Listener for Header Dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.header-dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Poll Vendor Notifications & Messages
  useEffect(() => {
    if (user?.role === 'VENDOR') {
      const fetchVendorHeaderData = async () => {
        try {
          const [notifRes, convRes] = await Promise.all([
            api.get('/vendors/me/notifications').catch(() => null),
            api.get('/vendors/me/conversations').catch(() => null)
          ]);

          if (notifRes?.data?.success) {
            setNotifications(notifRes.data.data || []);
            setUnreadNotifCount(notifRes.data.unreadCount || 0);
          }
          if (convRes?.data?.success) {
            setConversations(convRes.data.data || []);
            setUnreadMsgCount(convRes.data.unreadCount || 0);
          }
        } catch (e) {
          console.error('Header polling error:', e);
        }
      };

      fetchVendorHeaderData();
      const interval = setInterval(fetchVendorHeaderData, 12000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const [touristUnreadMsgCount, setTouristUnreadMsgCount] = useState<number>(0);

  // Poll Tourist Unread Messages
  useEffect(() => {
    if (user?.role === 'TOURIST') {
      const fetchTouristHeaderMsgs = async () => {
        try {
          const res = await api.get('/conversations/me').catch(() => null);
          if (res?.data?.success) {
            setTouristUnreadMsgCount(res.data.unreadCount || 0);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchTouristHeaderMsgs();
      const interval = setInterval(fetchTouristHeaderMsgs, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkNotifRead = async (id: string) => {
    try {
      await api.patch(`/vendors/me/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadNotifCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error('Error marking read:', e);
    }
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled || activeMenu !== null || !isHome
            ? 'glass-header border-b border-brand-brown/10 text-brand-black shadow-sm'
            : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent text-white'
        }`}
      >
        <div className={`w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 h-20 flex items-center justify-between ${
          user?.role === 'VENDOR' ? '' : 'lg:grid lg:grid-cols-[1fr_auto_1fr]'
        }`}>

          {/* Logo */}
          <div className="flex items-center justify-start justify-self-start">
            <Link
              to="/"
              className="font-serif text-3xl font-medium tracking-[0.2em] hover:opacity-90 transition-opacity text-brand-gold flex items-center space-x-2.5 group whitespace-nowrap"
            >
              <SetuLogoMark className="w-7 h-7 text-brand-gold flex-shrink-0 transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(198,155,69,0.4)]" />

              <span className="relative pb-0.5 border-b-2 border-brand-gold/60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] font-serif">
                SETU
              </span>
            </Link>
          </div>

          {/* Primary Nav Links (Hidden for Vendor Users) */}
          {user?.role !== 'VENDOR' && (
            <nav className="hidden lg:flex items-center space-x-8 text-xs sub-nav-label tracking-widest justify-self-center">
              {/* EXPLORE */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === 'explore' ? null : 'explore')
                  }
                  className="flex items-center space-x-1 hover:text-brand-gold transition-colors py-2 focus:outline-none"
                >
                  <span>EXPLORE</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      activeMenu === 'explore'
                        ? 'rotate-180 text-brand-gold'
                        : ''
                    }`}
                  />
                </button>
              </div>

              {/* BOOK */}
              <Link
                to="/offerings"
                className="hover:text-brand-gold transition-colors py-2"
              >
                <span>BOOK</span>
              </Link>

              {/* MAPS */}
              <Link
                to="/maps"
                className="hover:text-brand-gold transition-colors py-2"
              >
                <span>MAPS</span>
              </Link>

              {/* CALENDAR */}
              <Link
                to="/calendar"
                className="hover:text-brand-gold transition-colors py-2"
              >
                <span>CALENDAR</span>
              </Link>

              {/* EXPERIENCE */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveMenu(
                      activeMenu === 'experience' ? null : 'experience'
                    )
                  }
                  className="flex items-center space-x-1 hover:text-brand-gold transition-colors py-2 focus:outline-none"
                >
                  <span>EXPERIENCE</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      activeMenu === 'experience'
                        ? 'rotate-180 text-brand-gold'
                        : ''
                    }`}
                  />
                </button>
              </div>
            </nav>
          )}

          {/* Actions & Vendor Controls */}
          <div className="flex items-center justify-end justify-self-end space-x-2 sm:space-x-3 lg:space-x-4 header-dropdown-container">

            {/* AI Concierge (For Tourist & Visitors) */}
            {(!user || user.role === 'TOURIST') && (
              <button
                onClick={onOpenAi}
                className="h-9 px-3.5 rounded-full border border-brand-gold/70 ring-1 ring-brand-gold/20 bg-gradient-to-r from-brand-gold/25 via-brand-gold/15 to-brand-gold/5 hover:from-brand-gold/40 hover:to-brand-gold/20 text-brand-gold transition-all duration-300 text-xs sub-nav-label flex items-center space-x-2 shadow-[0_0_15px_rgba(198,155,69,0.2)] hover:shadow-[0_0_22px_rgba(198,155,69,0.4)] hover:border-brand-gold group whitespace-nowrap"
                title="Open SETU AI Travel Companion"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                <span className="hidden sm:inline tracking-wider font-semibold">
                  AI CONCIERGE
                </span>
              </button>
            )}

            {/* Vendor Controls Header Suite (Desktop) */}
            {user?.role === 'VENDOR' && (
              <div className="hidden lg:flex items-center space-x-3">

                {/* 1. Notifications Bell Icon */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')}
                    className="p-2 text-brand-gold hover:text-white transition-colors relative focus:outline-none rounded-full hover:bg-white/10"
                    title="Vendor Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown Panel */}
                  {activeDropdown === 'notifications' && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white text-brand-black rounded-xl border border-brand-brown/20 shadow-2xl overflow-hidden z-50 animate-fadeIn">
                      <div className="p-3.5 bg-cream border-b border-brand-brown/15 flex items-center justify-between">
                        <span className="font-serif font-bold text-xs sub-nav-label text-brand-black">NOTIFICATIONS</span>
                        <span className="text-[10px] text-brand-maroon font-bold">{unreadNotifCount} UNREAD</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-brand-brown/10">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-brand-brown/70 font-serif">No notifications yet</div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleMarkNotifRead(n.id)}
                              className={`p-3.5 hover:bg-cream-light transition-colors cursor-pointer text-left space-y-1 ${
                                !n.isRead ? 'bg-cream/60 font-semibold' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-serif font-bold text-brand-black truncate">{n.title}</span>
                                <span className="text-[9px] text-brand-brown/60 shrink-0">
                                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-[11px] text-brand-brown/80 line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <Link
                        to="/vendor/notifications"
                        onClick={() => setActiveDropdown(null)}
                        className="block py-2.5 text-center bg-cream text-[11px] sub-nav-label text-brand-maroon font-bold hover:bg-brand-black hover:text-brand-gold transition-colors border-t border-brand-brown/10"
                      >
                        VIEW ALL NOTIFICATIONS &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                {/* 2. Messages Inbox Icon */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'messages' ? null : 'messages')}
                    className="p-2 text-brand-gold hover:text-white transition-colors relative focus:outline-none rounded-full hover:bg-white/10"
                    title="Tourist Messages Inbox"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {unreadMsgCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                        {unreadMsgCount > 9 ? '9+' : unreadMsgCount}
                      </span>
                    )}
                  </button>

                  {/* Messages Dropdown Panel */}
                  {activeDropdown === 'messages' && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white text-brand-black rounded-xl border border-brand-brown/20 shadow-2xl overflow-hidden z-50 animate-fadeIn">
                      <div className="p-3.5 bg-cream border-b border-brand-brown/15 flex items-center justify-between">
                        <span className="font-serif font-bold text-xs sub-nav-label text-brand-black">TOURIST MESSAGES</span>
                        <span className="text-[10px] text-brand-maroon font-bold">{unreadMsgCount} UNREAD</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-brand-brown/10">
                        {conversations.length === 0 ? (
                          <div className="p-6 text-center text-xs text-brand-brown/70 font-serif">No messages yet</div>
                        ) : (
                          conversations.slice(0, 5).map((conv) => (
                            <Link
                              key={conv.id}
                              to="/vendor/messages"
                              onClick={() => setActiveDropdown(null)}
                              className="p-3.5 hover:bg-cream-light transition-colors block text-left space-y-1"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-serif font-bold text-brand-black truncate">{conv.touristUser?.name}</span>
                                <span className="text-[9px] text-brand-brown/60 shrink-0">
                                  {conv.messages[0] ? formatDistanceToNow(new Date(conv.messages[0].createdAt), { addSuffix: true }) : ''}
                                </span>
                              </div>
                              <p className="text-[11px] text-brand-brown/80 truncate">
                                {conv.messages[0] ? conv.messages[0].content : 'No message'}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>
                      <Link
                        to="/vendor/messages"
                        onClick={() => setActiveDropdown(null)}
                        className="block py-2.5 text-center bg-cream text-[11px] sub-nav-label text-brand-maroon font-bold hover:bg-brand-black hover:text-brand-gold transition-colors border-t border-brand-brown/10"
                      >
                        VIEW ALL MESSAGES &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                {/* 3. REVIEW STOREFRONT Outlined Button */}
                <Link
                  to="/vendor/storefront-preview"
                  className="px-3 py-1.5 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all rounded text-xs sub-nav-label flex items-center space-x-1.5 font-bold tracking-wider"
                  title="Preview Your Public Storefront"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>REVIEW STOREFRONT</span>
                </Link>

                {/* 4. VENDOR PORTAL Badge */}
                <Link
                  to="/vendor/dashboard"
                  className="flex items-center space-x-1 text-xs sub-nav-label text-amber-700 hover:text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-bold"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>VENDOR PORTAL</span>
                </Link>
              </div>
            )}

            {/* Admin Badge */}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center space-x-1 text-xs sub-nav-label text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>ADMIN</span>
              </Link>
            )}

            {/* 5. User Profile Avatar & Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
                  className="flex items-center space-x-2 text-xs sub-nav-label hover:text-brand-gold transition-colors focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-brown text-cream flex items-center justify-center text-xs font-semibold border border-brand-gold/40">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-brand-gold" />
                </button>

                {/* Profile Dropdown Menu */}
                {activeDropdown === 'profile' && (
                  <div className="absolute right-0 mt-3 w-56 bg-white text-brand-black rounded-xl border border-brand-brown/20 shadow-2xl overflow-hidden z-50 animate-fadeIn text-xs">
                    <div className="p-3 bg-cream border-b border-brand-brown/10">
                      <p className="font-serif font-bold text-brand-black text-sm truncate">{user.name}</p>
                      <p className="text-[10px] text-brand-brown truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      {user.role === 'TOURIST' ? (
                        <>
                          <Link
                            to="/account"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center space-x-2 px-4 py-2.5 hover:bg-cream transition-colors text-brand-black"
                          >
                            <UserCheck className="w-4 h-4 text-brand-gold" />
                            <span>My Profile & Bookings</span>
                          </Link>
                          <Link
                            to="/account/messages"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-cream transition-colors text-brand-black"
                          >
                            <span className="flex items-center space-x-2">
                              <MessageSquare className="w-4 h-4 text-brand-gold" />
                              <span>My Vendor Messages</span>
                            </span>
                            {touristUnreadMsgCount > 0 && (
                              <span className="bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full">
                                {touristUnreadMsgCount}
                              </span>
                            )}
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/account"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center space-x-2 px-4 py-2.5 hover:bg-cream transition-colors text-brand-black"
                          >
                            <UserCheck className="w-4 h-4 text-brand-gold" />
                            <span>Business Profile</span>
                          </Link>
                        </>
                      )}
                      <Link
                        to="/account"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center space-x-2 px-4 py-2.5 hover:bg-cream transition-colors text-brand-black"
                      >
                        <Settings className="w-4 h-4 text-brand-gold" />
                        <span>Account Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-brand-brown/10 pt-1 pb-1">
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          logout();
                        }}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2.5 hover:bg-red-50 text-red-700 transition-colors font-bold sub-nav-label"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span>SIGN OUT</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-xs sub-nav-label px-4 py-2 border border-brand-gold/60 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all rounded-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>SIGN IN</span>
              </Link>
            )}

            {/* Mobile Drawer Trigger & Combined Alerts Badge (Mobile) */}
            <div className="flex items-center space-x-2 lg:hidden">
              {user?.role === 'VENDOR' && (unreadNotifCount > 0 || unreadMsgCount > 0) && (
                <Link
                  to="/vendor/notifications"
                  className="p-1.5 text-brand-gold relative"
                  title="Unread Alerts"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                    {unreadNotifCount + unreadMsgCount}
                  </span>
                </Link>
              )}

              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="p-2 hover:opacity-80 transition-opacity"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menus */}
        {activeMenu === 'explore' && (
          <MegaMenuExplore onClose={() => setActiveMenu(null)} />
        )}
        {activeMenu === 'experience' && (
          <MegaMenuExperience onClose={() => setActiveMenu(null)} />
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onOpenAi={onOpenAi}
      />
    </>
  );
};