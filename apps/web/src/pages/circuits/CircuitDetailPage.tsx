import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, ArrowLeft, Play, Eye, Calendar, Clock, Ticket,
  Navigation, CheckCircle2, Star, ShieldCheck, Sparkles
} from 'lucide-react';
import api from '../../api/client';
import { Circuit } from '../../types';
import { TabView, TabItem } from '../../components/common/TabView';
import { Lightbox } from '../../components/common/Lightbox';
import { DestinationCard } from '../../components/tourism/DestinationCard';
import { SpotInteractiveMap } from '../../components/tourism/SpotInteractiveMap';
import { PhotoMosaic } from '../../components/common/PhotoMosaic';

export const CircuitDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadCircuit() {
      setLoading(true);
      try {
        const res = await api.get(`/circuits/${slug}`);
        if (res.data.success) {
          setCircuit(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load circuit detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCircuit();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center font-serif space-y-3">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-brand-brown text-sm">Loading rich circuit trail guide...</p>
      </div>
    );
  }

  if (!circuit) {
    return (
      <div className="pt-32 pb-24 text-center space-y-4">
        <h2 className="text-3xl font-serif text-brand-black">Circuit Guide Not Found</h2>
        <Link to="/explore/circuits" className="text-brand-maroon underline sub-nav-label">Return to All Circuits</Link>
      </div>
    );
  }

  const galleryImages = (circuit.gallery && circuit.gallery.length > 0)
    ? circuit.gallery
    : [];

  // Collect stays across all destinations in circuit
  const allStays = (circuit.destinations || []).flatMap(d =>
    (d.stays || []).map(s => ({ ...s, destinationName: d.name }))
  );

  const stopsCount = circuit.destinations?.length || circuit.locations.length || 0;
  const estimatedDays = Math.max(3, Math.ceil(stopsCount * 1.2));

  // Tab Contents Definition
  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'OVERVIEW & HISTORY',
      content: (
        <div className="space-y-8 font-serif leading-relaxed text-brand-black/90">
          {/* Main Story Text */}
          <div className="space-y-4 text-base md:text-lg">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-brand-maroon first-letter:float-left first-letter:mr-3 leading-relaxed">
              {circuit.overview}
            </p>
            <p className="text-sm md:text-base text-brand-brown/90 leading-relaxed">
              {circuit.description}
            </p>
          </div>

          {/* Callout Box */}
          <div className="p-6 bg-cream rounded-xl border border-brand-brown/15 shadow-sm space-y-2">
            <h4 className="sub-nav-label text-brand-maroon text-xs">TRAIL SIGNIFICANCE</h4>
            <p className="text-sm font-serif text-brand-black">
              "{circuit.description}"
            </p>
          </div>

          {/* Key Circuit Highlights */}
          <div className="bg-cream p-6 rounded-xl border border-brand-brown/15 space-y-4">
            <h4 className="sub-nav-label text-brand-maroon text-xs tracking-wider">HERITAGE TRAIL HIGHLIGHTS</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
              <div className="bg-white p-4 rounded-lg border border-brand-brown/10 shadow-sm space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-[10px]">
                  1
                </span>
                <p className="text-brand-black font-medium leading-normal">
                  Comprehensive coverage of Bihar’s key UNESCO World Heritage & spiritual pilgrimage centers.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-brand-brown/10 shadow-sm space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-[10px]">
                  2
                </span>
                <p className="text-brand-black font-medium leading-normal">
                  Seamless transit via express national highways, tourist corridors, and dedicated rail hubs.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-brand-brown/10 shadow-sm space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-[10px]">
                  3
                </span>
                <p className="text-brand-black font-medium leading-normal">
                  Verified local vendor network providing certified guides, authentic dining, and eco stays.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="bg-white p-6 rounded-xl border border-brand-brown/15 space-y-4">
            <h4 className="sub-nav-label text-brand-maroon text-xs">CIRCUIT TRAIL SPECIFICATIONS</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div>
                <span className="text-brand-brown/70 block text-[10px] sub-nav-label">TOTAL HERITAGE STOPS</span>
                <span className="font-bold text-brand-black text-sm">{stopsCount} Key Destinations</span>
              </div>
              <div>
                <span className="text-brand-brown/70 block text-[10px] sub-nav-label">PRIMARY REGIONS</span>
                <span className="font-bold text-brand-black text-sm line-clamp-1">{circuit.locations.join(', ')}</span>
              </div>
              <div>
                <span className="text-brand-brown/70 block text-[10px] sub-nav-label">RECOMMENDED SEASON</span>
                <span className="font-bold text-brand-black text-sm">October to March</span>
              </div>
              <div>
                <span className="text-brand-brown/70 block text-[10px] sub-nav-label">TRAIL TYPE</span>
                <span className="font-bold text-brand-black text-sm">Spiritual & Cultural Circuit</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'locations',
      label: 'LOCATIONS',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="sub-nav-label text-brand-maroon text-xs">DESTINATIONS ALONG THIS TRAIL ({stopsCount})</h3>
            <span className="text-xs text-brand-brown font-sans">Explore each spot's complete travel guide</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {circuit.destinations && circuit.destinations.length > 0 ? (
              circuit.destinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))
            ) : (
              <p className="text-sm font-serif text-brand-brown/70">No specific destinations tagged yet.</p>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'maps',
      label: 'INTERACTIVE MAP & NEARBY STAYS',
      content: (
        <div className="space-y-4">
          <SpotInteractiveMap
            spots={circuit.destinations || []}
            vendors={circuit.nearbyVendors || []}
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
              altPrefix={circuit.name}
              onImageClick={(idx) => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
            />
          ) : (
            <div className="bg-white p-8 rounded-xl border border-brand-brown/15 text-center text-brand-brown/70 font-serif">
              No photo gallery images available for this circuit.
            </div>
          )}
        </div>
      )
    },
    {
      id: 'video',
      label: 'VIDEO DISCOVERY',
      content: (
        <div className="bg-brand-black text-white p-8 md:p-12 rounded-xl border border-brand-brown/20 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-brand-gold text-brand-black flex items-center justify-center mx-auto shadow-lg">
            <Play className="w-6 h-6 fill-current ml-1" />
          </div>
          <h4 className="font-serif text-2xl md:text-3xl text-brand-gold">Immersive Circuit Documentary</h4>
          <p className="font-serif text-cream/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Watch the official 4K Bihar Tourism film showcasing the spiritual aura, ancient monastic ruins, and cultural wonders across the {circuit.name}.
          </p>
        </div>
      )
    },
    {
      id: 'insider-tips',
      label: 'INSIDER TIPS & PLANNING',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stays Column */}
          <div className="space-y-4">
            <h4 className="sub-nav-label text-brand-maroon text-xs">RECOMMENDED STAYS ALONG CIRCUIT</h4>
            <div className="space-y-3">
              {allStays.length > 0 ? (
                allStays.slice(0, 5).map((stay: any, idx: number) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-brand-brown/15 flex items-center justify-between shadow-sm">
                    <div>
                      <h5 className="font-serif text-base text-brand-black font-bold">{stay.name}</h5>
                      <span className="text-[11px] text-brand-brown/70 font-sans block mt-0.5">Near {stay.destinationName}</span>
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
                <div className="bg-white p-5 rounded-xl border border-brand-brown/15 text-xs text-brand-brown font-serif space-y-1">
                  <p>Check the Interactive Map tab for certified nearby hotel & resort listings along the route.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations / Insider Advice Column */}
          <div className="space-y-4">
            <h4 className="sub-nav-label text-brand-maroon text-xs">LOCAL INSIDER ADVICE</h4>
            <div className="bg-cream p-6 rounded-xl border border-brand-brown/15 space-y-3">
              <ul className="space-y-4 font-serif text-sm text-brand-black/85">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-brand-black font-bold mb-0.5">Optimal Itinerary Order:</strong>
                    <span>Begin your journey at the primary transportation hub ({circuit.locations[0] || 'Patna'}) and proceed sequentially to minimize transit time.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-brand-black font-bold mb-0.5">Transit & Connectivity:</strong>
                    <span>Book pre-paid AC intercity cabs or government tourist vehicles for comfortable transit between stops along national highways.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-brand-black font-bold mb-0.5">Best Sightseeing Timing:</strong>
                    <span>Plan major temple and heritage monument visits during early morning hours (6:00 AM – 9:00 AM) to experience serene morning chants and avoid crowds.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-brand-black font-bold mb-0.5">Peak Season Bookings:</strong>
                    <span>During peak winter travel months (October through March), ensure hotel stays and registered guides are reserved at least 2 weeks in advance.</span>
                  </div>
                </li>
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
          src={circuit.heroImage}
          alt={circuit.name}
          className="w-full h-full object-cover opacity-50 scale-105"
          style={{ transition: 'transform 10s ease-out' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/40 to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 space-y-4">
          <Link
            to="/explore/circuits"
            className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-gold hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ALL CIRCUITS</span>
          </Link>

          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            <span className="text-xs sub-nav-label bg-brand-gold text-brand-black px-3 py-1 rounded font-bold">
              SACRED HERITAGE TRAIL
            </span>
            <span className="text-xs sub-nav-label bg-emerald-800 text-white px-3 py-1 rounded-full font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 inline" />
              <span>✓ VERIFIED HERITAGE TRAIL</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif text-cream font-light tracking-wide">{circuit.name}</h1>

          <div className="flex items-center space-x-4 text-xs font-sans text-cream/90 pt-1 flex-wrap gap-y-1">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-brand-gold" />
              <span className="font-bold">{circuit.locations.join(' • ')}</span>
            </div>
            <span>&bull; {stopsCount} Heritage Destinations</span>
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
              <p className="font-serif text-sm font-bold text-brand-black">October to March</p>
            </div>
          </div>

          {/* Fact 2: Duration */}
          <div className="bg-white p-5 rounded-xl border border-brand-brown/15 shadow-lg flex items-start space-x-4">
            <div className="p-3 bg-blue-100 text-blue-900 rounded-lg flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] sub-nav-label text-brand-brown/70 block">RECOMMENDED DURATION</span>
              <p className="font-serif text-sm font-bold text-brand-black">{estimatedDays} Days Full Trail</p>
            </div>
          </div>

          {/* Fact 3: Route Stops */}
          <div className="bg-white p-5 rounded-xl border border-brand-brown/15 shadow-lg flex items-start space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg flex-shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] sub-nav-label text-brand-brown/70 block">CIRCUIT ROUTE & STOPS</span>
              <p className="font-serif text-sm font-bold text-brand-black">{stopsCount} Key Destinations</p>
              <span className="text-[11px] text-brand-brown/80 font-sans block">Self-Guided & Tour Packages</span>
            </div>
          </div>

          {/* Fact 4: Connectivity & Transport */}
          <div className="bg-white p-5 rounded-xl border border-brand-brown/15 shadow-lg flex items-start space-x-4">
            <div className="p-3 bg-purple-100 text-purple-900 rounded-lg flex-shrink-0">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] sub-nav-label text-brand-brown/70 block">CONNECTIVITY & TRANSPORT</span>
              <p className="font-serif text-xs font-semibold text-brand-black line-clamp-2">Connected via Patna/Gaya Airport, highways & tourist cabs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN TABBED CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 space-y-12">
        <TabView tabs={tabs} defaultTabId="overview" />

        {/* 4. DESTINATIONS ALONG TRAIL SECTION */}
        {circuit.destinations && circuit.destinations.length > 0 && (
          <div className="border-t border-brand-brown/15 pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="sub-nav-label text-brand-maroon text-xs">HERITAGE SPOTS ALONG TRAIL</span>
                <h3 className="text-2xl font-serif text-brand-black font-bold">
                  Destinations Included in {circuit.name}
                </h3>
              </div>
              <Link to="/explore/destinations" className="text-xs sub-nav-label text-brand-maroon hover:underline">
                VIEW ALL SPOTS &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {circuit.destinations.map((spot) => (
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
