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
