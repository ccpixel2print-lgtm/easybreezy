/**
 * Central services data source.
 *
 * NOTE: This array is intentionally the single source of truth for the
 * B2C services grid. It is designed to be swapped out later for a
 * database/API response with the same shape — the UI maps over it, so no
 * component changes will be needed when wiring it up dynamically.
 */

export type ServiceCategory = 'Cleaning' | 'Repairs' | 'Home Care';

/**
 * A single bookable package under a service (e.g. "1 BHK Full Home Cleaning").
 * Rendered as a mapped card on the service detail page.
 */
export interface SubService {
  id: string;
  name: string;
  description: string;
  /** Price in INR */
  price: number;
  /** Human-readable estimated duration, e.g. "3–4 hrs" */
  duration: string;
  /** Thumbnail image path */
  image: string;
  imageAlt: string;
  /** Optional strike-through original price for a discount look */
  originalPrice?: number;
}

export interface Service {
  /** URL-friendly unique id (used for detail page routing later) */
  id?: string;
  slug: string;
  name: string;
  description: string;
  /** Longer marketing copy shown on the detail page banner */
  longDescription?: string;
  /** Starting price in INR (number so it can be formatted/sorted dynamically) */
  startingPrice: number;
  category: ServiceCategory;
  image: string;
  imageAlt: string;

  /** Social-proof placeholders for the detail banner */
  rating?: number;
  bookings?: string;

  /**
   * Flexible Option-B model:
   * - true  → this service is booked via a list of `subServices` (packages).
   * - false → this service is directly bookable (use `directPrice` + `directDuration`).
   */
  hasSubServices: boolean;
  subServices?: SubService[];

  /** Used only when hasSubServices === false */
  directPrice?: number;
  directDuration?: string;
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
    longDescription:
      'Certified, background-verified plumbers for every fix — from a dripping tap to complete bathroom fittings. Upfront pricing, quality spares and clean, tidy work.',
    startingPrice: 199,
    category: 'Repairs',
    image: '/images/plumber.webp',
    imageAlt: 'Uniformed Indian plumber fixing a tap in a modern home',
    rating: 4.8,
    bookings: '3,500+',
    hasSubServices: true,
    subServices: [
      {
        id: 'plumber-tap-repair',
        name: 'Tap / Faucet Repair',
        description: 'Fix leaking or loose taps and mixers.',
        price: 199,
        duration: '30–45 min',
        image: '/images/plumber.webp',
        imageAlt: 'Plumber repairing a tap',
      },
      {
        id: 'plumber-blockage',
        name: 'Drain / Blockage Clearing',
        description: 'Unclog sinks, washbasins and floor drains.',
        price: 349,
        duration: '45–60 min',
        image: '/images/plumber.webp',
        imageAlt: 'Plumber clearing a blocked drain',
      },
      {
        id: 'plumber-installation',
        name: 'Fitting Installation',
        description: 'Install taps, showers, health faucets & more.',
        price: 449,
        originalPrice: 549,
        duration: '1–2 hrs',
        image: '/images/plumber.webp',
        imageAlt: 'Plumber installing a bathroom fitting',
      },
    ],
  },
  {
    slug: 'electrician',
    name: 'Electrician',
    description: 'Certified electricians for wiring, switches & repairs.',
    longDescription:
      'Trained electricians for safe, reliable electrical work — switches, wiring, fans, lights and appliance installation, with genuine parts and neat finishing.',
    startingPrice: 199,
    category: 'Repairs',
    image: '/images/electrician.webp',
    imageAlt: 'Indian electrician working on a switchboard',
    rating: 4.7,
    bookings: '2,900+',
    hasSubServices: true,
    subServices: [
      {
        id: 'electrician-switchboard',
        name: 'Switch / Socket Repair',
        description: 'Repair or replace faulty switches & sockets.',
        price: 199,
        duration: '30–45 min',
        image: '/images/electrician.webp',
        imageAlt: 'Electrician repairing a switchboard',
      },
      {
        id: 'electrician-fan',
        name: 'Fan Installation / Repair',
        description: 'Install or fix ceiling, wall & exhaust fans.',
        price: 249,
        duration: '45 min',
        image: '/images/electrician.webp',
        imageAlt: 'Electrician installing a fan',
      },
      {
        id: 'electrician-wiring',
        name: 'Wiring & Fault Inspection',
        description: 'Diagnose and fix wiring faults safely.',
        price: 399,
        duration: '1–2 hrs',
        image: '/images/electrician.webp',
        imageAlt: 'Electrician inspecting wiring',
      },
    ],
  },
  {
    slug: 'maid',
    name: 'Maid',
    description: 'Reliable maids for daily cleaning & household help.',
    longDescription:
      'Trusted, verified maids for daily household chores — sweeping, mopping, dusting, dishes and more. Flexible, punctual and background-checked.',
    startingPrice: 299,
    category: 'Home Care',
    image: '/images/maid.webp',
    imageAlt: 'Indian maid cleaning a modern living room',
    rating: 4.8,
    bookings: '4,200+',
    hasSubServices: true,
    subServices: [
      {
        id: 'maid-1bhk',
        name: 'Daily Help — 1 BHK',
        description: 'Sweeping, mopping, dusting & dishes for a 1 BHK.',
        price: 299,
        duration: '1 hr / visit',
        image: '/images/maid.webp',
        imageAlt: 'Maid cleaning a 1 BHK home',
      },
      {
        id: 'maid-2bhk',
        name: 'Daily Help — 2 BHK',
        description: 'Full daily cleaning routine for a 2 BHK home.',
        price: 449,
        duration: '1.5 hr / visit',
        image: '/images/maid.webp',
        imageAlt: 'Maid cleaning a 2 BHK home',
      },
      {
        id: 'maid-3bhk',
        name: 'Daily Help — 3 BHK',
        description: 'Comprehensive daily help for a 3 BHK home.',
        price: 599,
        duration: '2 hr / visit',
        image: '/images/maid.webp',
        imageAlt: 'Maid cleaning a 3 BHK home',
      },
    ],
  },
  {
    slug: 'deep-cleaning',
    name: 'Deep Cleaning',
    description: 'Thorough deep cleaning for a spotless, fresh home.',
    longDescription:
      'A top-to-bottom deep clean for your entire home using professional-grade equipment and safe, hygienic products. Choose the package that fits your home size.',
    startingPrice: 1499,
    category: 'Cleaning',
    image: '/images/deep-cleaning.webp',
    imageAlt: 'Professional team performing deep cleaning in a home',
    rating: 4.8,
    bookings: '1,200+',
    hasSubServices: true,
    subServices: [
      {
        id: 'deep-1bhk',
        name: '1 BHK Full Home Cleaning',
        description: 'Complete deep clean of a 1 BHK — every room & corner.',
        price: 1499,
        originalPrice: 1799,
        duration: '3–4 hrs',
        image: '/images/deep-cleaning.webp',
        imageAlt: 'Deep cleaning a 1 BHK home',
      },
      {
        id: 'deep-2bhk',
        name: '2 BHK Full Home Cleaning',
        description: 'Thorough deep clean of a 2 BHK home end-to-end.',
        price: 2199,
        originalPrice: 2599,
        duration: '4–5 hrs',
        image: '/images/deep-cleaning.webp',
        imageAlt: 'Deep cleaning a 2 BHK home',
      },
      {
        id: 'deep-3bhk',
        name: '3 BHK Full Home Cleaning',
        description: 'Full deep clean of a spacious 3 BHK home.',
        price: 2999,
        originalPrice: 3499,
        duration: '5–6 hrs',
        image: '/images/deep-cleaning.webp',
        imageAlt: 'Deep cleaning a 3 BHK home',
      },
      {
        id: 'deep-bath-1',
        name: 'Bathroom Deep Cleaning (1 Bathroom)',
        description: 'Intensive scrub & sanitisation for one bathroom.',
        price: 449,
        duration: '45–60 min',
        image: '/images/bathroom-cleaning.webp',
        imageAlt: 'Deep cleaning one bathroom',
      },
      {
        id: 'deep-bath-2',
        name: 'Bathroom Deep Cleaning (2 Bathrooms)',
        description: 'Deep clean & sanitise two bathrooms.',
        price: 799,
        duration: '1.5 hrs',
        image: '/images/bathroom-cleaning.webp',
        imageAlt: 'Deep cleaning two bathrooms',
      },
    ],
  },
  {
    slug: 'ac-service',
    name: 'AC Service',
    description: 'Servicing, gas refill & repair for all AC types.',
    longDescription:
      'Keep your AC cooling efficiently with expert servicing, gas top-up and repairs for split, window and cassette units — handled by trained technicians.',
    startingPrice: 499,
    category: 'Repairs',
    image: '/images/ac-service.webp',
    imageAlt: 'Indian technician servicing a split air conditioner',
    rating: 4.7,
    bookings: '2,100+',
    hasSubServices: true,
    subServices: [
      {
        id: 'ac-basic',
        name: 'AC Basic Service',
        description: 'Filter cleaning, coil wash & performance check.',
        price: 499,
        duration: '45–60 min',
        image: '/images/ac-service.webp',
        imageAlt: 'Technician performing basic AC service',
      },
      {
        id: 'ac-deep',
        name: 'AC Deep Jet Service',
        description: 'High-pressure jet cleaning for maximum cooling.',
        price: 699,
        originalPrice: 849,
        duration: '1 hr',
        image: '/images/ac-service.webp',
        imageAlt: 'Technician deep-cleaning an AC unit',
      },
      {
        id: 'ac-gas',
        name: 'AC Gas Refill',
        description: 'Refrigerant top-up with leak check (all types).',
        price: 1999,
        duration: '1–2 hrs',
        image: '/images/ac-service.webp',
        imageAlt: 'Technician refilling AC gas',
      },
    ],
  },
  {
    slug: 'bathroom-cleaning',
    name: 'Bathroom Cleaning',
    description: 'Deep scrub for sparkling tiles, fittings & sanitaryware.',
    longDescription:
      'A single, no-fuss bathroom deep-clean at a flat price — descaling, sanitising and polishing of tiles, fittings and sanitaryware. Directly bookable, no packages to choose.',
    startingPrice: 449,
    category: 'Cleaning',
    image: '/images/bathroom-cleaning.webp',
    imageAlt: 'Indian professional deep-cleaning a modern bathroom',
    rating: 4.6,
    bookings: '1,800+',
    // Flexible model: NO sub-services — directly bookable at one price.
    hasSubServices: false,
    directPrice: 449,
    directDuration: '45–60 min',
  },
  {
    slug: 'sofa-cleaning',
    name: 'Sofa Cleaning',
    description: 'Shampoo & steam cleaning for fresh, hygienic upholstery.',
    longDescription:
      'Professional shampoo and steam cleaning for your upholstery. Pick the package by number of seats.',
    startingPrice: 399,
    category: 'Cleaning',
    image: '/images/sofa-cleaning.webp',
    imageAlt: 'Indian professional shampooing a fabric sofa',
    rating: 4.7,
    bookings: '1,500+',
    hasSubServices: true,
    subServices: [
      {
        id: 'sofa-3',
        name: 'Sofa Cleaning — 3 Seater',
        description: 'Shampoo & steam clean for a 3-seater sofa.',
        price: 399,
        duration: '45 min',
        image: '/images/sofa-cleaning.webp',
        imageAlt: 'Cleaning a 3 seater sofa',
      },
      {
        id: 'sofa-5',
        name: 'Sofa Cleaning — 5 Seater',
        description: 'Deep clean for a 5-seater sofa set.',
        price: 649,
        originalPrice: 799,
        duration: '1 hr',
        image: '/images/sofa-cleaning.webp',
        imageAlt: 'Cleaning a 5 seater sofa',
      },
      {
        id: 'sofa-7',
        name: 'Sofa Cleaning — 7 Seater',
        description: 'Complete upholstery clean for large sofa sets.',
        price: 899,
        originalPrice: 1099,
        duration: '1.5 hrs',
        image: '/images/sofa-cleaning.webp',
        imageAlt: 'Cleaning a 7 seater sofa',
      },
    ],
  },
  {
    slug: 'kitchen-cleaning',
    name: 'Kitchen Cleaning',
    description: 'Grease-free countertops, chimney & stove deep clean.',
    longDescription:
      'A flat-price kitchen deep clean — degreasing of countertops, chimney, stove, cabinets and tiles. Directly bookable with no packages to pick.',
    startingPrice: 599,
    category: 'Cleaning',
    image: '/images/kitchen-cleaning.webp',
    imageAlt: 'Indian professional deep-cleaning a modern kitchen',
    rating: 4.7,
    bookings: '1,300+',
    // Flexible model: NO sub-services — directly bookable at one price.
    hasSubServices: false,
    directPrice: 599,
    directDuration: '1.5–2 hrs',
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
