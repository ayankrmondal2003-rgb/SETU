import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Offering } from '../../types';
import { MapPin, Clock, Users, CalendarDays, MessageSquare } from 'lucide-react';
import { TouristChatDrawer } from '../../components/common/TouristChatDrawer';

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

export const OfferingDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [offering, setOffering] = useState<Offering | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    async function loadOffering() {
      try {
        const res = await api.get(`/offerings/${slug}`);
        if (res.data.success) setOffering(res.data.data);
      } catch (err) {
        console.error('Error loading offering:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOffering();
  }, [slug]);

  const handleBookAndPay = async () => {
    if (!user) {
      showToast('Please sign in to book this experience', 'error');
      navigate('/login');
      return;
    }
    if (!bookingDate) {
      showToast('Please select a booking date', 'error');
      return;
    }
    if (!offering) return;

    setSubmitting(true);
    try {
      // Step 1: create local order + Razorpay order (existing backend flow)
      const orderRes = await api.post('/orders', {
        offeringId: offering.id,
        quantity,
        bookingDate
      });

      if (!orderRes.data.success) {
        showToast('Could not start booking. Please try again.', 'error');
        setSubmitting(false);
        return;
      }

      const { data: order, razorpay: rzp } = orderRes.data;

      // Step 2: load Razorpay Checkout
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showToast('Failed to load payment gateway. Check your connection.', 'error');
        setSubmitting(false);
        return;
      }

      const options = {
        key: rzp.key,
        amount: rzp.amount,
        currency: rzp.currency,
        name: 'SETU — Bihar Tourism',
        description: offering.title,
        order_id: rzp.orderId,
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: { color: '#7a1f2b' },
        handler: async (response: any) => {
          // Step 3: verify payment against existing backend flow
          try {
            const verifyRes = await api.post('/payments/verify', {
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              showToast('Booking confirmed! Payment verified.', 'success');
              navigate('/account');
            } else {
              showToast('Payment verification failed.', 'error');
            }
          } catch (err: any) {
            showToast(err.response?.data?.error || 'Payment verification failed.', 'error');
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false)
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to start booking', 'error');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="pt-32 pb-24 text-center font-serif text-brand-brown">Loading offering...</p>;
  }

  if (!offering) {
    return (
      <div className="pt-32 pb-24 text-center space-y-3">
        <h2 className="text-2xl font-serif text-brand-black">Offering Not Found</h2>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-6">
        <img src={offering.coverImage} alt={offering.title} className="w-full h-80 object-cover rounded" />
        <div className="space-y-3">
          <span className="text-xs sub-nav-label text-brand-maroon uppercase">{offering.category}</span>
          <h1 className="text-3xl font-serif text-brand-black">{offering.title}</h1>
          <div className="flex items-center space-x-5 text-xs font-sans text-brand-brown">
            <span className="flex items-center space-x-1"><MapPin className="w-4 h-4" /><span>{offering.location}</span></span>
            <span className="flex items-center space-x-1"><Clock className="w-4 h-4" /><span>{offering.duration}</span></span>
            <span className="flex items-center space-x-1"><Users className="w-4 h-4" /><span>Up to {offering.maxGuests} guests</span></span>
          </div>
          <p className="text-sm font-serif text-brand-black/80 leading-relaxed pt-2">{offering.description}</p>
        </div>
        {offering.gallery && offering.gallery.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-[10px] sub-nav-label text-brand-maroon uppercase font-bold">EXPERIENCE PHOTO GALLERY</span>
            <div className="grid grid-cols-3 gap-3">
              {offering.gallery.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-brand-brown/15 shadow-sm group">
                  <img
                    src={img}
                    alt={`${offering.title} photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {offering.vendor && (
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/40 shadow-sm space-y-2">
            <span className="text-[10px] sub-nav-label text-brand-brown/70 font-bold block">VERIFIED LOCAL HOST</span>
            <p className="font-serif text-xl font-bold text-brand-black">{offering.vendor.businessName}</p>
            <p className="text-xs font-serif text-brand-black/75 leading-relaxed">{offering.vendor.description}</p>
          </div>
        )}
      </div>

      <div className="lg:col-span-4">
        <div className="bg-white p-6 rounded border border-brand-brown/15 shadow-sm space-y-5 lg:sticky lg:top-28">
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-brand-black">₹{offering.price.toLocaleString('en-IN')}</span>
            <span className="text-xs font-sans text-brand-brown">per guest</span>
          </div>

          <div>
            <label className="block text-xs sub-nav-label text-brand-maroon mb-2 flex items-center space-x-1">
              <CalendarDays className="w-3.5 h-3.5" /><span>BOOKING DATE</span>
            </label>
            <input
              type="date"
              value={bookingDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full bg-cream border border-brand-brown/20 rounded p-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs sub-nav-label text-brand-maroon mb-2">GUESTS</label>
            <input
              type="number"
              min={1}
              max={offering.maxGuests}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-cream border border-brand-brown/20 rounded p-2.5 text-sm text-brand-black focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="pt-3 border-t border-brand-brown/10 flex items-center justify-between text-sm font-sans">
            <span className="text-brand-brown">Total</span>
            <span className="font-serif text-xl font-bold text-brand-black">₹{(offering.price * quantity).toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={handleBookAndPay}
            disabled={submitting}
            className="w-full py-3.5 bg-brand-black text-brand-gold font-sans text-xs sub-nav-label tracking-widest rounded hover:bg-brand-maroon hover:text-white transition-all disabled:opacity-50"
          >
            {submitting ? 'PROCESSING...' : 'BOOK & PAY WITH RAZORPAY'}
          </button>

          {/* Message Vendor Inquiry Button */}
          {offering.vendor && (
            <button
              onClick={() => {
                if (!user) {
                  navigate(`/login?redirect=${encodeURIComponent(`/offerings/${offering.slug}`)}`);
                  return;
                }
                setChatOpen(true);
              }}
              className="w-full py-3 border border-brand-brown/30 text-brand-black hover:border-brand-maroon hover:text-brand-maroon font-sans text-xs sub-nav-label tracking-widest rounded transition-all flex items-center justify-center space-x-2 bg-cream/50"
            >
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <span>MESSAGE VENDOR INQUIRY</span>
            </button>
          )}
        </div>
      </div>

      {/* Tourist Chat Drawer Modal */}
      {offering.vendor && (
        <TouristChatDrawer
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          vendorId={offering.vendorId}
          vendorName={offering.vendor.businessName || 'Vendor Host'}
          vendorLogo={offering.vendor.logo || ''}
          initialOfferingTitle={offering.title}
        />
      )}
    </div>
  );
};
