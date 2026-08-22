'use client';

import { useMemo, useState } from 'react';
import { type Service } from '@/data/services';
import ServiceCard from './ServiceCard';

/**
 * Client component: renders the filter tabs + the mapped B2C service grid.
 * Category pills are derived from the services actually returned by the API,
 * so deactivating a category/service in admin removes its pill automatically.
 */
export default function ServicesGrid({ services }: { services: Service[] }) {
  // Build the pill list from live data: 'All' + each unique category present.
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(services.map((s) => s.category).filter(Boolean)),
    );
    return ['All', ...unique];
  }, [services]);

  const [active, setActive] = useState<string>('All');

  const filtered = useMemo(
    () =>
      active === 'All'
        ? services
        : services.filter((s) => s.category === active),
    [active, services],
  );

  return (
    <>
      {/* Category filter tabs */}
      <div
        role="tablist"
        aria-label="Filter services by category"
        className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-white text-ink/70 ring-1 ring-black/5 hover:bg-brand-tint hover:text-brand'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Mapped service grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((service, i) => (
          <ServiceCard key={service.slug} service={service} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-ink/60">
          No services found in this category yet.
        </p>
      )}
    </>
  );
}
