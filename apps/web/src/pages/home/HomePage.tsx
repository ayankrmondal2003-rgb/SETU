import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MapPin, Calendar, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import api from '../../api/client';
import { useTranslation } from '../../context/LanguageContext';
import { Circuit, Destination, TourismEvent, Vendor } from '../../types';
import { CircuitCard } from '../../components/tourism/CircuitCard';
import { DestinationCard } from '../../components/tourism/DestinationCard';
import { EventCard } from '../../components/tourism/EventCard';
import { InteractiveMap } from '../../components/maps/InteractiveMap';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGES = [
  '/images/hero section 2.jpg',
  '/images/hero section 3.jpg',
  '/images/hero section 4.jpg',
  '/images/hero section 5.jpg',
  '/images/hero section 6.jpg',
  '/images/hero section 7.jpg',
  '/images/hero section 8.jpg'
];

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [events, setEvents] = useState<TourismEvent[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Filter events to only those that haven't ended yet (endDate >= today)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return events.filter((ev) => {
      const end = new Date(ev.endDate);
      const endClean = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      return todayClean <= endClean;
    });
  }, [events]);

  // Rotate Hero Imagery every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Featured Data
  useEffect(() => {
    async function fetchData() {
      try {
        const [circRes, destRes, eventRes, vendorRes] = await Promise.all([
          api.get('/circuits'),
          api.get('/destinations'),
          api.get('/events'),
          api.get('/vendors')
        ]);
        if (circRes.data.success) setCircuits(circRes.data.data.slice(0, 3));
        if (destRes.data.success) setDestinations(destRes.data.data);
        if (eventRes.data.success) setEvents(eventRes.data.data);
        if (vendorRes.data.success) setVendors(vendorRes.data.data);
      } catch (err) {
        console.error('Failed to load home page content:', err);
      }
    }
    fetchData();
  }, []);

  // Custom SplitText GSAP Animation on Hero Heading
  useEffect(() => {
    if (!heroHeadingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroHeadingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black text-white">
        {/* Background Image Carousel with Ken Burns Zoom Animation */}
        {HERO_IMAGES.map((imgUrl, index) => {
          const isActive = index === currentHeroIdx;
          return (
            <div
              key={imgUrl}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-60 scale-105 z-0' : 'opacity-0 scale-100 -z-10'
              }`}
              style={{
                transition: 'opacity 1.5s ease-in-out, transform 6s ease-out'
              }}
            >
              <img
                src={imgUrl}
                alt={`Bihar Tourism Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/40 to-transparent z-0" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center pt-24 pb-12 flex flex-col items-center">
          <span className="sub-nav-label text-brand-gold tracking-[0.3em] mb-4">
            {t('home.heroTagline', 'SACRED LAND OF ENLIGHTENMENT & LEGENDS')}
          </span>

          <h1
            ref={heroHeadingRef}
            className="hero-heading text-cream font-serif max-w-5xl"
          >
            {t('home.heroTitle', "Bridges to Bihar's Ancient Soul")}
          </h1>

          <p className="mt-6 text-lg md:text-xl font-serif text-cream/80 max-w-2xl leading-relaxed font-light">
            {t('home.heroSubtitle', 'Journey through ancient monastic ruins, sacred Ganges ghats, serene eco sanctuaries, and centuries of vibrant Mithila craftsmanship.')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/explore/circuits"
              className="px-8 py-4 bg-brand-gold text-brand-black sub-nav-label text-xs tracking-widest font-semibold rounded hover:bg-amber-400 transition-all flex items-center space-x-2 shadow-xl"
            >
              <span>{t('home.exploreCircuits', 'EXPLORE SACRED CIRCUITS')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/calendar"
              className="px-8 py-4 border border-cream/40 text-cream sub-nav-label text-xs tracking-widest font-semibold rounded hover:bg-white/10 transition-all flex items-center space-x-2 backdrop-blur-sm"
            >
              <Calendar className="w-4 h-4 text-brand-gold" />
              <span>{t('home.viewCalendar', 'CULTURAL CALENDAR 2026')}</span>
            </Link>
          </div>
        </div>

        {/* Hero Bottom Banner with Indicators & Counter */}
        <div className="absolute bottom-6 left-0 right-0 z-10 px-6 md:px-12 flex items-center justify-between text-xs text-cream/80 sub-nav-label max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <span className="text-brand-gold font-mono font-bold text-sm">
              0{currentHeroIdx + 1} <span className="text-white/40">/ 0{HERO_IMAGES.length}</span>
            </span>
            <div className="flex items-center space-x-1.5 ml-2">
              {HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHeroIdx(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentHeroIdx ? 'w-8 bg-brand-gold' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <span className="hidden md:inline text-white/60">UNESCO WORLD HERITAGE & MARKETPLACE</span>
        </div>
      </section>

      {/* 2. EDITORIAL INTRO SECTION */}
      <section className="py-24 px-6 md:px-12 bg-cream/85 backdrop-blur-sm text-brand-black border-b border-brand-brown/15">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="sub-nav-label text-brand-maroon">{t('home.homeTitle', 'LAND OF ENLIGHTENMENT')}</span>
          <h2 className="text-3xl md:text-5xl font-serif leading-tight">
            Where Empires Were Born and Philosophy Illuminated the World
          </h2>
          <p className="font-serif text-lg text-brand-black/80 leading-relaxed font-light">
            Bihar stands as a timeless cradle of civilization. From the venerable Bodhi Tree at Bodh Gaya to the ancient halls of Nalanda University and the majestic ghats of Patna Sahib, SETU curates extraordinary travel journeys across the state.
          </p>
        </div>
      </section>

      {/* 3. FEATURED CIRCUITS */}
      <section ref={sectionRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto my-6 bg-white/85 backdrop-blur-sm rounded-2xl border border-brand-brown/15 shadow-md">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="sub-nav-label text-brand-maroon">SACRED TRAILS</span>
            <h2 className="text-4xl font-serif text-brand-black mt-2">Featured Tourism Circuits</h2>
          </div>
          <Link
            to="/explore/circuits"
            className="mt-4 md:mt-0 sub-nav-label text-xs text-brand-maroon hover:text-brand-black flex items-center space-x-1"
          >
            <span>VIEW ALL CIRCUITS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {circuits.map((circuit) => (
            <CircuitCard key={circuit.id} circuit={circuit} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED DESTINATIONS */}
      <section className="py-24 px-6 md:px-12 bg-cream-light/85 backdrop-blur-sm border-y border-brand-brown/15">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="sub-nav-label text-brand-maroon">HERITAGE SANCTUARIES</span>
              <h2 className="text-4xl font-serif text-brand-black mt-2">Iconic Destinations</h2>
            </div>
            <Link
              to="/explore/destinations"
              className="mt-4 md:mt-0 sub-nav-label text-xs text-brand-maroon hover:text-brand-black flex items-center space-x-1"
            >
              <span>EXPLORE ALL DESTINATIONS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.slice(0, 4).map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE MAP TEASER */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto my-6 bg-white/85 backdrop-blur-sm rounded-2xl border border-brand-brown/15 shadow-md">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="sub-nav-label text-brand-maroon">GEOGRAPHIC DISCOVERY</span>
          <h2 className="text-4xl font-serif text-brand-black">Interactive Bihar Tourism Map</h2>
          <p className="font-serif text-brand-black/75">
            Filter markers by spiritual circuit, district, or heritage category. Click pins to explore detail cards.
          </p>
        </div>

        <InteractiveMap destinations={destinations} events={events} vendors={vendors} height="520px" />
      </section>

      {/* 6. CULTURAL CALENDAR & EVENTS TEASER */}
      <section className="py-24 px-6 md:px-12 bg-cream/85 backdrop-blur-sm border-t border-brand-brown/15">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="sub-nav-label text-brand-maroon">FESTIVALS & FAIRS</span>
              <h2 className="text-4xl font-serif text-brand-black mt-2">Upcoming Tourism Events</h2>
            </div>
            <Link
              to="/calendar"
              className="mt-4 md:mt-0 sub-nav-label text-xs text-brand-maroon hover:text-brand-black flex items-center space-x-1"
            >
              <span>VIEW FULL 2026 CALENDAR</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.slice(0, 3).map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-xl border border-brand-brown/15 text-center space-y-3 shadow-sm">
              <Calendar className="w-10 h-10 text-brand-maroon mx-auto opacity-75" />
              <h3 className="font-serif text-xl font-medium text-brand-black">No Upcoming Events Right Now</h3>
              <p className="font-serif text-brand-black/75 text-sm max-w-md mx-auto">
                There are currently no scheduled upcoming festival dates remaining for this period. Check back soon or view the full 2026 calendar archive.
              </p>
              <div className="pt-2">
                <Link
                  to="/calendar"
                  className="inline-flex items-center space-x-1.5 sub-nav-label text-xs text-brand-maroon hover:text-brand-black font-semibold"
                >
                  <span>BROWSE FULL 2026 CALENDAR</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. STATS & IMPERIAL FOOTER BANNER */}
      <section className="py-20 px-6 md:px-12 bg-brand-black/90 backdrop-blur-md text-cream">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-xs sub-nav-label">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>INTELLIGENT TRAVEL COMPANION</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-cream">Plan Your Bespoke Bihar Journey with AI</h2>
          <p className="font-serif text-cream/70 text-base max-w-2xl mx-auto leading-relaxed">
            Curate personalized day-by-day itineraries tailored to your dates, spiritual interests, and regional culinary preferences.
          </p>
        </div>
      </section>
    </div>
  );
};
