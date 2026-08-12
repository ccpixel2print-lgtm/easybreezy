'use client';

import { useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  createService, updateService,
  type AdminService, type AdminCategory, type ServicePayload, type PricingType,
} from '@/lib/staffApi';
import { rupeesToPaise, paiseToRupeeInput } from '@/lib/format';
import { CatalogModal, CatalogInput, ModalActions, ErrorBox } from './shared';

const PRICING: PricingType[] = ['FIXED', 'HOURLY', 'VISITING'];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function ServiceModal({
  service, categories, onClose, onSaved,
}: {
  service: AdminService | null;
  categories: AdminCategory[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { token } = useStaffAuth();
  const isNew = !service;

  const [f, setF] = useState({
    categoryId: service?.categoryId ?? service?.category?.id ?? '',
    name: service?.name ?? '',
    slug: service?.slug ?? '',
    description: service?.description ?? '',
    longDescription: service?.longDescription ?? '',
    imageUrl: service?.imageUrl ?? '',
    imageAlt: service?.imageAlt ?? '',
    hasSubServices: service?.hasSubServices ?? false,
    pricingType: (service?.pricingType ?? 'FIXED') as PricingType,
    basePrice: paiseToRupeeInput(service?.basePrice),
    hourlyRate: paiseToRupeeInput(service?.hourlyRate),
    visitFee: paiseToRupeeInput(service?.visitFee),
    startingPrice: paiseToRupeeInput(service?.startingPrice),
    durationLabel: service?.durationLabel ?? '',
    displayOrder: service?.displayOrder?.toString() ?? '',
    active: service?.active ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    if (!f.categoryId) return setError('Please select a category.');
    if (!f.name.trim()) return setError('Name is required.');
    if (!token) return;

    const body: ServicePayload = {
      categoryId: f.categoryId,
      name: f.name.trim(),
      slug: (f.slug.trim() || slugify(f.name)) || undefined,
      description: f.description.trim() || undefined,
      longDescription: f.longDescription.trim() || undefined,
      imageUrl: f.imageUrl.trim() || undefined,
      imageAlt: f.imageAlt.trim() || undefined,
      hasSubServices: f.hasSubServices,
      pricingType: f.pricingType,
      basePrice: rupeesToPaise(f.basePrice),
      hourlyRate: rupeesToPaise(f.hourlyRate),
      visitFee: rupeesToPaise(f.visitFee),
      startingPrice: rupeesToPaise(f.startingPrice),
      durationLabel: f.durationLabel.trim() || undefined,
      displayOrder: f.displayOrder === '' ? undefined : Number(f.displayOrder),
      active: f.active,
    };

    setSubmitting(true);
    try {
      if (isNew) await createService(token, body);
      else await updateService(token, service!.id, body);
      await onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
      setSubmitting(false);
    }
  }

  return (
    <CatalogModal title={isNew ? 'Add service' : `Edit ${service!.name}`} onClose={onClose}>
      {error && <ErrorBox msg={error} />}
      <form onSubmit={submit} className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Category</label>
          <select value={f.categoryId} onChange={(e) => set('categoryId', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand">
            <option value="">Select…</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <CatalogInput label="Name" value={f.name} onChange={(e) => set('name', e.target.value)} autoFocus />
        <CatalogInput label="Slug (auto if blank)" value={f.slug} onChange={(e) => set('slug', e.target.value)} placeholder={f.name ? slugify(f.name) : 'auto-generated'} />
        <CatalogInput label="Short description" value={f.description} onChange={(e) => set('description', e.target.value)} />
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Pricing type</label>
          <select value={f.pricingType} onChange={(e) => set('pricingType', e.target.value as PricingType)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand">
            {PRICING.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CatalogInput label="Base price (₹)" type="number" value={f.basePrice} onChange={(e) => set('basePrice', e.target.value)} />
          <CatalogInput label="Hourly rate (₹)" type="number" value={f.hourlyRate} onChange={(e) => set('hourlyRate', e.target.value)} />
          <CatalogInput label="Visit fee (₹)" type="number" value={f.visitFee} onChange={(e) => set('visitFee', e.target.value)} />
          <CatalogInput label="Starting price (₹)" type="number" value={f.startingPrice} onChange={(e) => set('startingPrice', e.target.value)} />
        </div>
        <CatalogInput label="Duration label" value={f.durationLabel} onChange={(e) => set('durationLabel', e.target.value)} placeholder="e.g. 2-3 hours" />
        <CatalogInput label="Image URL" value={f.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
        <CatalogInput label="Image alt text" value={f.imageAlt} onChange={(e) => set('imageAlt', e.target.value)} />
        <CatalogInput label="Display order" type="number" value={f.displayOrder} onChange={(e) => set('displayOrder', e.target.value)} />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={f.hasSubServices} onChange={(e) => set('hasSubServices', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
          Has sub-services / packages
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
          Active
        </label>
        <ModalActions submitting={submitting} onClose={onClose} label={isNew ? 'Create' : 'Save'} />
      </form>
    </CatalogModal>
  );
}
