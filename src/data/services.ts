/**
 * Central services data source.
 *
 * NOTE: This array is intentionally the single source of truth for the
 * B2C services grid. It is designed to be swapped out later for a
 * database/API response with the same shape — the UI maps over it, so no
 * component changes will be needed when wiring it up dynamically.
 */

export type ServiceCategory = 'Cleaning' | 'Repairs' | 'Home Care';

export interface Service {
  /** URL-friendly unique id (used for detail page routing later) */
  slug: string;
  name: string;
  description: string;
  /** Starting price in INR (number so it can be formatted/sorted dynamically) */
  startingPrice: number;
  category: ServiceCategory;
  image: string;
  imageAlt: string;
}

export const serviceCategories: Array<'All' | ServiceCategory> = [
  'All',
  'Cleaning',
  'Repairs',
  'Home Care',
];

export const services: Service[] = [
  {
    slug: 'plumber',
    name: 'Plumber',
    description: 'Expert plumbers for leaks, fittings, taps & blockages.',
    startingPrice: 199,
    category: 'Repairs',
    image: '/images/plumber.webp',
    imageAlt: 'Uniformed Indian plumber fixing a tap in a modern home',
  },
  {
    slug: 'electrician',
    name: 'Electrician',
    description: 'Certified electricians for wiring, switches & repairs.',
    startingPrice: 199,
    category: 'Repairs',
    image: '/images/electrician.webp',
    imageAlt: 'Indian electrician working on a switchboard',
  },
  {
    slug: 'maid',
    name: 'Maid',
    description: 'Reliable maids for daily cleaning & household help.',
    startingPrice: 299,
    category: 'Home Care',
    image: '/images/maid.webp',
    imageAlt: 'Indian maid cleaning a modern living room',
  },
  {
    slug: 'deep-cleaning',
    name: 'Deep Cleaning',
    description: 'Thorough deep cleaning for a spotless, fresh home.',
    startingPrice: 1499,
    category: 'Cleaning',
    image: '/images/deep-cleaning.webp',
    imageAlt: 'Professional team performing deep cleaning in a home',
  },
  {
    slug: 'ac-service',
    name: 'AC Service',
    description: 'Servicing, gas refill & repair for all AC types.',
    startingPrice: 499,
    category: 'Repairs',
    image: '/images/ac-service.webp',
    imageAlt: 'Indian technician servicing a split air conditioner',
  },
  {
    slug: 'bathroom-cleaning',
    name: 'Bathroom Cleaning',
    description: 'Deep scrub for sparkling tiles, fittings & sanitaryware.',
    startingPrice: 449,
    category: 'Cleaning',
    image: '/images/bathroom-cleaning.webp',
    imageAlt: 'Indian professional deep-cleaning a modern bathroom',
  },
  {
    slug: 'sofa-cleaning',
    name: 'Sofa Cleaning',
    description: 'Shampoo & steam cleaning for fresh, hygienic upholstery.',
    startingPrice: 399,
    category: 'Cleaning',
    image: '/images/sofa-cleaning.webp',
    imageAlt: 'Indian professional shampooing a fabric sofa',
  },
  {
    slug: 'kitchen-cleaning',
    name: 'Kitchen Cleaning',
    description: 'Grease-free countertops, chimney & stove deep clean.',
    startingPrice: 599,
    category: 'Cleaning',
    image: '/images/kitchen-cleaning.webp',
    imageAlt: 'Indian professional deep-cleaning a modern kitchen',
  },
];

export interface BusinessService {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const businessServices: BusinessService[] = [
  {
    name: 'Apartment Maintenance',
    description:
      'End-to-end upkeep for societies — plumbing, electrical & facility care.',
    image: '/images/maintenance.webp',
    imageAlt: 'Maintenance crew working in a modern apartment complex',
  },
  {
    name: 'Housekeeping',
    description:
      'Trained housekeeping staff to keep common areas spotless and welcoming.',
    image: '/images/housekeeping.webp',
    imageAlt: 'Housekeeping staff cleaning a residential building lobby',
  },
  {
    name: 'Security',
    description:
      'Verified, trained guards for safe and secure residential premises.',
    image: '/images/security.webp',
    imageAlt: 'Security guard on duty at an apartment gate',
  },
];
