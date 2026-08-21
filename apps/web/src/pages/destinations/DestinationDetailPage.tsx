import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, ArrowLeft, Eye, Star, Info, Compass, CheckCircle2, Ticket,
  Clock, Calendar, Navigation, Sparkles, HelpCircle, ShieldCheck, AlertTriangle
} from 'lucide-react';
import api from '../../api/client';
import { Destination } from '../../types';
import { TabView, TabItem } from '../../components/common/TabView';
import { Lightbox } from '../../components/common/Lightbox';
import { SpotInteractiveMap } from '../../components/tourism/SpotInteractiveMap';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { PhotoMosaic } from '../../components/common/PhotoMosaic';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadDestination() {
      setLoading(true);
      try {
        const res = await api.get(`/destinations/${slug}`);
        if (res.data.success) {
          setDestination(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load destination detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDestination();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center font-serif space-y-3">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-brand-brown text-sm">Loading rich travel guide...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="pt-32 pb-24 text-center space-y-4">
        <h2 className="text-3xl font-serif text-brand-black">Destination Guide Not Found</h2>
        <Link to="/explore/destinations" className="text-brand-maroon underline sub-nav-label">Return to All Destinations</Link>
      </div>
    );
  }

  const galleryImages = (destination.gallery && destination.gallery.length > 0)
    ? destination.gallery
    : [];

  const travelInfo = destination.travelInformation || {};
  const isVerified = travelInfo.contentStatus === 'VERIFIED';
  const nearbyAttractions = destination.nearbyDestinations || [];

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'OVERVIEW & HISTORY',
      content: (
        <div className="space-y-8 font-serif leading-relaxed text-brand-black/90">
          {/* Main Story Text */}
          <div className="space-y-4 text-base md:text-lg">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-brand-maroon first-letter:float-left first-letter:mr-3 leading-relaxed">
              {destination.overview}
            </p>
            <p className="text-sm md:text-base text-brand-brown/90 leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Callout Box */}
          <div className="bg-amber-900 text-cream p-6 md:p-8 rounded-xl border-2 border-brand-gold shadow-lg space-y-3">
            <div className="flex items-center space-x-3 text-brand-gold font-bold text-xs sub-nav-label tracking-widest">
              <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
              <span>DID YOU KNOW? / क्या आप जानते हैं?</span>
            </div>
            <p className="font-serif text-lg md:text-xl leading-relaxed text-white">
              "{travelInfo.didYouKnow || 'This ancient heritage site has served as a cultural and spiritual beacon for over two millennia.'}"
            </p>
          </div>

          {/* Key Heritage Highlights */}
          <div className="bg-cream p-6 rounded-xl border border-brand-brown/15 space-y-4">
            <h4 className="sub-nav-label text-brand-maroon text-xs tracking-wider">HERITAGE HIGHLIGHTS & ARCHITECTURE</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
              <div className="bg-white p-4 rounded-lg border border-brand-brown/10 shadow-sm space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-[10px]">
                  1
                </span>
                <p className="text-brand-black font-medium leading-normal">
                  UNESCO & Archaeological Survey of India (ASI) protected heritage monument.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-brand-brown/10 shadow-sm space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-[10px]">
                  2
                </span>
                <p className="text-brand-black font-medium leading-normal">
                  Authentic ancient brick and stone masonry reflecting Mauryan & Gupta period craft.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-brand-brown/10 shadow-sm space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-[10px]">
                  3
                </span>
                <p className="text-brand-black font-medium leading-normal">
                  Guided pilgrimage pathways with certified local heritage scholars available on site.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="bg-white p-6 rounded-xl border border-brand-brown/15 space-y-4">
            <h4 className="sub-nav-label text-brand-maroon text-xs">SITE SPECIFICATIONS</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div>
                <span className="text-brand-brown/70 block text-[10px] sub-nav-label">DISTRICT</span>
                <span className="font-bold text-brand-black text-sm">{destination.district?.name || 'Bihar'}</span>
              </div>
              <div>
                <span className="text-brand-brown/70 block text-[10px] sub-nav-label">CATEGORY</span>
                <span className="font-bold text-brand-black text-sm">{destination.category}</span>
              </div>
              <div>
                <span className="text-brand-brown/70 block text-[10px] sub-nav-label">CIRCUIT TRAIL</span>
                <span className="font-bold text-brand-black text-sm">{destination.circuit?.name || 'Heritage Trail'}</span>
              </div>
              <div>
                <span className="text-brand-brown/70 block text-[10px] sub-nav-label">GPS COORDINATES</span>
                <span className="font-mono text-brand-black">{destination.latitude.toFixed(4)}° N, {destination.longitude.toFixed(4)}° E</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'map',
      label: 'INTERACTIVE MAP & NEARBY STAYS',
      content: (
        <div className="space-y-4">
          <SpotInteractiveMap
            destination={destination}
            vendors={destination.nearbyVendors || []}
          />
        </div>
      )
    },
    {
      id: 'gallery',
      label: `PHOTO GALLERY (${galleryImages.length})`,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="sub-nav-label text-brand-maroon text-xs">PHOTOGRAPHIC COLLECTION ({galleryImages.length})</span>
            {galleryImages.length > 0 && <span className="text-xs text-brand-brown font-sans">Click image to enlarge</span>}
          </div>

          {galleryImages.length > 0 ? (
            <PhotoMosaic
              images={galleryImages}
              altPrefix={destination.name}
              onImageClick={(idx) => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
            />
          ) : (
            <div className="bg-white p-8 rounded-xl border border-brand-brown/15 text-center text-brand-brown/70 font-serif">
              No photo gallery images available for this destination.
            </div>
          )}
        </div>
      )
    },
    {
      id: 'insider-tips',
      label: 'INSIDER TIPS & ACCOMMODATION',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stays Column */}
          <div className="space-y-4">
            <h4 className="sub-nav-label text-brand-maroon text-xs">RECOMMENDED STAYS NEAR SITE</h4>
            <div className="space-y-3">
              {destination.stays && destination.stays.length > 0 ? (
                destination.stays.map((stay: any, idx: number) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-brand-brown/15 flex items-center justify-between shadow-sm">
                    <div>
                      <h5 className="font-serif text-base text-brand-black font-bold">{stay.name}</h5>
                      <div className="flex items-center space-x-1 text-xs text-amber-500 mt-1 font-sans">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold">{stay.rating} / 5</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-lg font-bold text-brand-maroon">{stay.price}</span>
                      <span className="block text-[10px] sub-nav-label text-brand-brown/60">PER NIGHT</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-serif text-brand-brown/70">Check interactive map tab for certified nearby hotel listings.</p>
              )}
            </div>
          </div>

          {/* Recommendations Column */}
          <div className="space-y-4">
            <h4 className="sub-nav-label text-brand-maroon text-xs">LOCAL INSIDER ADVICE</h4>
            <div className="bg-cream p-6 rounded-xl border border-brand-brown/15 space-y-3">
              <ul className="space-y-3 font-serif text-sm text-brand-black/85">
                {destination.recommendations && destination.recommendations.length > 0 ? (
                  destination.recommendations.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))
                ) : (
                  <li>No specific recommendations listed.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="pt-24 pb-24 bg-cream-light">
      {/* 1. HERO BANNER */}
      <div className="relative h-[65vh] min-h-[440px] w-full bg-brand-black text-white overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover opacity-50 scale-105"
          style={{ transition: 'transform 10s ease-out' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/40 to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 space-y-4">
          <Link
            to="/explore/destinations"
            className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-gold hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ALL DESTINATIONS</span>
          </Link>

          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            <span className="text-xs sub-nav-label bg-brand-gold text-brand-black px-3 py-1 rounded font-bold">
              {destination.category}
            </span>
            <FavoriteButton targetType="destination" targetId={destination.id} />

            {isVerified ? (
              <span className="text-xs sub-nav-label bg-emerald-800 text-white px-3 py-1 rounded-full font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 inline" />
                <span>✓ VERIFIED HERITAGE GUIDE</span>
              </span>
            ) : (
              <span className="text-xs sub-nav-label bg-amber-400 text-amber-950 px-3 py-1 rounded-full font-bold flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 inline" />
                <span>[NEEDS CONTENT REVIEW]</span>
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-serif text-cream font-light tracking-wide">{destination.name}</h1>

          <div className="flex items-center space-x-4 text-xs font-sans text-cream/90 pt-1 flex-wrap gap-y-1">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-brand-gold" />
              <span className="font-bold">{destination.district?.name || 'Bihar'} District</span>
            </div>
            {destination.circuit && (
              <span>&bull; {destination.circuit.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. QUICK FACTS CARD GRID BAR */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fact 1: Best Time */}
          <div className="bg-white p-5 rounded-xl border border-brand-brown/15 shadow-lg flex items-start space-x-4">
            <div className="p-3 bg-amber-100 text-amber-900 rounded-lg flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] sub-nav-label text-brand-brown/70 block">BEST TIME TO VISIT</span>
              <p className="font-serif text-sm font-bold text-brand-black">{travelInfo.bestTime || 'October to March'}</p>
            </div>
          </div>

          {/* Fact 2: Duration */}
          <div className="bg-white p-5 rounded-xl border border-brand-brown/15 shadow-lg flex items-start space-x-4">
            <div className="p-3 bg-blue-100 text-blue-900 rounded-lg flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] sub-nav-label text-brand-brown/70 block">RECOMMENDED DURATION</span>
              <p className="font-serif text-sm font-bold text-brand-black">{travelInfo.suggestedDuration || '1 to 2 Days'}</p>
            </div>
          </div>

          {/* Fact 3: Timings & Entry */}
          <div className="bg-white p-5 rounded-xl border border-brand-brown/15 shadow-lg flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg flex-shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] sub-nav-label text-brand-brown/70 block">ENTRY & TIMINGS</span>
              <p className="font-serif text-sm font-bold text-brand-black">{travelInfo.entryFee || 'Free Admission'}</p>
              <span className="text-[11px] text-brand-brown/80 font-sans block">{travelInfo.timings || 'Sunrise to Sunset'}</span>
            </div>
          </div>

          {/* Fact 4: How to Reach */}
          <div className="bg-white p-5 rounded-xl border border-brand-brown/15 shadow-lg flex items-start space-x-4">
            <div className="p-3 bg-purple-100 text-purple-900 rounded-lg flex-shrink-0">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] sub-nav-label text-brand-brown/70 block">HOW TO REACH</span>
              <p className="font-serif text-xs font-semibold text-brand-black line-clamp-2">{travelInfo.howToReach || 'Connected via nearest major airport & railway station.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN TABBED CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 space-y-12">
        <TabView tabs={tabs} defaultTabId="overview" />

        {/* 4. NEARBY CROSS-LINKED ATTRACTIONS SECTION */}
        {nearbyAttractions.length > 0 && (
          <div className="border-t border-brand-brown/15 pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="sub-nav-label text-brand-maroon text-xs">CROSS-LINKED HERITAGE SPOTS</span>
                <h3 className="text-2xl font-serif text-brand-black font-bold">
                  Explore Nearby Attractions in {destination.district?.name || 'Region'}
                </h3>
              </div>
              <Link to="/explore/destinations" className="text-xs sub-nav-label text-brand-maroon hover:underline">
                VIEW ALL SPOTS &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {nearbyAttractions.map((spot) => (
                <Link
                  key={spot.id}
                  to={`/explore/destinations/${spot.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-brand-brown/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={spot.heroImage} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold bg-brand-black/80 text-brand-gold px-2 py-0.5 rounded sub-nav-label">
                      {spot.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-base font-bold text-brand-black group-hover:text-brand-maroon transition-colors line-clamp-1">
                        {spot.name}
                      </h4>
                      <p className="text-xs text-brand-brown/80 font-serif line-clamp-2 mt-1">
                        {spot.description}
                      </p>
                    </div>
                    <span className="text-[11px] sub-nav-label text-brand-maroon font-bold pt-2 block border-t border-brand-brown/10">
                      EXPLORE GUIDE &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        images={galleryImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
};
