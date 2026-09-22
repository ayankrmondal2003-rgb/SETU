import { LocalizedText } from '../common/LocalizedText';
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { MapPin, Search, Filter, Compass } from 'lucide-react';
import { Destination, TourismEvent, Vendor } from '../../types';

// Custom SVG marker pin generator
const createCustomIcon = (type: 'destination' | 'event' | 'vendor' = 'destination', category: string = '') => {
  let color = '#5A1F24'; // default Maroon for Destinations
  if (type === 'event') {
    color = '#C2410C'; // Orange for Events/Fairs
  } else if (type === 'vendor') {
    color = '#1E40AF'; // Blue for Stays/Vendors
  } else {
    if (category.toLowerCase().includes('spiritual')) color = '#B88A28';
    if (category.toLowerCase().includes('eco') || category.toLowerCase().includes('wildlife')) color = '#2E7D32';
    if (category.toLowerCase().includes('heritage') || category.toLowerCase().includes('archaeological')) color = '#3B2118';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#FAF8F3" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

  return L.divIcon({
    html: svg,
    className: 'custom-map-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
};

interface InteractiveMapProps {
  destinations: Destination[];
  events?: TourismEvent[];
  vendors?: Vendor[];
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destinations,
  events = [],
  vendors = [],
  height = '650px',
  initialCenter = [25.4, 85.3], // Central Bihar view
  initialZoom = 8
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCircuit, setSelectedCircuit] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCircuit =
      selectedCircuit === 'ALL' || dest.circuit?.slug === selectedCircuit;

    const matchesDistrict =
      selectedDistrict === 'ALL' || dest.district?.slug === selectedDistrict;

    return matchesSearch && matchesCircuit && matchesDistrict;
  });

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.category && evt.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDistrict =
      selectedDistrict === 'ALL' || evt.district.toLowerCase() === selectedDistrict.toLowerCase();

    return matchesSearch && matchesDistrict;
  });

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.businessType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict =
      selectedDistrict === 'ALL' || v.district.toLowerCase() === selectedDistrict.toLowerCase();

    return matchesSearch && matchesDistrict;
  });

  const validVendorsCount = filteredVendors.filter(v => v.latitude && v.longitude).length;
  const totalCount = filteredDestinations.length + filteredEvents.length + validVendorsCount;

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Map Filter Controls Bar */}
      <div className="bg-cream p-4 rounded border border-brand-brown/15 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-brand-black/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search map locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-brand-brown/20 rounded text-xs pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-gold text-brand-black font-sans"
          />
        </div>

        {/* Circuit Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 text-brand-black/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedCircuit}
            onChange={(e) => setSelectedCircuit(e.target.value)}
            className="w-full bg-white border border-brand-brown/20 rounded text-xs pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-gold text-brand-black font-sans appearance-none"
          >
            <option value="ALL"><LocalizedText text={"All Circuits"} /></option>
            <option value="buddhist-circuit"><LocalizedText text={"Buddhist Circuit"} /></option>
            <option value="eco-circuit"><LocalizedText text={"Eco Circuit"} /></option>
            <option value="ramayan-circuit"><LocalizedText text={"Ramayan Circuit"} /></option>
            <option value="sikh-circuit"><LocalizedText text={"Sikh Circuit"} /></option>
          </select>
        </div>

        {/* District Filter */}
        <div className="relative">
          <Compass className="w-4 h-4 text-brand-black/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-white border border-brand-brown/20 rounded text-xs pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-gold text-brand-black font-sans appearance-none"
          >
            <option value="ALL"><LocalizedText text={"All Districts"} /></option>
            <option value="gaya"><LocalizedText text={"Gaya"} /></option>
            <option value="nalanda"><LocalizedText text={"Nalanda"} /></option>
            <option value="patna"><LocalizedText text={"Patna"} /></option>
            <option value="vaishali"><LocalizedText text={"Vaishali"} /></option>
            <option value="madhubani"><LocalizedText text={"Madhubani"} /></option>
            <option value="rohtas"><LocalizedText text={"Rohtas"} /></option>
            <option value="west-champaran"><LocalizedText text={"West Champaran"} /></option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded overflow-hidden shadow-lg border border-brand-brown/15" style={{ height }}>
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Tile Layer: OpenStreetMap Standard */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            referrerPolicy="strict-origin-when-cross-origin"
          />

          {/* Destination Markers */}
          {filteredDestinations.map((dest) => (
            <Marker
              key={`dest-${dest.id}`}
              position={[dest.latitude, dest.longitude]}
              icon={createCustomIcon('destination', dest.category)}
            >
              <Popup>
                <div className="flex flex-col">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-3 space-y-1.5 bg-cream">
                    <span className="text-[9px] sub-nav-label text-brand-maroon uppercase">{dest.category}</span>
                    <h4 className="font-serif text-base text-brand-black font-bold leading-tight">{dest.name}</h4>
                    <p className="text-xs text-brand-brown font-sans flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-brand-gold inline" />
                      <span>{dest.district?.name || 'Bihar'}</span>
                    </p>
                    <Link
                      to={`/explore/destinations/${dest.slug}`}
                      className="mt-2 block text-center bg-brand-maroon text-white text-xs sub-nav-label py-1.5 rounded hover:bg-brand-black transition-colors"
                    ><LocalizedText text={" EXPLORE DESTINATION → "} /></Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Tourism Event Markers */}
          {filteredEvents.map((evt) => {
            const catSlug = evt.category ? evt.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'cultural';
            return (
              <Marker
                key={`evt-${evt.id}`}
                position={[evt.latitude, evt.longitude]}
                icon={createCustomIcon('event')}
              >
                <Popup>
                  <div className="flex flex-col">
                    <img
                      src={evt.heroImage}
                      alt={evt.title}
                      className="w-full h-28 object-cover"
                    />
                    <div className="p-3 space-y-1.5 bg-cream">
                      <span className="text-[9px] sub-nav-label text-amber-700 uppercase"><LocalizedText text={"EVENT / FAIR"} /></span>
                      <h4 className="font-serif text-base text-brand-black font-bold leading-tight">{evt.title}</h4>
                      <p className="text-xs text-brand-brown font-sans flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-brand-gold inline" />
                        <span>{evt.district || evt.location}</span>
                      </p>
                      <Link
                        to={`/experience/${catSlug}/${evt.slug}`}
                        className="mt-2 block text-center bg-amber-700 text-white text-xs sub-nav-label py-1.5 rounded hover:bg-brand-black transition-colors"
                      ><LocalizedText text={" VIEW EVENT DETAILS → "} /></Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Vendor Markers */}
          {filteredVendors.map((vendor) => {
            if (!vendor.latitude || !vendor.longitude) return null;
            const image = vendor.coverImage || vendor.logo || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80';
            return (
              <Marker
                key={`vendor-${vendor.id}`}
                position={[vendor.latitude, vendor.longitude]}
                icon={createCustomIcon('vendor')}
              >
                <Popup>
                  <div className="flex flex-col">
                    <img
                      src={image}
                      alt={vendor.businessName}
                      className="w-full h-28 object-cover"
                    />
                    <div className="p-3 space-y-1.5 bg-cream">
                      <span className="text-[9px] sub-nav-label text-blue-700 uppercase">{vendor.businessType}</span>
                      <h4 className="font-serif text-base text-brand-black font-bold leading-tight">{vendor.businessName}</h4>
                      <p className="text-xs text-brand-brown font-sans flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-brand-gold inline" />
                        <span>{vendor.city}, {vendor.district}</span>
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-brown/70 font-sans px-1">
        <span><LocalizedText text={"Showing "} />{totalCount}<LocalizedText text={" interactive locations"} /></span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#B88A28] inline-block" /><span><LocalizedText text={"Spiritual"} /></span></span>
          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] inline-block" /><span><LocalizedText text={"Eco/Wildlife"} /></span></span>
          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#5A1F24] inline-block" /><span><LocalizedText text={"Heritage"} /></span></span>
          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] inline-block" /><span><LocalizedText text={"Events & Fairs"} /></span></span>
          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#1E40AF] inline-block" /><span><LocalizedText text={"Stays & Vendors"} /></span></span>
        </span>
      </div>
    </div>
  );
};
