import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Utensils } from 'lucide-react';
import api from '../../api/client';

interface MegaMenuExperienceProps {
  onClose: () => void;
}

export const MegaMenuExperience: React.FC<MegaMenuExperienceProps> = ({ onClose }) => {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [fairs, setFairs] = useState<any[]>([]);
  const [cuisines, setCuisines] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [evRes, cuRes] = await Promise.all([
          api.get('/events'),
          api.get('/cuisine')
        ]);

        if (isMounted) {
          if (evRes.data?.success && Array.isArray(evRes.data.data)) {
            const allEv = evRes.data.data;
            const festList = allEv.filter((e: any) =>
              ['Cultural', 'Religious', 'Music/Arts', 'Heritage', 'Festival'].includes(e.category) && !e.category.includes('Fair')
            ).slice(0, 4);

            const fairList = allEv.filter((e: any) =>
              e.category.includes('Fair') || e.category.includes('Mela')
            ).slice(0, 4);

            setFestivals(festList);
            setFairs(fairList);
          }

          if (cuRes.data?.success && Array.isArray(cuRes.data.data)) {
            setCuisines(cuRes.data.data.slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error loading MegaMenuExperience data:', err);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  // Fallbacks if API data is still loading
  const defaultFestivals = [
    { title: 'Tapovan Festival', slug: 'tapovan-festival-2026', heroImage: '/images/tapovan (1).jpeg', district: 'Gaya' },
    { title: 'Makar Sankranti', slug: 'makar-sankranti-2026', heroImage: '/images/makar shakranti (1).jpg', district: 'Patna' },
    { title: 'Mandar Mahotsav', slug: 'mandar-mahotsav-2026', heroImage: '/images/mandar mahostsav (1).jpg', district: 'Banka' },
    { title: 'Vishnudham Mahotsav', slug: 'vishnudham-mahotsav-2026', heroImage: '/images/vishnudham mahotsav (1).jpeg', district: 'Aurangabad' }
  ];

  const defaultFairs = [
    { title: 'Parshuram Utsav Mela', slug: 'parshuram-utsav-mela-2026', heroImage: '/images/porshuram utsav mela(1).jpeg', district: 'Patna' },
    { title: 'Shravani Mela', slug: 'shravani-mela-2026', heroImage: '/images/shrabani mela (1).jpeg', district: 'Bhagalpur' },
    { title: 'Makar Mela Rajgir', slug: 'makar-mela-rajgir-2026', heroImage: '/images/makar mela rajgir (1).jpeg', district: 'Nalanda' },
    { title: 'Malmas Mela Rajgir', slug: 'malmas-mela-rajgir-2026', heroImage: '/images/malmas mela rajgir (1).jpeg', district: 'Nalanda' }
  ];

  const defaultCuisines = [
    { name: 'Litti Chokha & Sattu Delicacies', slug: 'litti-chokha', heroImage: '/images/litthi chokha (1).jpeg', location: 'Patna' },
    { name: 'Thekua & Traditional Chhath Prasad', slug: 'thekua-festive-sweets', heroImage: '/images/thekua(1).jpeg', location: 'Statewide' },
    { name: 'Mithila Makhana Heritage', slug: 'makhana-culinary-traditions', heroImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80', location: 'Darbhanga' },
    { name: 'Silao Khaja — GI Tag Sweet', slug: 'silao-khaja', heroImage: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80', location: 'Silao, Rajgir' }
  ];

  const displayFestivals = festivals.length > 0 ? festivals : defaultFestivals;
  const displayFairs = fairs.length > 0 ? fairs : defaultFairs;
  const displayCuisines = cuisines.length > 0 ? cuisines : defaultCuisines;

  return (
    <div className="w-full bg-cream border-b border-brand-brown/15 shadow-2xl py-10 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* TOUCH: FESTIVALS */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-brand-brown/15 pb-2">
            <Sparkles className="w-4 h-4 text-brand-maroon" />
            <span className="sub-nav-label text-brand-maroon">TOUCH / FESTIVALS</span>
          </div>

          <div className="space-y-2">
            {displayFestivals.map((item) => (
              <Link
                key={item.id || item.slug}
                to={`/experience/festivals/${item.slug}`}
                onClick={onClose}
                className="group flex items-center space-x-3 p-2 rounded-xl hover:bg-white/80 border border-transparent hover:border-brand-brown/15 transition-all shadow-none hover:shadow-sm"
              >
                <img
                  src={item.heroImage}
                  alt={item.title || item.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-brand-brown/15 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-serif text-sm font-semibold text-brand-black group-hover:text-brand-maroon block truncate">
                    {item.title || item.name}
                  </span>
                  <span className="text-[11px] font-sans text-brand-brown/70 block truncate">
                    {item.location || item.district || 'Bihar'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SEE: FAIRS */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-brand-brown/15 pb-2">
            <Calendar className="w-4 h-4 text-brand-maroon" />
            <span className="sub-nav-label text-brand-maroon">SEE / FAIRS</span>
          </div>

          <div className="space-y-2">
            {displayFairs.map((item) => (
              <Link
                key={item.id || item.slug}
                to={`/experience/fairs/${item.slug}`}
                onClick={onClose}
                className="group flex items-center space-x-3 p-2 rounded-xl hover:bg-white/80 border border-transparent hover:border-brand-brown/15 transition-all shadow-none hover:shadow-sm"
              >
                <img
                  src={item.heroImage}
                  alt={item.title || item.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-brand-brown/15 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-serif text-sm font-semibold text-brand-black group-hover:text-brand-maroon block truncate">
                    {item.title || item.name}
                  </span>
                  <span className="text-[11px] font-sans text-brand-brown/70 block truncate">
                    {item.location || item.district || 'Bihar'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* TASTE: CUISINE */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-brand-brown/15 pb-2">
            <Utensils className="w-4 h-4 text-brand-maroon" />
            <span className="sub-nav-label text-brand-maroon">TASTE / CUISINE</span>
          </div>

          <div className="space-y-2">
            {displayCuisines.map((item) => (
              <Link
                key={item.id || item.slug}
                to={`/experience/taste/${item.slug}`}
                onClick={onClose}
                className="group flex items-center space-x-3 p-2 rounded-xl hover:bg-white/80 border border-transparent hover:border-brand-brown/15 transition-all shadow-none hover:shadow-sm"
              >
                <img
                  src={item.heroImage}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-brand-brown/15 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-serif text-sm font-semibold text-brand-black group-hover:text-brand-maroon block truncate">
                    {item.name}
                  </span>
                  <span className="text-[11px] font-sans text-brand-brown/70 block truncate">
                    {item.location || item.district || 'Bihar'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

