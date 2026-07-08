'use client';

import { useMemo, useState } from 'react';
import { serviceCategories, type Service } from '@/data/services';
import ServiceCard from './ServiceCard';

/**
 * Client component: renders the filter tabs + the mapped B2C service grid.
 * The grid is produced by `.map()` over the shared `services` data array,
 * so it stays fully dynamic-ready.
 */
export default function ServicesGrid({ services }: { services: Service[] }) {
  const [active, setActive] = useState<(typeof serviceCategories)[number]>('All');

  const filtered = useMemo(
    () =>
      active === 'All'
        ? services
        : services.filter((s) => s.category === active),
    [active]
  );

  return (
    <>
      {/* Category filter tabs */}
      <div
        role="tablist"
        aria-label="Filter services by category"
        className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        {serviceCategories.map((cat) => {
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
