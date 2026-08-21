import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Destination } from '../../types';
import { FavoriteButton } from '../common/FavoriteButton';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  return (
    <div className="group bg-white border border-brand-brown/15 rounded overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3 z-10">
            <FavoriteButton targetType="destination" targetId={destination.id} />
          </div>
          <div className="absolute top-3 right-3 bg-brand-black/80 backdrop-blur-sm text-brand-gold text-[10px] sub-nav-label px-2.5 py-1 rounded">
            {destination.category}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 flex flex-col justify-end">
            <h3 className="text-xl font-serif text-white tracking-wide">{destination.name}</h3>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center space-x-1.5 text-xs text-brand-maroon font-sans font-medium">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{destination.district?.name || 'Bihar'}</span>
            {destination.circuit && (
              <>
                <span>•</span>
                <span className="text-brand-mustard">{destination.circuit.name}</span>
              </>
            )}
          </div>

          <p className="text-sm font-serif text-brand-black/75 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <Link
          to={`/explore/destinations/${destination.slug}`}
          className="inline-flex items-center justify-between w-full text-xs sub-nav-label text-brand-black font-semibold border-t border-brand-brown/10 pt-3 group-hover:text-brand-maroon transition-colors"
        >
          <span>VIEW DESTINATION</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
