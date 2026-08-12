'use client';

import { useState } from 'react';
import CategoriesTab from '@/components/staff/catalog/CategoriesTab';
import PincodesTab from '@/components/staff/catalog/PincodesTab';
import ServicesTab from '@/components/staff/catalog/ServicesTab';

const TABS = ['Categories', 'Services', 'Pincodes'] as const;

export default function AdminCatalogPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Categories');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Catalog</h1>
        <p className="mt-1 text-sm text-ink/60">Manage categories, services, and serviceable pincodes.</p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-black/5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t ? 'border-brand text-brand' : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Categories' && <CategoriesTab />}
      {tab === 'Services' && <ServicesTab />}
      {tab === 'Pincodes' && <PincodesTab />}
    </div>
  );
}