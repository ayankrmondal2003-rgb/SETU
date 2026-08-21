import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Offering } from '../../types';
import { MapPin, Clock } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Culinary Experience',
  'Eco & Adventure',
  'Handicrafts',
  'River Tourism',
  'Wellness & Food',
  'Accommodation'
];

export const OfferingsListingPage: React.FC = () => {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadOfferings() {
      try {
        const res = await api.get('/offerings');
        if (res.data.success) setOfferings(res.data.data);
      } catch (err) {
        console.error('Error loading offerings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOfferings();
  }, []);

  const filteredOfferings = selectedCategory === 'All'
    ? offerings
    : offerings.filter((off) => {
        if (!off.category) return false;
        const oCat = off.category.trim().toLowerCase();
        const sCat = selectedCategory.trim().toLowerCase();
        return oCat === sCat || oCat.includes(sCat) || sCat.includes(oCat);
      });

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="space-y-2">
        <span className="text-xs sub-nav-label text-brand-maroon">GUIDED TOURS & EXPERIENCES</span>
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-black">Book Bihar Tourism Offerings</h1>
        <p className="text-sm font-serif text-brand-brown/80">Curated experiences from verified local vendors.</p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 pb-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full uppercase text-xs sub-nav-label tracking-wider px-4 py-2 font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-brand-black text-white border border-brand-black shadow-sm'
                  : 'bg-white/80 text-brand-black border border-brand-brown/20 hover:border-brand-black hover:bg-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-brand-brown text-sm">Loading bookable offerings...</p>
        </div>
      ) : filteredOfferings.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md border border-brand-brown/15 rounded-xl p-12 text-center space-y-4">
          <p className="font-serif text-lg text-brand-black">
            No offerings currently listed under "{selectedCategory}".
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className="px-5 py-2.5 bg-brand-black text-white text-xs sub-nav-label tracking-widest rounded-full hover:bg-brand-maroon transition-all"
          >
            SHOW ALL OFFERINGS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOfferings.map((off) => (
            <Link
              key={off.id}
              to={`/offerings/${off.slug}`}
              className="bg-white/90 backdrop-blur-sm border border-brand-brown/15 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all block group"
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={off.coverImage}
                  alt={off.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[10px] sub-nav-label bg-brand-black/80 text-brand-gold px-2.5 py-1 rounded-full font-bold uppercase backdrop-blur-sm">
                  {off.category}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-serif text-lg text-brand-black font-bold leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2">
                  {off.title}
                </h3>
                <div className="flex items-center space-x-4 text-xs font-sans text-brand-brown">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                    <span className="truncate">{off.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                    <span>{off.duration}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-brand-brown/10">
                  <span className="font-serif text-xl font-bold text-brand-black">₹{off.price.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] sub-nav-label text-brand-brown/70 truncate max-w-[140px] text-right">
                    {off.vendor?.businessName}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
