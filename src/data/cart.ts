/**
 * Cart data source (placeholder).
 *
 * This array simulates items the customer has added. It is the single source
 * of truth for the cart UI, mapped over by the page — so it can later be
 * replaced by real cart state / API data with the same shape.
 *
 * NOTE: No images are used here on purpose — the UI renders grey placeholder
 * blocks. Real images will be wired in later.
 */

export interface CartItem {
  id: string;
  /** Service or sub-service name */
  name: string;
  description: string;
  /** Unit price in INR (per hour for hourly items, else per unit) */
  price: number;
  quantity: number;
  /** true → quantity represents hours and is adjustable */
  isHourly: boolean;
  /** Placeholder date/time selections shown on the row */
  preferredDate: string;
  preferredTime: string;
  pincode: string;
  /**
   * true → this is a "visiting / inspection" type service where only a visit
   * fee is charged now; final quote comes after inspection.
   */
  isInspection?: boolean;
}

export const cartItems: CartItem[] = [
  {
    id: 'deep-2bhk',
    name: '2 BHK Full Home Cleaning',
    description: 'Complete deep clean of a 2 BHK home, end-to-end.',
    price: 2199,
    quantity: 1,
    isHourly: false,
    preferredDate: 'Sat, 12 Jul 2026',
    preferredTime: '10:00 AM – 12:00 PM',
    pincode: '500087',
  },
  {
    id: 'maid-daily',
    name: 'Daily Maid Help',
    description: 'Sweeping, mopping, dusting & dishes — charged per hour.',
    price: 199,
    quantity: 2,
    isHourly: true,
    preferredDate: 'Mon, 14 Jul 2026',
    preferredTime: '08:00 AM – 10:00 AM',
    pincode: '500087',
  },
  {
    id: 'plumber-inspection',
    name: 'Plumbing Inspection Visit',
    description: 'Technician visit to diagnose the issue & share a quote.',
    price: 149,
    quantity: 1,
    isHourly: false,
    preferredDate: 'Sun, 13 Jul 2026',
    preferredTime: '04:00 PM – 06:00 PM',
    pincode: '500087',
    isInspection: true,
  },
];

/** GST rate applied on the subtotal. */
export const GST_RATE = 0.18;
