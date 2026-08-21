import React from 'react';
import { Eye } from 'lucide-react';

interface PhotoMosaicProps {
  images: string[];
  onImageClick: (index: number) => void;
  altPrefix?: string;
}

export const PhotoMosaic: React.FC<PhotoMosaicProps> = ({
  images,
  onImageClick,
  altPrefix = 'Gallery Photo'
}) => {
  if (!images || images.length === 0) {
    return (
      <div className="bg-cream/50 p-8 text-center rounded-xl border border-brand-brown/15 text-xs sub-nav-label text-brand-brown/70">
        NO GALLERY IMAGES AVAILABLE
      </div>
    );
  }

  const getTileClass = (idx: number, total: number): string => {
    if (total === 1) {
      return 'col-span-2 md:col-span-4 row-span-2 h-[320px] md:h-[400px]';
    }
    if (total === 2) {
      return 'col-span-1 md:col-span-2 row-span-2 h-[280px] md:h-[360px]';
    }

    const mod = idx % 6;
    switch (mod) {
      case 0:
        return 'col-span-2 md:col-span-2 row-span-2';
      case 2:
        return 'col-span-1 md:col-span-1 row-span-2';
      case 4:
        return 'col-span-2 md:col-span-2 row-span-1';
      case 1:
      case 3:
      case 5:
      default:
        return 'col-span-1 md:col-span-1 row-span-1';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[190px] gap-4 grid-flow-dense">
      {images.map((imgUrl, idx) => (
        <div
          key={idx}
          onClick={() => onImageClick(idx)}
          className={`group relative rounded-xl overflow-hidden cursor-pointer border border-brand-brown/15 shadow-sm hover:shadow-xl transition-all duration-500 bg-brand-black/10 ${getTileClass(
            idx,
            images.length
          )}`}
        >
          <img
            src={imgUrl}
            alt={`${altPrefix} ${idx + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-2 text-white p-4">
            <div className="w-10 h-10 rounded-full bg-brand-black/70 backdrop-blur-sm border border-brand-gold/50 flex items-center justify-center text-brand-gold transform group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-[10px] sub-nav-label tracking-widest text-brand-gold font-semibold uppercase">
              ENLARGE PHOTO
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
