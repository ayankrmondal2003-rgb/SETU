import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import { Order, Favorite } from '../../types';
import { User, Calendar, CreditCard, Heart, LogOut, Ticket, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { FavoriteButton } from '../../components/common/FavoriteButton';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const AccountPage: React.FC = () => {
  const { user, logout, refreshMe } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'favorites' | 'premium'>('bookings');
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  const loadUserData = async () => {
    try {
      const [ordRes, favRes] = await Promise.all([
        api.get('/orders'),
        api.get('/favorites')
      ]);
      if (ordRes.data.success) setOrders(ordRes.data.data);
      if (favRes.data.success) setFavorites(favRes.data.data);
    } catch (err) {
      console.error('Error loading account data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadUserData();
  }, [user]);

  const handleSubscribe = async () => {
    if (!user) return;
    setSubscribing(true);
    try {
      const subRes = await api.post('/payments/premium/subscribe');
      if (!subRes.data.success) {
        showToast('Could not start SETU Plus checkout.', 'error');
        setSubscribing(false);
        return;
      }
      const { subscriptionId, key } = subRes.data.razorpay;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showToast('Failed to load payment gateway. Check your connection.', 'error');
        setSubscribing(false);
        return;
      }

      const options = {
        key,
        subscription_id: subscriptionId,
        name: 'SETU Plus',
        description: 'Premium Membership — ₹99/month',
        prefill: { name: user.name, email: user.email },
        theme: { color: '#7a1f2b' },
        handler: async (response: any) => {
          try {
            const verifyRes = await api.post('/payments/premium/verify', {
              razorpaySubscriptionId: response.razorpay_subscription_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            if (verifyRes.data.success) {
              showToast('Welcome to SETU Plus!', 'success');
              await refreshMe();
            } else {
              showToast('Subscription verification failed.', 'error');
            }
          } catch (err: any) {
            showToast(err.response?.data?.error || 'Subscription verification failed.', 'error');
          } finally {
            setSubscribing(false);
          }
        },
        modal: { ondismiss: () => setSubscribing(false) }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to start SETU Plus checkout', 'error');
      setSubscribing(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-32 pb-24 text-center space-y-4">
        <h2 className="text-3xl font-serif text-brand-black">Please Sign In</h2>
        <p className="text-sm font-serif text-brand-brown">You need to be authenticated to view your account dashboard.</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto my-6 bg-cream/85 backdrop-blur-sm rounded-2xl border border-brand-brown/15 p-4 sm:p-6 md:p-10 shadow-lg space-y-8">
      {/* Account Profile Header */}
      <div className="bg-cream p-5 sm:p-8 rounded border border-brand-brown/15 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-full bg-brand-brown text-cream flex items-center justify-center font-serif text-2xl font-bold border-2 border-brand-gold shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-brand-black">{user.name}</h1>
            <p className="text-xs font-sans text-brand-brown/80">{user.email} &bull; Role: <span className="font-semibold text-brand-maroon">{user.role}</span></p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-2 text-xs sub-nav-label px-4 py-2.5 bg-brand-black text-brand-gold rounded hover:bg-brand-maroon hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>SIGN OUT</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-brand-brown/15 gap-4 sm:space-x-8">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 sub-nav-label text-xs tracking-widest border-b-2 transition-all ${
            activeTab === 'bookings' ? 'border-brand-maroon text-brand-black font-bold' : 'border-transparent text-brand-black/60'
          }`}
        >
          MY BOOKINGS ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-3 sub-nav-label text-xs tracking-widest border-b-2 transition-all ${
            activeTab === 'favorites' ? 'border-brand-maroon text-brand-black font-bold' : 'border-transparent text-brand-black/60'
          }`}
        >
          SAVED FAVORITES ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 sub-nav-label text-xs tracking-widest border-b-2 transition-all ${
            activeTab === 'profile' ? 'border-brand-maroon text-brand-black font-bold' : 'border-transparent text-brand-black/60'
          }`}
        >
          PROFILE SETTINGS
        </button>
        <button
          onClick={() => setActiveTab('premium')}
          className={`py-3 sub-nav-label text-xs tracking-widest border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'premium' ? 'border-brand-maroon text-brand-black font-bold' : 'border-transparent text-brand-black/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>SETU PLUS</span>
        </button>
      </div>

      {/* Tab Panel */}
      <div>
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {loading ? (
              <p className="font-serif text-brand-brown text-center py-10">Loading bookings...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded border border-brand-brown/15 space-y-3">
                <Ticket className="w-10 h-10 text-brand-gold mx-auto" />
                <h3 className="font-serif text-xl text-brand-black">No Active Bookings</h3>
                <p className="text-xs font-serif text-brand-brown/70">Explore tourist offerings and book guided Bihar tours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded border border-brand-brown/15 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs text-brand-maroon font-bold">{order.orderNumber}</span>
                        <span className={`text-[10px] sub-nav-label px-2.5 py-0.5 rounded ${
                          order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] sub-nav-label px-2.5 py-0.5 rounded bg-cream text-brand-black">
                          {order.orderStatus}
                        </span>
                      </div>
                      <h4 className="font-serif text-xl text-brand-black font-semibold">{order.offering?.title || 'Tour Experience'}</h4>
                      <p className="text-xs font-sans text-brand-brown">Vendor: {order.vendor?.businessName || 'Setu Heritage'} &bull; Date: {new Date(order.bookingDate).toLocaleDateString()}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="font-serif text-2xl font-bold text-brand-black">₹{order.amount.toLocaleString('en-IN')}</span>
                      <span className="block text-[10px] sub-nav-label text-brand-brown/70">{order.quantity} Guest(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded border border-brand-brown/15 space-y-2">
                <Heart className="w-8 h-8 text-brand-maroon mx-auto" />
                <p className="text-sm font-serif text-brand-brown">No saved destinations or events in your favorites list yet.</p>
              </div>
            ) : (
              favorites.map((fav) => {
                const isEvent = !!fav.event;
                const title = fav.destination?.name || fav.event?.title || 'Saved Item';
                const category = fav.destination?.category || fav.event?.category || 'Heritage';
                const link = fav.destination
                  ? `/explore/destinations/${fav.destination.slug}`
                  : `/experience/${fav.event?.category ? fav.event.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'cultural'}/${fav.event?.slug}`;
                const targetId = fav.destinationId || fav.eventId || '';

                return (
                  <div key={fav.id} className="bg-white p-5 rounded-xl border border-brand-brown/15 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] sub-nav-label px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          isEvent
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {isEvent ? '🎪 EVENT / FESTIVAL' : '🏛️ DESTINATION'}
                        </span>
                        <span className="text-[10px] sub-nav-label text-brand-brown/70">{category}</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-brand-black">{title}</h4>
                      <p className="text-xs font-sans text-brand-brown/80 line-clamp-2 mt-1">
                        {fav.destination?.description || fav.event?.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-brand-brown/10 flex items-center justify-between">
                      <Link
                        to={link}
                        className="text-xs sub-nav-label text-brand-maroon font-semibold hover:underline flex items-center space-x-1"
                      >
                        <span>VIEW {isEvent ? 'EVENT' : 'DESTINATION'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <FavoriteButton
                        targetType={isEvent ? 'event' : 'destination'}
                        targetId={targetId}
                        initialIsFavorite={true}
                        onToggle={() => loadUserData()}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'premium' && (
          <div className="bg-white p-8 rounded border border-brand-brown/15 max-w-xl space-y-5">
            {user.isPremium ? (
              <>
                <div className="flex items-center space-x-2 text-brand-maroon">
                  <Sparkles className="w-5 h-5 text-brand-gold" />
                  <h3 className="sub-nav-label">SETU PLUS — ACTIVE</h3>
                </div>
                <p className="text-sm font-serif text-brand-black/80">
                  You have full access to the SETU AI Companion, including multi-day itineraries, local insider tips, and premium experience recommendations.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 text-brand-black">
                  <Sparkles className="w-5 h-5 text-brand-gold" />
                  <h3 className="sub-nav-label">UPGRADE TO SETU PLUS</h3>
                </div>
                <p className="text-sm font-serif text-brand-black/80">
                  Unlock the full SETU AI Companion — multi-day personalized itineraries, local insider tips, food recommendations, and smart circuit planning.
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="font-serif text-3xl font-bold text-brand-black">₹99</span>
                  <span className="text-xs font-sans text-brand-brown">/ month</span>
                </div>
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="px-6 py-3 bg-brand-black text-brand-gold sub-nav-label text-xs tracking-widest rounded hover:bg-brand-maroon hover:text-white transition-all disabled:opacity-50"
                >
                  {subscribing ? 'PROCESSING...' : 'SUBSCRIBE WITH RAZORPAY'}
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded border border-brand-brown/15 max-w-xl space-y-6">
            <h3 className="sub-nav-label text-brand-maroon">PERSONAL INFORMATION</h3>
            <div className="space-y-4 text-sm font-sans">
              <div>
                <label className="block text-xs sub-nav-label text-brand-black/70 mb-1">FULL NAME</label>
                <input type="text" readOnly value={user.name} className="w-full bg-cream p-3 rounded text-brand-black font-semibold border border-brand-brown/15" />
              </div>
              <div>
                <label className="block text-xs sub-nav-label text-brand-black/70 mb-1">EMAIL ADDRESS</label>
                <input type="email" readOnly value={user.email} className="w-full bg-cream p-3 rounded text-brand-black font-semibold border border-brand-brown/15" />
              </div>
              <div>
                <label className="block text-xs sub-nav-label text-brand-black/70 mb-1">PHONE NUMBER</label>
                <input type="text" readOnly value={user.phone || 'Not set'} className="w-full bg-cream p-3 rounded text-brand-black font-semibold border border-brand-brown/15" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
