import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/client';
import { District } from '../../types';
import { DestinationCard } from '../../components/tourism/DestinationCard';
import { InteractiveMap } from '../../components/maps/InteractiveMap';
import { PhotoMosaic } from '../../components/common/PhotoMosaic';
import { Lightbox } from '../../components/common/Lightbox';

export const DistrictDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [district, setDistrict] = useState<District | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadDistrict() {
      try {
        const res = await api.get(`/districts/${slug}`);
        if (res.data.success) {
          setDistrict(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load district detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDistrict();
  }, [slug]);

  if (loading) {
    return <div className="pt-32 pb-24 text-center text-brand-brown font-serif">Loading district details...</div>;
  }

  if (!district) {
    return (
      <div className="pt-32 pb-24 text-center space-y-4">
        <h2 className="text-3xl font-serif text-brand-black">District Not Found</h2>
        <Link to="/explore/districts" className="text-brand-maroon underline sub-nav-label">Return to Districts</Link>
      </div>
    );
  }

  const galleryImages = (district.gallery && district.gallery.length > 0) ? district.gallery : [];

  return (
    <div className="pt-24 pb-24">
      {/* Banner */}
      <div className="relative h-[55vh] min-h-[380px] w-full bg-brand-black text-white overflow-hidden">
        <img src={district.heroImage} alt={district.name} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-black/30 to-transparent" />

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 space-y-3">
          <Link to="/explore/districts" className="inline-flex items-center space-x-2 text-xs sub-nav-label text-brand-gold hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>ALL DISTRICTS</span>
          </Link>
          <span className="text-xs sub-nav-label text-brand-gold block">{district.region}</span>
          <h1 className="text-4xl md:text-6xl font-serif text-cream">{district.name} District</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 space-y-12">
        {/* Overview Box */}
        <div className="bg-cream p-8 rounded border border-brand-brown/15 space-y-4">
          <h3 className="sub-nav-label text-brand-maroon">DISTRICT OVERVIEW</h3>
          <p className="font-serif text-lg text-brand-black/85 leading-relaxed">{district.description}</p>
        </div>

        {/* Photo Gallery */}
        {galleryImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="sub-nav-label text-brand-maroon">PHOTOGRAPHIC GALLERY OF {district.name.toUpperCase()}</h3>
              <span className="text-xs text-brand-brown font-sans">Click image to enlarge</span>
            </div>
            <PhotoMosaic
              images={galleryImages}
              altPrefix={`${district.name} District`}
              onImageClick={(idx) => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
            />
          </div>
        )}

        {/* Key Destinations */}
        <div className="space-y-6">
          <h3 className="sub-nav-label text-brand-maroon">DESTINATIONS IN {district.name.toUpperCase()}</h3>
          {district.destinations && district.destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {district.destinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          ) : (
            <p className="text-sm font-serif text-brand-brown/70">No specific destinations logged for this district yet.</p>
          )}
        </div>

        {/* Map */}
        <div className="space-y-4">
          <h3 className="sub-nav-label text-brand-maroon">{district.name.toUpperCase()} GEOGRAPHIC MAP</h3>
          <InteractiveMap
            destinations={district.destinations || []}
            height="400px"
            initialCenter={[district.latitude, district.longitude]}
            initialZoom={10}
          />
        </div>
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
