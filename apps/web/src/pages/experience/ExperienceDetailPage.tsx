import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Ticket, Sparkles, Clock, Navigation,
  Compass, ShieldCheck, Utensils, Store
} from 'lucide-react';
import api from '../../api/client';
import { TourismEvent } from '../../types';
import { Lightbox } from '../../components/common/Lightbox';
import { SpotInteractiveMap } from '../../components/tourism/SpotInteractiveMap';
import { DestinationCard } from '../../components/tourism/DestinationCard';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { PhotoMosaic } from '../../components/common/PhotoMosaic';

export const ExperienceDetailPage: React.FC = () => {
  const { category, slug } = useParams<{ category?: string; slug?: string }>();
  const [event, setEvent] = useState<TourismEvent | null>(null);
  const [cuisineItem, setCuisineItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'gallery'>('overview');

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setEvent(null);
    setCuisineItem(null);
    setNotFound(false);
    setLoading(true);

    async function loadContent() {
      try {
        if (category === 'taste') {
          const res = await api.get(`/cuisine/${slug}`);
          if (res.data?.success && res.data?.data) {
            setCuisineItem(res.data.data);
          } else {
            setNotFound(true);
          }
        } else {
          const res = await api.get(`/events/${slug}`);
          if (res.data?.success && res.data?.data) {
            setEvent(res.data.data);
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error('Failed to load experience details:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadContent();
    }
  }, [category, slug]);

  const isTaste = category === 'taste';

  if (loading) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-6 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <span className="sub-nav-label text-brand-maroon text-xs block">LOADING EXPERIENCE DETAILS...</span>
      </div>
    );
  }

  if (notFound || (!event && !cuisineItem)) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-6 text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold font-mono">
          !
        </div>
        <h2 className="font-serif text-3xl text-brand-black font-bold">Content Not Found</h2>
        <p className="font-serif text-brand-brown/80 max-w-md mx-auto leading-relaxed text-sm md:text-base">
          The requested cultural experience or cuisine item "{slug}" could not be located. It may have been updated or moved.
        </p>
        <Link
          to="/calendar"
          className="inline-block py-3.5 px-8 bg-brand-gold text-brand-black font-bold sub-nav-label text-xs tracking-widest rounded-lg hover:bg-amber-400 transition-all shadow-md"
        >
          RETURN TO CULTURAL CALENDAR
        </Link>
      </div>
    );
  }

  const itemTitle = isTaste ? cuisineItem?.name : event?.title;
  const fallbackTitle = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'CULTURAL EXPERIENCE';
  const displayTitle = itemTitle || fallbackTitle;
  const heroImage = (isTaste ? cuisineItem?.heroImage : event?.heroImage) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';
  const galleryImages = (event?.gallery && event.gallery.length > 0) ? event.gallery : [heroImage];

  const startDateStr = event ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const endDateStr = event ? new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const datesFormatted = event ? (startDateStr === endDateStr ? startDateStr : `${startDateStr} – ${endDateStr}`) : 'Traditional Cuisine / Heritage Dish';

  const categoryLabel = isTaste
    ? 'AUTHENTIC GASTRONOMY'
    : (event?.category ? String(event.category).toUpperCase() : 'CULTURE & FAIR');

  const isFair = event && (
    event.category?.toLowerCase().includes('fair') ||
    event.category?.toLowerCase().includes('mela') ||
    category === 'fairs'
  );

  const tabDefs = [
    { id: 'overview', label: isTaste ? 'OVERVIEW & POPULAR SPOTS' : 'OVERVIEW & CELEBRATION' },
    { id: 'map', label: 'INTERACTIVE MAP & NEARBY STAYS' },
    { id: 'gallery', label: `PHOTO GALLERY (${galleryImages.length})` }
  ];

  return (
    <div className="pt-24 pb-24 font-sans">
      {/* Full-bleed Hero Banner */}
      <div className="relative h-[60vh] min-h-[420px] w-full bg-brand-black text-white overflow-hidden">
        <img src={heroImage} alt={displayTitle} className="w-full h-full object-cover opacity-75" />
        {/* Requirement 1: Lighter hero gradient overlay so hero photo shows through while text remains legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/75 via-black/25 to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 space-y-3">
          <Link to="/calendar" className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-gold hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>2026 CULTURAL CALENDAR</span>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-xs sub-nav-label bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-2.5 py-1 rounded">
              {categoryLabel}
            </span>
            {event && <FavoriteButton targetType="event" targetId={event.id} />}
            {event?.isLunar && (
              <span className="text-[10px] sub-nav-label bg-amber-900/60 text-amber-200 border border-amber-500/40 px-2 py-0.5 rounded">
                🌕 LUNAR CALENDAR FESTIVAL
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-cream font-normal tracking-tight">{displayTitle}</h1>
          <div className="flex flex-wrap items-center gap-6 text-xs font-serif text-cream/90 pt-1">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span>{datesFormatted}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-brand-gold" />
              <span>{isTaste ? cuisineItem?.location : `${event?.location}, ${event?.district}`}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 space-y-12">
        {/* Quick-Facts Card Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-xl border border-white/40 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-brand-maroon">
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span className="sub-nav-label text-[10px]">{isTaste ? 'SPECIALTY TYPE' : 'FESTIVAL DATES'}</span>
            </div>
            <p className="font-serif text-sm md:text-base font-bold text-brand-black truncate">
              {isTaste ? 'GI Tag / Heritage Dish' : datesFormatted}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-xl border border-white/40 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-brand-maroon">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span className="sub-nav-label text-[10px]">{isTaste ? 'ORIGIN REGION' : 'DURATION'}</span>
            </div>
            <p className="font-serif text-sm md:text-base font-bold text-brand-black truncate">
              {isTaste ? (cuisineItem?.district || 'Bihar') : 'Multi-Day Celebration'}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-xl border border-white/40 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-brand-maroon">
              <Ticket className="w-4 h-4 text-brand-gold" />
              <span className="sub-nav-label text-[10px]">{isTaste ? 'AVAILABILITY' : 'ENTRY & ADMISSION'}</span>
            </div>
            <p className="font-serif text-sm md:text-base font-bold text-brand-black truncate">
              {isTaste ? 'Statewide Eateries & Dhabas' : 'Free Open Entry'}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-5 rounded-xl border border-white/40 shadow-sm space-y-1">
            <div className="flex items-center space-x-2 text-brand-maroon">
              <Navigation className="w-4 h-4 text-brand-gold" />
              <span className="sub-nav-label text-[10px]">LOCATION / REACH</span>
            </div>
            <p className="font-serif text-sm md:text-base font-bold text-brand-black truncate">
              {isTaste ? cuisineItem?.location : `${event?.district || 'Bihar'} Junction`}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-brand-brown/20 flex space-x-8">
          {tabDefs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 sub-nav-label text-xs tracking-wider transition-all relative ${
                activeTab === tab.id
                  ? 'text-brand-maroon font-bold'
                  : 'text-brand-brown/60 hover:text-brand-black font-medium'
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-maroon rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Main Grid: Content Tabs (Left 8 cols) + Sidebar (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8 font-serif text-brand-black/85 leading-relaxed">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About Section */}
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl border border-white/40 space-y-4 shadow-sm">
                  <span className="sub-nav-label text-brand-maroon">
                    {isTaste ? 'CULINARY HERITAGE' : 'HERITAGE & TRADITIONS'}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-brand-black">About {displayTitle}</h3>
                  <p className="text-base md:text-lg leading-relaxed font-serif text-brand-black/85">
                    {isTaste
                      ? cuisineItem?.description
                      : (event?.description || `Immerse yourself in ${displayTitle}, an integral part of Bihar’s living spiritual and cultural heritage.`)}
                  </p>
                </div>

                {/* Requirement 3: Safety & Nearby Facilities Card for Fairs */}
                {isFair && event && (event.nearestPolice || event.nearestHospital || (event.nearbyRestaurants && event.nearbyRestaurants.length > 0)) && (
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/40 space-y-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-brand-maroon" />
                      <h4 className="sub-nav-label text-brand-maroon text-xs">SAFETY & NEARBY FACILITIES</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                      {event.nearestPolice && (
                        <div className="p-4 bg-red-50/60 rounded-lg border border-red-200/60 space-y-1">
                          <span className="sub-nav-label text-[10px] text-red-800 font-bold block">NEAREST POLICE / HELP</span>
                          <span className="font-serif text-brand-black text-xs block font-semibold">{event.nearestPolice}</span>
                        </div>
                      )}
                      {event.nearestHospital && (
                        <div className="p-4 bg-blue-50/60 rounded-lg border border-blue-200/60 space-y-1">
                          <span className="sub-nav-label text-[10px] text-blue-800 font-bold block">MEDICAL & EMERGENCY CARE</span>
                          <span className="font-serif text-brand-black text-xs block font-semibold">{event.nearestHospital}</span>
                        </div>
                      )}
                      {event.nearbyRestaurants && event.nearbyRestaurants.length > 0 && (
                        <div className="p-4 bg-amber-50/60 rounded-lg border border-amber-200/60 space-y-1">
                          <span className="sub-nav-label text-[10px] text-amber-800 font-bold block">RECOMMENDED NEARBY EATERIES</span>
                          <div className="space-y-1">
                            {event.nearbyRestaurants.map((r: any, idx: number) => (
                              <span key={idx} className="font-serif text-brand-black text-xs block font-semibold">
                                • {r.name} ({r.type || r.address})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cuisine Restaurants / Dhabas Section for Taste Items */}
                {isTaste && cuisineItem && (
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/40 space-y-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Utensils className="w-5 h-5 text-brand-maroon" />
                      <h4 className="sub-nav-label text-brand-maroon text-xs">MOST POPULAR & AUTHENTIC RESTAURANTS / DHABAS</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      {cuisineItem.restaurants && cuisineItem.restaurants.length > 0 ? (
                        cuisineItem.restaurants.map((rest: any, idx: number) => (
                          <div key={idx} className="p-4 bg-cream/60 rounded-lg border border-brand-brown/15 space-y-1">
                            <h5 className="font-serif text-base text-brand-black font-bold">{rest.name}</h5>
                            <p className="text-xs text-brand-brown font-serif">{rest.address}</p>
                            <span className="inline-block text-[10px] sub-nav-label bg-brand-gold/20 text-brand-maroon border border-brand-gold/30 px-2 py-0.5 rounded mt-1">
                              {rest.type || 'Authentic Eatery'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs font-serif text-brand-brown/70">
                          Served at authentic food stalls and heritage sweet shops across {cuisineItem.district || 'Bihar'}.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* What to Expect for Events */}
                {!isTaste && (
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/40 space-y-4 shadow-sm">
                    <h4 className="sub-nav-label text-brand-maroon text-xs">WHAT TO EXPECT & HIGHLIGHTS</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="flex items-start space-x-3 p-3.5 bg-white/60 backdrop-blur-sm rounded-lg border border-white/60">
                        <Sparkles className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold text-brand-black">Ritual Processions & Prayers</strong>
                          <span className="text-brand-brown/80">Traditional chanting, sacred lamps, and ceremonial offerings at dawn and dusk.</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3.5 bg-white/60 backdrop-blur-sm rounded-lg border border-white/60">
                        <Compass className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold text-brand-black">Artisan Fairs & Mithila Crafts</strong>
                          <span className="text-brand-brown/80">Local vendor stalls featuring handwoven textiles, terracotta, and authentic Bihari cuisine.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Specifications */}
                {!isTaste && (
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/40 space-y-4 shadow-sm">
                    <h4 className="sub-nav-label text-brand-maroon text-xs">EVENT SPECIFICATIONS</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                      <div>
                        <span className="text-brand-brown/70 block text-[10px] sub-nav-label">DISTRICT</span>
                        <span className="font-bold text-brand-black text-sm">{event?.district || 'Bihar'}</span>
                      </div>
                      <div>
                        <span className="text-brand-brown/70 block text-[10px] sub-nav-label">CATEGORY</span>
                        <span className="font-bold text-brand-black text-sm">{event?.category || 'Cultural'}</span>
                      </div>
                      <div>
                        <span className="text-brand-brown/70 block text-[10px] sub-nav-label">SCHEDULE</span>
                        <span className="font-bold text-brand-black text-sm">{datesFormatted}</span>
                      </div>
                      <div>
                        <span className="text-brand-brown/70 block text-[10px] sub-nav-label">GPS COORDINATES</span>
                        <span className="font-mono text-brand-black">{event?.latitude?.toFixed(4) || '25.4000'}° N, {event?.longitude?.toFixed(4) || '85.3000'}° E</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'map' && (
              <div className="space-y-4">
                <SpotInteractiveMap
                  destination={{
                    id: event?.id || cuisineItem?.id || 'map-spot',
                    name: displayTitle,
                    latitude: event?.latitude || 25.5941,
                    longitude: event?.longitude || 85.1376,
                    heroImage: heroImage
                  }}
                  vendors={event?.nearbyVendors || []}
                />
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="sub-nav-label text-brand-maroon text-xs">PHOTOGRAPHIC COLLECTION ({galleryImages.length})</span>
                  <span className="text-xs text-brand-brown font-sans">Click image to enlarge</span>
                </div>

                <PhotoMosaic
                  images={galleryImages}
                  altPrefix={displayTitle}
                  onImageClick={(idx) => {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                />
              </div>
            )}
          </div>

          {/* Sidebar CTA Column */}
          <div className="lg:col-span-4 space-y-6">
            {isTaste ? (
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/40 shadow-sm space-y-4">
                <div className="flex items-center space-x-2">
                  <Store className="w-5 h-5 text-brand-maroon" />
                  <h4 className="sub-nav-label text-brand-maroon">RECOMMENDED EATERIES</h4>
                </div>
                <p className="text-xs font-serif text-brand-black/80">
                  Top verified traditional outlets serving authentic {cuisineItem?.name}.
                </p>
                <div className="space-y-3">
                  {cuisineItem?.restaurants?.map((rest: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-white/70 backdrop-blur-sm rounded-lg border border-white/60 space-y-1">
                      <span className="font-serif text-sm font-bold text-brand-black block">{rest.name}</span>
                      <span className="text-[11px] font-sans text-brand-brown block">{rest.address}</span>
                      <span className="text-[10px] sub-nav-label text-brand-maroon font-semibold block">{rest.type}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/calendar"
                  className="w-full py-3 bg-brand-black text-brand-gold sub-nav-label text-xs tracking-widest text-center rounded hover:bg-brand-maroon hover:text-white transition-all block font-semibold mt-4"
                >
                  EXPLORE CULTURAL CALENDAR
                </Link>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/40 shadow-sm space-y-6">
                <h4 className="sub-nav-label text-brand-maroon">PLAN YOUR VISIT</h4>
                <p className="text-xs font-serif text-brand-black/80">
                  Experience this event with curated guide services, authentic local cuisine tastings, and private transport.
                </p>
                <div className="space-y-3">
                  <Link
                    to="/calendar"
                    className="w-full py-3 bg-cream text-brand-black sub-nav-label text-xs tracking-widest text-center rounded border border-brand-brown/20 hover:bg-brand-brown hover:text-white transition-all block font-semibold"
                  >
                    VIEW FULL CALENDAR
                  </Link>
                  <Link
                    to="/explore/circuits"
                    className="w-full py-3 bg-brand-black text-brand-gold sub-nav-label text-xs tracking-widest text-center rounded hover:bg-brand-maroon hover:text-white transition-all block font-semibold"
                  >
                    BOOK HERITAGE TOUR
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nearby Attractions Cross-Link Section */}
        {event?.nearbyAttractions && event.nearbyAttractions.length > 0 && (
          <div className="pt-12 border-t border-brand-brown/15 space-y-6">
            <div className="space-y-1">
              <span className="sub-nav-label text-brand-maroon">REGIONAL EXPLORATION</span>
              <h3 className="text-2xl md:text-3xl font-serif text-brand-black">
                NEARBY HERITAGE ATTRACTIONS IN {event.district.toUpperCase()}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {event.nearbyAttractions.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
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
