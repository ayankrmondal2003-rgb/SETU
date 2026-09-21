import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete?: () => void;
  brandText?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  brandText = "BIHAR TOURISM & TRAVEL MARKETPLACE"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.94, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out' }
      )
        .fromTo(
          tagRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 0.5,
          ease: 'power3.out'
        });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-black text-cream p-6 pointer-events-none"
    >
      <h1
        ref={logoRef}
        className="font-serif text-6xl md:text-8xl tracking-widest text-brand-gold font-light"
      >
        SETU
      </h1>
      <p
        ref={tagRef}
        className="sub-nav-label text-cream/75 mt-4 text-center tracking-[0.3em]"
      >
        {brandText}
      </p>
    </div>
  );
};
