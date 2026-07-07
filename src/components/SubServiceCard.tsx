import Image from 'next/image';
import type { SubService } from '@/data/services';
import AddToCartButton from './AddToCartButton';

interface SubServiceCardProps {
  subService: SubService;
  index?: number;
}

/**
 * Reusable bookable-package card. Rendered by mapping over a service's
 * `subServices` array — no hardcoded cards.
 */
export default function SubServiceCard({ subService, index = 0 }: SubServiceCardProps) {
  const price = `₹${subService.price.toLocaleString('en-IN')}`;
  const original =
    subService.originalPrice != null
      ? `₹${subService.originalPrice.toLocaleString('en-IN')}`
      : null;

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
      className="group flex animate-fade-up flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover sm:flex-row"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full flex-shrink-0 overflow-hidden sm:aspect-square sm:w-40">
        <Image
          src={subService.image}
          alt={subService.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, 160px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-base font-bold text-ink">{subService.name}</h3>
        <p className="mt-1 text-sm text-ink/65">{subService.description}</p>

        <div className="mt-2 flex items-center gap-2 text-xs text-ink/55">
          <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{subService.duration}</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-brand">{price}</span>
            {original && (
              <span className="text-sm text-ink/40 line-through">{original}</span>
            )}
          </div>
          <div className="w-32 sm:w-36">
            <AddToCartButton />
          </div>
        </div>
      </div>
    </article>
  );
}
