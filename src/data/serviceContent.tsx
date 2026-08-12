import type { ReactNode } from 'react';

export interface ServiceContentSection {
  title: string;
  image: string;      // /images/...
  imageAlt: string;
  included: string[]; // green ticks
  excluded: string[]; // red crosses
}

export interface ServiceContent {
  /** short intro shown above the sections */
  intro?: string;
  /** heading for the sections block */
  sectionsHeading?: string;
  sections: ServiceContentSection[];
  /** small note shown under the sections (e.g. "provide supplies") */
  note?: string;
  /** optional FAQ-ish extra blocks, rendered as heading + paragraph */
  extras?: { heading: string; body: ReactNode }[];
}

export const serviceContent: Record<string, ServiceContent> = {
  maid: {
    sectionsHeading: 'One helper can do it all',
    intro:
      'Book a trained, background-verified helper for daily chores. Pick what you need — from utensil cleaning to laundry and packing — and we handle the rest.',
    sections: [
      {
        title: 'Kitchen & utensil cleaning',
        image: '/images/kitchen-cleaning.webp',
        imageAlt: 'Clean crockery and utensils',
        included: ['Crockery & lunch boxes', 'Wiping cabinet exterior'],
        excluded: ['Hard food stains', 'Chimney'],
      },
      {
        title: 'Meal prep & serving',
        image: '/images/meal-prep.webp',
        imageAlt: 'Vegetables being chopped for meal prep',
        included: ['Veggies chopping & salad prep', 'Meat marination', 'Serving food'],
        excluded: ['Cooking full meals'],
      },
      {
        title: 'Mopping, dusting & wiping',
        image: '/images/mopping.webp',
        imageAlt: 'Mop and bucket for floor cleaning',
        included: ['Dusting & mopping floor', 'Wet wiping furniture'],
        excluded: ['Wiping walls', 'Hard to reach areas'],
      },
      {
        title: 'Bathroom cleaning',
        image: '/images/bathroom-cleaning.webp',
        imageAlt: 'Clean bathroom fittings',
        included: ['Toilet seat', 'Sink & taps'],
        excluded: ['Walls', 'Hard stains'],
      },
      {
        title: 'Laundry',
        image: '/images/laundry.webp',
        imageAlt: 'Laundry basket with clothes',
        included: ['Machine-wash & drying', 'Folding'],
        excluded: ['Hand-washing'],
      },
      {
        title: 'Packing & un-packing',
        image: '/images/packing.webp',
        imageAlt: 'Suitcase and moving boxes',
        included: ['Move-in / move-out', 'Vacation packing'],
        excluded: ['Lifting heavy objects', 'Moving full homes'],
      },
    ],
    note: 'Please provide cleaning equipment & supplies to the help.',
  },
};

export function getServiceContent(slug: string): ServiceContent | null {
  return serviceContent[slug] ?? null;
}
