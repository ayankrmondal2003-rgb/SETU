import { User } from '../types';

/**
  * Determines whether a vendor business type falls under Hotel/Restaurant/Accommodation/Dining.
 */
export function isHotelOrRestaurantVendor(businessType?: string): boolean {
  if (!businessType) return false;
  const lower = businessType.toLowerCase();
  return (
    lower.includes('hotel') ||
    lower.includes('stay') ||
    lower.includes('resort') ||
    lower.includes('restaurant') ||
    lower.includes('dining') ||
    lower.includes('culinary')
  );
}

/**
 * Returns the appropriate home/dashboard route based on the authenticated user's role and vendor category.
 * - Admin -> /admin
 * - Hotel / Restaurant Vendor -> /vendor/dashboard
 * - Local / Handicraft / Product Vendor -> /vendor/local-dashboard
 * - Tourist or Unauthenticated -> /
 */
export function getHomeRouteForRole(user: User | null): string {
  if (!user) return '/';

  switch (user.role) {
    case 'ADMIN':
      return '/admin';
    case 'VENDOR': {
      const bType = user.vendor?.businessType;
      if (isHotelOrRestaurantVendor(bType)) {
        return '/vendor/dashboard';
      }
      return '/vendor/local-dashboard';
    }
    case 'TOURIST':
    default:
      return '/';
  }
}
