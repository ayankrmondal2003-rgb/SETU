import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Layers } from 'lucide-react';
import { addMonths, subMonths, format } from 'date-fns';
import api from '../../api/client';
import { useTranslation } from '../../context/LanguageContext';
import { TourismEvent } from '../../types';
import { EventCard } from '../../components/tourism/EventCard';

export const CalendarPage: React.FC = () => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<TourismEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'MONTH' | 'ALL'>('MONTH');

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategory !== 'ALL') params.category = selectedCategory;

        if (viewMode === 'MONTH') {
          params.month = currentMonth.getMonth() + 1;
          params.year = currentMonth.getFullYear();
        } else {
          params.year = 2026;
        }

        const res = await api.get('/events', { params });
        if (res.data.success) {
          setEvents(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [currentMonth, selectedCategory, viewMode]);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const categories = [
    { code: 'ALL', label: t('calendar.catAll', 'ALL CATEGORIES') },
    { code: 'Religious', label: t('calendar.catReligious', 'RELIGIOUS') },
    { code: 'Cultural', label: t('calendar.catCultural', 'CULTURAL') },
    { code: 'Fair/Mela', label: t('calendar.catFairMela', 'FAIR / MELA') },
    { code: 'Heritage', label: t('calendar.catHeritage', 'HERITAGE') },
    { code: 'Music/Arts', label: t('calendar.catMusicArts', 'MUSIC & ARTS') },
    { code: 'Local/Regional', label: t('calendar.catLocalRegional', 'LOCAL & REGIONAL') }
  ];

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto my-6 bg-cream/85 backdrop-blur-sm rounded-2xl border border-brand-brown/15 p-4 sm:p-6 md:p-10 shadow-lg space-y-8">
      {/* Header */}
      <div className="border-b border-brand-brown/15 pb-6 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <span className="sub-nav-label text-brand-maroon">{t('calendar.badge', 'BIHAR TOURISM CALENDAR 2026')}</span>
          <span className="text-xs font-sans text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-bold">
            {t('calendar.verifiedBadge', '✓ Official 2026 Calendar Verified')}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-brand-black">{t('calendar.title', 'Festivals & Events 2026')}</h1>
        <p className="text-sm sm:text-base font-serif text-brand-black/75 max-w-2xl leading-relaxed">
          {t('calendar.subtitle', 'Discover year-round cultural fairs, sacred pilgrimage melas, music festivals, and heritage celebrations across all 38 districts of Bihar.')}
        </p>
      </div>

      {/* Control Bar: View Modes, Month Switcher & Categories */}
      <div className="bg-cream p-4 sm:p-5 rounded-lg border border-brand-brown/15 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-brand-brown/10 pb-4">
          {/* View Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto bg-white p-1 rounded border border-brand-brown/15">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`text-xs sub-nav-label px-3 py-2 rounded transition-all text-center ${
                viewMode === 'MONTH' ? 'bg-brand-black text-brand-gold font-bold' : 'text-brand-black/70 hover:text-brand-black'
              }`}
            >
              {t('calendar.monthlyView', 'MONTHLY VIEW')}
            </button>
            <button
              onClick={() => setViewMode('ALL')}
              className={`text-xs sub-nav-label px-3 py-2 rounded transition-all text-center ${
                viewMode === 'ALL' ? 'bg-brand-black text-brand-gold font-bold' : 'text-brand-black/70 hover:text-brand-black'
              }`}
            >
              {t('calendar.fullYearView', 'FULL YEAR 2026 (ALL EVENTS)')}
            </button>
          </div>

          {/* Month Navigator */}
          {viewMode === 'MONTH' && (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={prevMonth}
                className="p-2 border border-brand-brown/20 rounded bg-white hover:bg-cream-light text-brand-black"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-serif text-xl sm:text-2xl font-bold text-brand-black min-w-[140px] sm:min-w-[200px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>

              <button
                onClick={nextMonth}
                className="p-2 border border-brand-brown/20 rounded bg-white hover:bg-cream-light text-brand-black"
                aria-label="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold sub-nav-label text-brand-brown mr-2">{t('calendar.categoryLabel', 'CATEGORY:')}</span>
          {categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => setSelectedCategory(cat.code)}
              className={`text-xs sub-nav-label px-3.5 py-2 rounded transition-all ${
                selectedCategory === cat.code
                  ? 'bg-brand-maroon text-white font-bold shadow-sm'
                  : 'bg-white text-brand-black border border-brand-brown/15 hover:border-brand-maroon'
              }`}
            >
              {cat.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="py-20 text-center text-brand-brown font-serif text-lg">Loading 2026 Bihar tourism events...</div>
      ) : events.length === 0 ? (
        <div className="py-20 text-center bg-cream rounded-lg border border-brand-brown/15 p-8 space-y-3">
          <h3 className="font-serif text-2xl text-brand-black font-bold">No Events Found</h3>
          <p className="text-sm font-serif text-brand-brown/80">
            No events scheduled for {viewMode === 'MONTH' ? format(currentMonth, 'MMMM yyyy') : '2026'} under "{selectedCategory}".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setViewMode('ALL');
            }}
            className="px-4 py-2 bg-brand-black text-brand-gold text-xs sub-nav-label rounded font-bold"
          >
            VIEW ALL 2026 EVENTS
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-sans text-brand-brown border-b border-brand-brown/10 pb-2">
            <span>Showing <strong className="text-brand-black">{events.length}</strong> verified event(s) {viewMode === 'MONTH' ? `for ${format(currentMonth, 'MMMM yyyy')}` : 'in 2026'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
