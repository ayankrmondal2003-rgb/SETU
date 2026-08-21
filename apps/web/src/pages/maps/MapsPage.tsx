import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Compass,
  Search,
  Filter,
  Star,
  MapPin,
  Building2,
  Stethoscope,
  Hotel as HotelIcon,
  Landmark,
  X,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2
} from 'lucide-react';
import api from '../../api/client';
import { CityHub, HubPlace } from '../../types';

// Custom SVG map marker generator for Hub-level pin with count badge
function createHubIcon(hub: CityHub, selectedCategory: string, isSelected: boolean) {
  let count = hub.touristPlaces.length;
  if (selectedCategory !== 'ALL') {
    count = hub.touristPlaces.filter(p => p.type === selectedCategory).length;
  }

  const mainColor = isSelected ? '#B88A28' : '#5A1F24'; // Gold when active, Maroon default
  const strokeColor = isSelected ? '#FFFFFF' : '#FAF8F3';

  const svgHtml = `
    <div style="position: relative; width: 38px; height: 48px; display: flex; align-items: center; justify-content: center;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${mainColor}" width="38" height="48" stroke="${strokeColor}" stroke-width="1.5" style="filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.35));">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      <div style="position: absolute; top: 4px; right: -4px; background-color: #B88A28; color: #1E120B; font-weight: 700; font-size: 10px; font-family: monospace; border-radius: 9999px; padding: 2px 6px; border: 1.5px solid #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
        ${count}
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'city-hub-custom-icon',
    iconSize: [38, 48],
    iconAnchor: [19, 48],
    popupAnchor: [0, -44]
  });
}

// Custom SVG marker generator for individual Place/Amenity level pins
function createPlaceIcon(type: 'Tourist Place' | 'Hospital' | 'Hotel' | 'Temple') {
  let bgColor = '#991B1B'; // Maroon for Tourist Place
  let symbol = '🗺️';

  if (type === 'Hospital') {
    bgColor = '#1D4ED8'; // Blue for Hospital
    symbol = '🏥';
  } else if (type === 'Hotel') {
    bgColor = '#047857'; // Emerald for Hotel
    symbol = '🏨';
  } else if (type === 'Temple') {
    bgColor = '#D97706'; // Amber for Temple
    symbol = '🏛️';
  }

  const svgHtml = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background-color: ${bgColor}; border: 2.5px solid #FFFFFF; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0,0,0,0.45); transform: scale(1.15);">
      <span style="font-size: 17px; line-height: 1;">${symbol}</span>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'city-place-custom-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
}

// Leaflet map recenter helper
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export const MapsPage: React.FC = () => {
  const [hubs, setHubs] = useState<CityHub[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter 1: Location selection ('ALL' or slug)
  const [selectedHubSlug, setSelectedHubSlug] = useState<string>('ALL');

  // Filter 2: Category selection ('ALL' | 'Tourist Place' | 'Hospital' | 'Hotel' | 'Temple')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Hub for detail side panel
  const [activeHub, setActiveHub] = useState<CityHub | null>(null);

  // Selected Place for individual place marker & flyTo map view
  const [selectedPlace, setSelectedPlace] = useState<HubPlace | null>(null);

  // Map center and zoom state
  const [mapCenter, setMapCenter] = useState<[number, number]>([25.4, 85.8]);
  const [mapZoom, setMapZoom] = useState<number>(7);

  // Fetch City Hubs dataset from backend API
  useEffect(() => {
    async function loadCityHubs() {
      try {
        const res = await api.get('/city-hubs');
        if (res.data.success) {
          setHubs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch City Hubs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCityHubs();
  }, []);

  // Sync Location selection with map position & active hub panel
  const handleLocationChange = (slug: string) => {
    setSelectedHubSlug(slug);
    setSelectedPlace(null);

    if (slug === 'ALL') {
      setActiveHub(null);
      setMapCenter([25.4, 85.8]);
      setMapZoom(7);
    } else {
      const found = hubs.find(h => h.slug === slug);
      if (found) {
        setActiveHub(found);
        setMapCenter([found.latitude, found.longitude]);
        setMapZoom(11);
      }
    }
  };

  // Filter hubs based on Search & Location filter
  const filteredHubs = useMemo(() => {
    return hubs.filter(hub => {
      const matchesSlug = selectedHubSlug === 'ALL' || hub.slug === selectedHubSlug;

      if (!searchQuery.trim()) return matchesSlug;

      const query = searchQuery.toLowerCase();
      const nameMatch = hub.name.toLowerCase().includes(query);
      const summaryMatch = hub.summary.toLowerCase().includes(query);
      const placeMatch = hub.touristPlaces.some(p =>
        p.name.toLowerCase().includes(query) || p.type.toLowerCase().includes(query)
      );

      return matchesSlug && (nameMatch || summaryMatch || placeMatch);
    });
  }, [hubs, selectedHubSlug, searchQuery]);

  // Handle Hub Marker Selection
  const handleHubSelect = (hub: CityHub) => {
    setActiveHub(hub);
    setSelectedHubSlug(hub.slug);
    setSelectedPlace(null);
    setMapCenter([hub.latitude, hub.longitude]);
    setMapZoom(11);
  };

  // Helper for category badge icons
  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'Hospital':
        return <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'Hotel':
        return <HotelIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'Temple':
        return <Landmark className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-brand-maroon shrink-0" />;
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-[1500px] mx-auto space-y-6">
      {/* 1. Header Section */}
      <div className="bg-cream/90 backdrop-blur-md p-6 rounded-xl border border-brand-brown/15 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-brand-maroon">
          <Building2 className="w-5 h-5" />
          <span className="sub-nav-label tracking-widest text-xs font-semibold">URBAN INTELLIGENCE MATRIX</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif text-brand-black">Bihar City Hub Explorer</h1>
            <p className="text-sm font-serif text-brand-black/75 mt-1 max-w-3xl leading-relaxed">
              Comprehensive 8-location urban matrix featuring tourism scores, healthcare rating, hospitality infrastructure, business connectivity, and individual place-level map navigation.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/80 p-3 rounded-lg border border-brand-brown/20 text-xs text-brand-black">
            <Award className="w-5 h-5 text-brand-gold shrink-0" />
            <div>
              <div className="font-bold">8 Dedicated City Hubs</div>
              <div className="text-brand-brown text-[11px]">Individual Amenity Map Markers</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Two-Stage Filter & Search Control Bar */}
      <div className="bg-brand-black text-white p-4 md:p-5 rounded-xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        {/* FILTER 1: Select Location */}
        <div className="space-y-1">
          <label className="text-[11px] sub-nav-label text-brand-gold tracking-wider block">
            LOCATION HUB
          </label>
          <select
            value={selectedHubSlug}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-xs text-cream font-medium focus:outline-none focus:border-brand-gold transition-colors"
          >
            <option value="ALL" className="bg-brand-black text-white">All 8 City Hubs</option>
            {hubs.map(hub => (
              <option key={hub.id} value={hub.slug} className="bg-brand-black text-white">
                {hub.name} ({hub.region}) — {hub.overallScore}/10
              </option>
            ))}
          </select>
        </div>

        {/* FILTER 2: Filter By Category */}
        <div className="space-y-1">
          <label className="text-[11px] sub-nav-label text-brand-gold tracking-wider block">
            FILTER CATEGORY
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-xs text-cream font-medium focus:outline-none focus:border-brand-gold transition-colors"
          >
            <option value="ALL" className="bg-brand-black text-white">All Categories (Places, Medical, Hotels)</option>
            <option value="Tourist Place" className="bg-brand-black text-white">Tourist Places & Heritage</option>
            <option value="Hospital" className="bg-brand-black text-white">Hospitals & Healthcare</option>
            <option value="Hotel" className="bg-brand-black text-white">Hotels & Stays</option>
            <option value="Temple" className="bg-brand-black text-white">Temples & Holy Sites</option>
          </select>
        </div>

        {/* SEARCH BOX */}
        <div className="space-y-1">
          <label className="text-[11px] sub-nav-label text-brand-gold tracking-wider block">
            SEARCH PLACES & HUBS
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search AIIMS, Bodhi Tree, Golghar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded pl-9 pr-3 py-2 text-xs text-cream placeholder-white/40 focus:outline-none focus:border-brand-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* RESET & SUMMARY */}
        <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0">
          <div className="text-right">
            <div className="text-xs font-semibold text-brand-gold">{filteredHubs.length} Hubs Visible</div>
            <div className="text-[11px] text-white/60">
              {selectedCategory === 'ALL' ? 'Showing All Places' : `Filtered: ${selectedCategory}`}
            </div>
          </div>
          {(selectedHubSlug !== 'ALL' || selectedCategory !== 'ALL' || searchQuery !== '' || selectedPlace !== null) && (
            <button
              onClick={() => {
                setSelectedHubSlug('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
                setActiveHub(null);
                setSelectedPlace(null);
                setMapCenter([25.4, 85.8]);
                setMapZoom(7);
              }}
              className="px-3 py-2 bg-white/15 hover:bg-white/25 text-cream rounded text-xs transition-colors flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Explorer Body (Map + Side Panel) */}
      {loading ? (
        <div className="py-24 text-center text-brand-brown font-serif text-lg">
          Loading City Hub Explorer dataset...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* MAP CANVAS (8 or 7 cols when panel open) */}
          <div className={`${activeHub ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-300 relative rounded-xl overflow-hidden border border-brand-brown/20 shadow-md h-[400px] sm:h-[500px] lg:h-[680px]`}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={false}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController center={mapCenter} zoom={mapZoom} />

              {/* Render City Hub Level Markers */}
              {filteredHubs.map(hub => {
                const isSelected = activeHub?.id === hub.id;
                const icon = createHubIcon(hub, selectedCategory, isSelected);

                let placesToShow = hub.touristPlaces;
                if (selectedCategory !== 'ALL') {
                  placesToShow = placesToShow.filter(p => p.type === selectedCategory);
                }

                return (
                  <Marker
                    key={hub.id}
                    position={[hub.latitude, hub.longitude]}
                    icon={icon}
                    eventHandlers={{
                      click: () => handleHubSelect(hub)
                    }}
                  >
                    <Popup className="city-hub-popup">
                      <div className="p-1 space-y-2 max-w-xs font-sans">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sub-nav-label text-brand-maroon uppercase">{hub.region}</span>
                          <span className="text-xs font-bold bg-brand-gold text-brand-black px-1.5 py-0.5 rounded font-mono">
                            ★ {hub.overallScore}/10
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-brand-black leading-tight">{hub.name}</h4>
                        <p className="text-xs text-brand-brown line-clamp-2">{hub.summary}</p>

                        <div className="text-[11px] bg-cream p-2 rounded border border-brand-brown/15 font-serif italic text-brand-black/85">
                          "{hub.verdict}"
                        </div>

                        <div className="text-xs font-semibold text-brand-maroon">
                          {placesToShow.length} {selectedCategory === 'ALL' ? 'Places & Facilities' : selectedCategory + 's'}
                        </div>

                        <button
                          onClick={() => handleHubSelect(hub)}
                          className="w-full py-1.5 bg-brand-black text-cream rounded text-xs font-medium hover:bg-brand-maroon transition-colors flex items-center justify-center space-x-1"
                        >
                          <span>Open City Hub Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Render Individual Place Level Marker when a place is selected */}
              {selectedPlace && (
                <Marker
                  key={`place-${selectedPlace.name}`}
                  position={[selectedPlace.latitude, selectedPlace.longitude]}
                  icon={createPlaceIcon(selectedPlace.type)}
                  ref={(ref) => {
                    if (ref) {
                      ref.openPopup();
                    }
                  }}
                >
                  <Popup className="city-place-popup" autoPan={true}>
                    <div className="p-1.5 space-y-2 max-w-xs font-sans">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-sans px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          selectedPlace.type === 'Hospital' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          selectedPlace.type === 'Hotel' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          selectedPlace.type === 'Temple' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {selectedPlace.type}
                        </span>
                        <span className="text-[10px] text-brand-brown font-mono font-bold">
                          {activeHub?.name} HUB
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-base text-brand-black leading-tight">
                        {selectedPlace.name}
                      </h4>

                      <div className="text-[11px] text-brand-brown/80 flex items-center space-x-1.5 pt-1.5 border-t border-slate-100">
                        <MapPin className="w-3.5 h-3.5 text-brand-maroon shrink-0" />
                        <span>Coordinates: ({selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)})</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            {/* Quick Hub Selector Ribbon on Map */}
            <div className="absolute top-3 left-3 right-3 z-[1000] pointer-events-none flex items-center justify-between">
              <div className="pointer-events-auto bg-brand-black/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-serif flex items-center space-x-2 border border-white/20 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>Showing 8 Verified Bihar City Hubs</span>
              </div>
            </div>
          </div>

          {/* SIDE DETAIL PANEL (5 cols when open) */}
          {activeHub ? (
            <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-xl border border-brand-brown/20 shadow-xl overflow-hidden flex flex-col h-[480px] sm:h-[560px] lg:h-[680px] animate-fadeIn">
              {/* Hub Banner */}
              <div className="relative h-48 w-full bg-brand-black text-white shrink-0">
                <img
                  src={activeHub.heroImage}
                  alt={activeHub.name}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/30 to-transparent" />

                <button
                  onClick={() => {
                    setActiveHub(null);
                    setSelectedPlace(null);
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-10"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <span className="text-[10px] sub-nav-label text-brand-gold uppercase tracking-widest block">
                    {activeHub.region} REGION
                  </span>
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-3xl font-serif text-cream font-bold">{activeHub.name}</h2>
                    <div className="bg-brand-gold text-brand-black px-2.5 py-1 rounded text-sm font-mono font-bold shadow">
                      ★ {activeHub.overallScore} / 10
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Panel Content */}
              <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                {/* Verdict Box */}
                <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-lg space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs sub-nav-label text-amber-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>KEY VERDICT & ASSESSMENT</span>
                  </div>
                  <p className="font-serif text-sm font-semibold text-amber-900 leading-snug">
                    "{activeHub.verdict}"
                  </p>
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-xs sub-nav-label text-brand-maroon">CITY SUMMARY</h4>
                  <p className="text-sm font-serif text-brand-black/85 leading-relaxed bg-cream/60 p-3 rounded border border-brand-brown/10">
                    {activeHub.summary}
                  </p>
                </div>

                {/* Six Category Ratings Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sub-nav-label text-brand-maroon">CATEGORY RATING MATRIX (0 - 5 STARS)</h4>
                    <span className="text-[11px] text-brand-brown font-mono font-semibold">Scale: 0.0 – 5.0</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Tourism */}
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>🗺️ Tourism</span>
                        <span className="font-mono text-brand-maroon">{activeHub.tourismRating} / 5</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-brand-maroon h-full rounded-full" style={{ width: `${(activeHub.tourismRating / 5) * 100}%` }} />
                      </div>
                    </div>

                    {/* Hospitals */}
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>🏥 Hospitals</span>
                        <span className="font-mono text-blue-700">{activeHub.hospitalRating} / 5</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(activeHub.hospitalRating / 5) * 100}%` }} />
                      </div>
                    </div>

                    {/* Hotels */}
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>🏨 Hotels & Stays</span>
                        <span className="font-mono text-emerald-700">{activeHub.hotelRating} / 5</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(activeHub.hotelRating / 5) * 100}%` }} />
                      </div>
                    </div>

                    {/* Business */}
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>💼 Business & Trade</span>
                        <span className="font-mono text-purple-700">{activeHub.businessRating} / 5</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(activeHub.businessRating / 5) * 100}%` }} />
                      </div>
                    </div>

                    {/* Education */}
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>🎓 Education</span>
                        <span className="font-mono text-amber-700">{activeHub.educationRating} / 5</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full rounded-full" style={{ width: `${(activeHub.educationRating / 5) * 100}%` }} />
                      </div>
                    </div>

                    {/* Infrastructure */}
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>🏗️ Transport & Infra</span>
                        <span className="font-mono text-indigo-700">{activeHub.infrastructureRating} / 5</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(activeHub.infrastructureRating / 5) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Places & Facilities List Filtered by Filter 2 */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sub-nav-label text-brand-maroon">
                      LOCAL PLACES & FACILITIES ({
                        selectedCategory === 'ALL'
                          ? activeHub.touristPlaces.length
                          : activeHub.touristPlaces.filter(p => p.type === selectedCategory).length
                      })
                    </h4>

                    {/* Filter 2 Pill Switcher Inside Panel */}
                    <div className="flex items-center space-x-1 text-[11px]">
                      {['ALL', 'Tourist Place', 'Hospital', 'Hotel', 'Temple'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            selectedCategory === cat
                              ? 'bg-brand-maroon text-white font-semibold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat === 'ALL' ? 'All' : cat.replace('Tourist Place', 'Tourist')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Render Interactive Clickable Places List */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {activeHub.touristPlaces
                      .filter(p => selectedCategory === 'ALL' || p.type === selectedCategory)
                      .map((place, idx) => {
                        const isPlaceSelected = selectedPlace?.name === place.name;
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedPlace(place);
                              setMapCenter([place.latitude, place.longitude]);
                              setMapZoom(15);
                            }}
                            className={`flex items-center justify-between p-2.5 rounded border transition-all cursor-pointer text-xs ${
                              isPlaceSelected
                                ? 'border-brand-gold bg-amber-50/90 shadow-md font-semibold ring-2 ring-brand-gold/40'
                                : 'bg-cream/70 hover:bg-cream border-brand-brown/10'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              {getCategoryIcon(place.type)}
                              <span className="font-serif text-brand-black">{place.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-[10px] font-sans px-2 py-0.5 rounded font-medium ${
                                place.type === 'Hospital' ? 'bg-blue-100 text-blue-800' :
                                place.type === 'Hotel' ? 'bg-emerald-100 text-emerald-800' :
                                place.type === 'Temple' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {place.type}
                              </span>
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isPlaceSelected ? 'text-brand-gold translate-x-0.5' : 'text-brand-brown/40'}`} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* When no hub selected, display 8-Hub Cards Overview Grid */
            <div className="lg:col-span-12 space-y-4 pt-4 border-t border-brand-brown/15">
              <div className="flex items-center justify-between">
                <h3 className="sub-nav-label text-brand-maroon">ALL 8 BIHAR CITY HUBS SUMMARY MATRIX</h3>
                <span className="text-xs text-brand-brown font-serif">Click any hub card or map pin to inspect rating details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {hubs.map(hub => (
                  <div
                    key={hub.id}
                    onClick={() => handleHubSelect(hub)}
                    className="bg-white p-4 rounded-xl border border-brand-brown/15 hover:border-brand-gold hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="sub-nav-label text-brand-maroon">{hub.region}</span>
                        <span className="font-mono font-bold bg-brand-gold/20 text-brand-black px-2 py-0.5 rounded">
                          ★ {hub.overallScore}/10
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-brand-black group-hover:text-brand-maroon transition-colors">
                        {hub.name}
                      </h4>
                      <p className="text-xs font-serif text-brand-brown line-clamp-2 leading-relaxed">
                        {hub.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-brand-maroon font-semibold">
                      <span>{hub.touristPlaces.length} Places & Services</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
