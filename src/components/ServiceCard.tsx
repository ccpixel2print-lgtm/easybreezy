import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/data/services';

interface ServiceCardProps {
  service: Service;
  /** Optional index for staggered animation timing */
  index?: number;
}

/**
 * Reusable B2C service card.
 * Rendered by mapping over the `services` data array so the grid can be
 * driven by a database/API later without changing this component.
 */
export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const priceLabel = `Starting at ₹${service.startingPrice.toLocaleString('en-IN')}`;

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 80}ms` }}
      className="group flex animate-fade-up flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand shadow-sm backdrop-blur">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink">{service.name}</h3>
        <p className="mt-1 flex-1 text-sm text-ink/65">{service.description}</p>

        <p className="mt-3 text-sm font-semibold text-brand">
          {priceLabel}
        </p>

        <Link
          href={`/services/${service.slug}`}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-dark active:scale-95"
        >
          View &amp; Book
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
