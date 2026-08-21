import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Offering } from '../../types';
import { MapPin, Phone, Mail, Store, Clock, Award, ShieldCheck, ExternalLink, MessageSquare } from 'lucide-react';
import { TouristChatDrawer } from '../../components/common/TouristChatDrawer';

interface VendorStorefrontData {
  id: string;
  businessName: string;
  description: string;
  businessType: string;
  city: string;
  district: string;
  logo?: string;
  coverImage?: string;
  phone?: string;
  email?: string;
  status: string;
  offerings: Offering[];
}

export const VendorStorefrontPage: React.FC<{ isPreview?: boolean }> = ({ isPreview = false }) => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [storefront, setStorefront] = useState<VendorStorefrontData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    async function loadStorefront() {
      setLoading(true);
      setError('');
      try {
        const endpoint = isPreview ? '/vendors/me/storefront' : `/vendors/public/storefront/${slug}`;
        const res = await api.get(endpoint);
        if (res.data.success) {
          setStorefront(res.data.data);
        }
      } catch (err: any) {
        console.error('Error loading storefront:', err);
        setError(err.response?.data?.message || 'Failed to load storefront');
      } finally {
        setLoading(false);
      }
    }
    loadStorefront();
  }, [slug, isPreview]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center space-y-3 font-serif text-brand-brown">
        <div className="w-8 h-8 border-3 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Loading vendor storefront...</p>
      </div>
    );
  }

  if (error || !storefront) {
    return (
      <div className="pt-32 pb-24 max-w-xl mx-auto px-6 text-center space-y-4 font-sans">
        <div className="bg-cream/90 border border-brand-brown/20 p-8 rounded-xl space-y-3">
          <h2 className="font-serif text-2xl text-brand-black">Storefront Not Found</h2>
          <p className="text-sm font-serif text-brand-brown">{error || 'The requested vendor profile does not exist or is not public.'}</p>
          <Link to="/" className="inline-block px-5 py-2.5 bg-brand-black text-brand-gold sub-nav-label text-xs tracking-widest rounded">
            RETURN TO HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 font-sans">
      {/* Preview Mode Banner */}
      {isPreview && (
        <div className="bg-brand-black text-brand-gold py-2.5 px-6 text-center text-xs sub-nav-label tracking-widest flex items-center justify-center space-x-2 border-b border-brand-gold/30">
          <ShieldCheck className="w-4 h-4 text-brand-gold" />
          <span>STOREFRONT PREVIEW MODE — THIS IS HOW TOURISTS VIEW YOUR PUBLIC BUSINESS PROFILE</span>
        </div>
      )}

      {/* Cover Image Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-brand-black">
        <img
          src={storefront.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
          alt={storefront.businessName}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 -mt-20 relative z-10 space-y-10">
        {/* Vendor Header Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-brown/20 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-brand-black text-brand-gold flex items-center justify-center font-serif text-3xl font-bold border-2 border-brand-gold shadow-md overflow-hidden shrink-0">
              {storefront.logo ? (
                <img src={storefront.logo} alt={storefront.businessName} className="w-full h-full object-cover" />
              ) : (
                <Store className="w-10 h-10 text-brand-gold" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-black">{storefront.businessName}</h1>
                <span className="text-[10px] sub-nav-label bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                  VERIFIED LOCAL VENDOR
                </span>
              </div>
              <p className="text-xs sub-nav-label text-brand-maroon tracking-wider">{storefront.businessType.toUpperCase()}</p>
              <div className="flex items-center space-x-4 text-xs text-brand-brown pt-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{storefront.city}, {storefront.district}</span>
                </span>
                {storefront.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{storefront.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {isPreview ? (
              <Link
                to="/account"
                className="w-full md:w-auto text-center px-5 py-3 bg-brand-black text-brand-gold sub-nav-label text-xs tracking-widest rounded-lg hover:bg-brand-maroon hover:text-white transition-all shadow-md"
              >
                EDIT VENDOR PROFILE
              </Link>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (!user) {
                      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                      return;
                    }
                    setChatOpen(true);
                  }}
                  className="w-full sm:w-auto text-center px-5 py-3 bg-brand-black text-brand-gold sub-nav-label text-xs tracking-widest rounded-lg hover:bg-brand-maroon hover:text-white transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4 text-brand-gold" />
                  <span>MESSAGE VENDOR</span>
                </button>
                {storefront.phone && (
                  <a
                    href={`tel:${storefront.phone}`}
                    className="w-full sm:w-auto text-center px-5 py-3 bg-cream border border-brand-brown/30 text-brand-black sub-nav-label text-xs tracking-widest rounded-lg hover:bg-brand-brown hover:text-white transition-all shadow-sm flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>CALL HOST</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tourist Chat Drawer Modal */}
        {storefront && (
          <TouristChatDrawer
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            vendorId={storefront.id}
            vendorName={storefront.businessName}
            vendorLogo={storefront.logo}
          />
        )}

        {/* Overview & Active Offerings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Vendor Bio */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-cream/90 p-6 rounded-xl border border-brand-brown/15 shadow-sm space-y-4">
              <h3 className="sub-nav-label text-brand-black font-bold">ABOUT THE VENDOR</h3>
              <p className="text-sm font-serif text-brand-black/80 leading-relaxed">
                {storefront.description || 'Verified local tourism service provider in Bihar offering authentic tours, stays, and cultural experiences.'}
              </p>
              <div className="border-t border-brand-brown/10 pt-4 space-y-2 text-xs font-sans text-brand-brown">
                <div className="flex justify-between">
                  <span className="font-semibold text-brand-black">Base Location:</span>
                  <span>{storefront.city}, Bihar</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brand-black">Category:</span>
                  <span>{storefront.businessType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-brand-black">Active Experiences:</span>
                  <span className="font-bold text-brand-maroon">{storefront.offerings?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Active Offerings */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-b border-brand-brown/15 pb-4 flex items-center justify-between">
              <h2 className="text-2xl font-serif text-brand-black">Curated Offerings ({storefront.offerings?.length || 0})</h2>
              <span className="text-xs sub-nav-label text-brand-brown">DIRECT BOOKING VERIFIED</span>
            </div>

            {(!storefront.offerings || storefront.offerings.length === 0) ? (
              <div className="bg-white/80 p-8 rounded-xl border border-brand-brown/15 text-center text-brand-brown space-y-2">
                <p className="font-serif">No active offerings currently published by this vendor.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {storefront.offerings.map((off) => (
                  <Link
                    key={off.id}
                    to={`/offerings/${off.slug}`}
                    className="bg-white border border-brand-brown/15 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all block group"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={off.coverImage}
                        alt={off.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[10px] sub-nav-label bg-brand-black/80 text-brand-gold px-2.5 py-1 rounded-full font-bold uppercase">
                        {off.category}
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-serif text-lg text-brand-black font-bold group-hover:text-brand-maroon transition-colors line-clamp-2">
                        {off.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-brand-brown">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{off.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{off.duration}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-brand-brown/10">
                        <span className="font-serif text-xl font-bold text-brand-black">₹{off.price.toLocaleString('en-IN')}</span>
                        <span className="text-xs sub-nav-label text-brand-maroon font-semibold flex items-center space-x-1">
                          <span>BOOK NOW</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
