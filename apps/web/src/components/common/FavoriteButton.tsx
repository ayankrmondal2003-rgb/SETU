import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import { Favorite } from '../../types';

interface FavoriteButtonProps {
  targetType: 'destination' | 'event';
  targetId: string;
  initialIsFavorite?: boolean;
  className?: string;
  iconSize?: string;
  onToggle?: (isFav: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  targetType,
  targetId,
  initialIsFavorite,
  className = '',
  iconSize = 'w-4 h-4',
  onToggle
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState<boolean>(initialIsFavorite || false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialIsFavorite !== undefined) {
      setIsFavorite(initialIsFavorite);
      return;
    }

    if (!user || user.role !== 'TOURIST' || !targetId) {
      return;
    }

    let isMounted = true;
    async function checkFavorite() {
      try {
        const res = await api.get('/favorites');
        if (res.data.success && isMounted) {
          const list: Favorite[] = res.data.data;
          const match = list.some(fav =>
            targetType === 'event' ? fav.eventId === targetId : fav.destinationId === targetId
          );
          setIsFavorite(match);
        }
      } catch (err) {
        // Silent catch
      }
    }
    checkFavorite();
    return () => {
      isMounted = false;
    };
  }, [user, targetId, targetType, initialIsFavorite]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('Please sign in to save your favorite spots and events', 'info');
      navigate('/login');
      return;
    }

    if (user.role !== 'TOURIST') {
      showToast('Only tourist accounts can save favorites', 'info');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${targetType}/${targetId}`);
        setIsFavorite(false);
        showToast('Removed from favorites', 'info');
        if (onToggle) onToggle(false);
      } else {
        await api.post('/favorites', targetType === 'event' ? { eventId: targetId } : { destinationId: targetId });
        setIsFavorite(true);
        showToast('Added to your favorites!', 'success');
        if (onToggle) onToggle(true);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update favorites', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
        isFavorite
          ? 'bg-red-500/15 text-red-500 hover:bg-red-500/25 border border-red-500/30'
          : 'bg-black/30 text-white hover:bg-black/50 hover:text-red-400 border border-white/20'
      } ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`${iconSize} transition-transform duration-300 ${
          isFavorite ? 'fill-red-500 text-red-500 scale-110' : ''
        }`}
      />
    </button>
  );
};
