import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Bell, CheckCircle2, Clock, Calendar, DollarSign, Award, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  relatedOrderId?: string;
  isRead: boolean;
  createdAt: string;
}

export const VendorNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const loadNotifications = async () => {
    try {
      const res = await api.get('/vendors/me/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/vendors/me/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => api.patch(`/vendors/me/notifications/${n.id}/read`)));
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filtered = filter === 'UNREAD' ? notifications.filter(n => !n.isRead) : notifications;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'booking_new':
        return <Calendar className="w-5 h-5 text-brand-gold shrink-0" />;
      case 'payment_credited':
        return <DollarSign className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'offering_approved':
        return <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-brand-maroon shrink-0" />;
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-brown/15 pb-6">
        <div>
          <span className="sub-nav-label text-brand-maroon">VENDOR PORTAL</span>
          <h1 className="text-3xl font-serif text-brand-black font-bold">Vendor Notifications</h1>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs sub-nav-label px-4 py-2 bg-cream border border-brand-brown/20 text-brand-black rounded hover:bg-brand-black hover:text-brand-gold transition-all"
          >
            MARK ALL AS READ
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-3 border-b border-brand-brown/10 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`text-xs sub-nav-label px-4 py-2 rounded transition-all ${
            filter === 'ALL' ? 'bg-brand-black text-brand-gold font-bold' : 'text-brand-black/70 hover:text-brand-black'
          }`}
        >
          ALL ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`text-xs sub-nav-label px-4 py-2 rounded transition-all ${
            filter === 'UNREAD' ? 'bg-brand-black text-brand-gold font-bold' : 'text-brand-black/70 hover:text-brand-black'
          }`}
        >
          UNREAD ({notifications.filter(n => !n.isRead).length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-brand-brown font-serif">Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-cream/80 p-12 rounded-xl border border-brand-brown/15 text-center space-y-3">
          <Bell className="w-8 h-8 text-brand-brown/40 mx-auto" />
          <h3 className="font-serif text-xl text-brand-black">No notifications found</h3>
          <p className="text-sm font-serif text-brand-brown/80">You're all caught up! New order and account updates will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.isRead && handleMarkRead(item.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex items-start space-x-4 ${
                item.isRead
                  ? 'bg-white/80 border-brand-brown/15 opacity-80'
                  : 'bg-cream border-brand-gold/60 shadow-sm ring-1 ring-brand-gold/20'
              }`}
            >
              <div className="p-2.5 bg-white rounded-lg border border-brand-brown/10 shadow-xs">
                {getIconForType(item.type)}
              </div>
              <div className="flex-grow space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-brand-black text-base">{item.title}</h4>
                  <span className="text-[10px] text-brand-brown/60 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                  </span>
                </div>
                <p className="text-xs font-serif text-brand-black/80 leading-relaxed">{item.message}</p>
              </div>
              {!item.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-brand-maroon shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
