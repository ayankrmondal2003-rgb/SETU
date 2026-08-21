import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Calendar, Utensils, ArrowRight } from 'lucide-react';

export const ExperienceListingPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12 font-sans">
      <div className="border-b border-brand-brown/15 pb-6 space-y-2">
        <span className="sub-nav-label text-brand-maroon">CULTURAL IMMERSION</span>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-brand-black">Experience Bihar Culture</h1>
        <p className="text-sm sm:text-base font-serif text-brand-black/75 max-w-2xl leading-relaxed">
          Touch sacred rituals, see ancient folk melas, and taste legendary Mithila culinary heritage.
        </p>
      </div>

      {/* Three Pillars Overview with Rich Photography */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* TOUCH */}
        <div className="bg-white/80 backdrop-blur-md border border-brand-brown/15 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              alt="Sacred Festivals of Bihar"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-brand-black/80 backdrop-blur-md text-brand-gold text-[10px] sub-nav-label px-3 py-1 rounded-full border border-brand-gold/30 font-bold">
              SACRED RITUALS
            </div>
          </div>
          <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-brand-maroon">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span className="sub-nav-label text-xs">TOUCH / FESTIVALS</span>
              </div>
              <h3 className="text-2xl font-serif text-brand-black font-bold">Sacred Festivals</h3>
              <p className="text-sm font-serif text-brand-black/75 leading-relaxed">
                Witness millions gather along holy rivers for Chhath Puja, Pitru Paksha, and Prakash Parv.
              </p>
            </div>
            <Link
              to="/experience/festivals/chhath-puja"
              className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-maroon hover:text-brand-black font-semibold pt-3 border-t border-brand-brown/10"
            >
              <span>DISCOVER CHHATH PUJA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* SEE */}
        <div className="bg-white/80 backdrop-blur-md border border-brand-brown/15 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
              alt="Historic Fairs and Melas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-brand-black/80 backdrop-blur-md text-brand-gold text-[10px] sub-nav-label px-3 py-1 rounded-full border border-brand-gold/30 font-bold">
              FOLK MELAS
            </div>
          </div>
          <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-brand-maroon">
                <Calendar className="w-4 h-4 text-brand-gold" />
                <span className="sub-nav-label text-xs">SEE / FAIRS</span>
              </div>
              <h3 className="text-2xl font-serif text-brand-black font-bold">Historic Fairs & Melas</h3>
              <p className="text-sm font-serif text-brand-black/75 leading-relaxed">
                Explore Sonepur Mela and Rajgir Mahotsav for folk arts, theatre, and traditional handicrafts.
              </p>
            </div>
            <Link
              to="/experience/fairs/sonepur-mela"
              className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-maroon hover:text-brand-black font-semibold pt-3 border-t border-brand-brown/10"
            >
              <span>DISCOVER SONEPUR MELA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* TASTE */}
        <div className="bg-white/80 backdrop-blur-md border border-brand-brown/15 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
              alt="Bihari Culinary Heritage"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-brand-black/80 backdrop-blur-md text-brand-gold text-[10px] sub-nav-label px-3 py-1 rounded-full border border-brand-gold/30 font-bold">
              GASTRONOMY
            </div>
          </div>
          <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-brand-maroon">
                <Utensils className="w-4 h-4 text-brand-gold" />
                <span className="sub-nav-label text-xs">TASTE / CUISINE</span>
              </div>
              <h3 className="text-2xl font-serif text-brand-black font-bold">Gastronomy & Traditions</h3>
              <p className="text-sm font-serif text-brand-black/75 leading-relaxed">
                Savor authentic Litti Chokha, GI-tagged Silao Khaja, Mithila Makhana, and festive Prasad.
              </p>
            </div>
            <Link
              to="/experience/taste/litti-chokha"
              className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-maroon hover:text-brand-black font-semibold pt-3 border-t border-brand-brown/10"
            >
              <span>DISCOVER CUISINE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
