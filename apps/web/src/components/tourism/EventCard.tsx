import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Moon, CheckCircle2 } from 'lucide-react';
import { format, differenceInCalendarDays } from 'date-fns';
import { TourismEvent } from '../../types';
import { FavoriteButton } from '../common/FavoriteButton';

interface EventCardProps {
  event: TourismEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const today = new Date();

  const startClean = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endClean = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const isPassed = todayClean > endClean;
  const isHappening = todayClean >= startClean && todayClean <= endClean;
  const daysUntilStart = differenceInCalendarDays(startClean, todayClean);

  const startDateStr = format(start, 'MMM dd, yyyy');
  const endDateStr = format(end, 'MMM dd, yyyy');
  const isSingleDay = startDateStr === endDateStr;
  const dayCount = Math.max(1, differenceInCalendarDays(end, start) + 1);

  const catSlug = event.category ? event.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'cultural';

  const getCategoryBg = (cat: string) => {
    switch (cat) {
      case 'Religious':
        return 'bg-purple-900 text-purple-100 border border-purple-400/30';
      case 'Fair/Mela':
        return 'bg-amber-800 text-amber-100 border border-amber-400/30';
      case 'Heritage':
        return 'bg-rose-900 text-rose-100 border border-rose-400/30';
      case 'Music/Arts':
        return 'bg-indigo-900 text-indigo-100 border border-indigo-400/30';
      case 'Local/Regional':
        return 'bg-emerald-800 text-emerald-100 border border-emerald-400/30';
      case 'Cultural':
      default:
        return 'bg-brand-maroon text-cream border border-brand-gold/30';
    }
  };

  return (
    <div className="group bg-cream border border-brand-brown/15 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
      <div>
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={event.heroImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton targetType="event" targetId={event.id} />
          </div>
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            <span className={`text-[10px] sub-nav-label px-2.5 py-1 rounded shadow-md font-bold uppercase tracking-wider ${getCategoryBg(event.category)}`}>
              {event.category}
            </span>
            {event.isLunar && (
              <span className="bg-slate-900/90 text-amber-300 text-[10px] sub-nav-label px-2 py-1 rounded shadow-md flex items-center space-x-1 border border-amber-400/40">
                <Moon className="w-3 h-3 text-amber-300 inline" />
                <span>LUNAR</span>
              </span>
            )}
          </div>

          {/* Real-time Status / Countdown Badge */}
          {isPassed ? (
            <div className="absolute bottom-3 right-3 bg-slate-800/90 text-slate-200 text-[10px] font-bold sub-nav-label px-2.5 py-1 rounded shadow border border-slate-600">
              EVENT PASSED
            </div>
          ) : isHappening ? (
            <div className="absolute bottom-3 right-3 bg-emerald-700 text-white text-[10px] font-bold sub-nav-label px-2.5 py-1 rounded shadow flex items-center space-x-1.5 border border-emerald-400/40">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>HAPPENING NOW</span>
            </div>
          ) : (
            <div className="absolute bottom-3 right-3 bg-brand-black/90 text-brand-gold text-[10px] font-bold sub-nav-label px-2.5 py-1 rounded shadow border border-brand-gold/30">
              {daysUntilStart} {daysUntilStart === 1 ? 'DAY' : 'DAYS'} LEFT {!isSingleDay && `(${dayCount}D EVENT)`}
            </div>
          )}
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-sans text-brand-maroon font-semibold">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-maroon flex-shrink-0" />
              <span>
                {isSingleDay ? startDateStr : `${format(start, 'MMM dd')} — ${endDateStr}`}
              </span>
            </div>
            {event.lastVerified && (
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-sans font-medium flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 inline text-emerald-700" />
                <span>Verified 2026</span>
              </span>
            )}
          </div>

          <h3 className="text-xl font-serif text-brand-black group-hover:text-brand-maroon transition-colors font-bold">
            {event.title}
          </h3>

          <div className="flex items-center space-x-1 text-xs text-brand-brown/80 font-sans">
            <MapPin className="w-3.5 h-3.5 text-brand-mustard flex-shrink-0" />
            <span>{event.location} &bull; {event.district}</span>
          </div>

          <p className="text-sm font-serif text-brand-black/75 line-clamp-3 leading-relaxed pt-1">
            {event.description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2">
        <Link
          to={`/experience/${catSlug}/${event.slug}`}
          className="inline-flex items-center justify-between w-full text-xs sub-nav-label text-brand-maroon font-semibold border-t border-brand-brown/10 pt-3 group-hover:text-brand-black transition-colors"
        >
          <span>VIEW EVENT DETAILS</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
