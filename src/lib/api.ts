import type { Service } from '@/data/services';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Raw shape returned by the backend
interface ApiService {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  longDescription: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  hasSubServices: boolean;
  startingPrice: number | null; // paise
  category: { name: string } | null;
}

// paise -> rupees
const toRupees = (paise: number | null | undefined) =>
  paise ? Math.round(paise / 100) : 0;

// Transform API service -> the Service shape the UI components expect
function mapService(api: ApiService): Service {
  return {
    slug: api.slug,
    name: api.name,
    description: api.description ?? '',
    longDescription: api.longDescription ?? undefined,
    startingPrice: toRupees(api.startingPrice),
    category: (api.category?.name ?? 'Home Care') as Service['category'],
    image: api.imageUrl ?? '/images/placeholder.webp',
    imageAlt: api.imageAlt ?? api.name,
    hasSubServices: api.hasSubServices,
  };
}

export async function fetchServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/catalog/services`, {
      // revalidate every 60s so DB changes show up without a rebuild
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data: ApiService[] = await res.json();
    return data.map(mapService);
  } catch (err) {
    console.error('fetchServices failed, falling back to static data:', err);
    // graceful fallback so the site never breaks if the API is down
    const { services } = await import('@/data/services');
    return services;
  }
}

import type { SubService } from '@/data/services';

interface ApiSubService {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  basePrice: number | null;
  originalPrice: number | null;
  durationLabel: string | null;
}

interface ApiServiceDetail extends ApiService {
  subServices: ApiSubService[];
}

function mapSubService(api: ApiSubService): SubService {
  return {
    id: api.id,
    name: api.name,
    description: api.description ?? '',
    price: toRupees(api.basePrice),
    originalPrice: api.originalPrice ? toRupees(api.originalPrice) : undefined,
    duration: api.durationLabel ?? '',
    image: api.imageUrl ?? '/images/placeholder.webp',
    imageAlt: api.imageAlt ?? api.name,
  };
}

export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(`${API_URL}/catalog/services/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const api: ApiServiceDetail = await res.json();

    return {
      ...mapService(api),
      longDescription: api.longDescription ?? undefined,
      hasSubServices: api.hasSubServices,
      subServices: api.subServices?.map(mapSubService) ?? [],
      // direct-booking price for services without sub-services
      directPrice: !api.hasSubServices ? toRupees(api.startingPrice) : undefined,
    };
  } catch (err) {
    console.error(`fetchServiceBySlug(${slug}) failed, falling back:`, err);
    const { services } = await import('@/data/services');
    return services.find((s) => s.slug === slug) ?? null;
  }
}

export async function fetchServiceSlugs(): Promise<string[]> {
  const services = await fetchServices();
  return services.map((s) => s.slug);
}

// ---- Serviceability ----

export interface PincodeCheckResult {
  serviceable: boolean;
  areaName?: string | null;
  city?: string | null;
}

export async function checkPincode(pincode: string): Promise<PincodeCheckResult> {
  try {
    const res = await fetch(`${API_URL}/serviceability/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode }),
      cache: 'no-store', // always live, never cached
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return (await res.json()) as PincodeCheckResult;
  } catch (err) {
    console.error(`checkPincode(${pincode}) failed:`, err);
    // On failure, treat as not serviceable but let caller show a soft error
    return { serviceable: false };
  }
}

export interface LeadInput {
  pincode: string;
  email?: string;
  phone?: string;
  serviceId?: string;
}

export async function captureLead(data: LeadInput): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const json = await res.json();
    return json?.captured === true;
  } catch (err) {
    console.error('captureLead failed:', err);
    return false;
  }
}
