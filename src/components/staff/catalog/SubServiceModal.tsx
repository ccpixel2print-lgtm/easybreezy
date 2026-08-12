'use client';

import { useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  createSubService, updateSubService,
  type AdminSubService, type SubServicePayload, type PricingType,
} from '@/lib/staffApi';
import { rupeesToPaise, paiseToRupeeInput } from '@/lib/format';
import { CatalogModal, CatalogInput, ModalActions, ErrorBox } from './shared';

const PRICING: PricingType[] = ['FIXED', 'HOURLY', 'VISITING'];

export default function SubServiceModal({
  serviceId, sub, onClose, onSaved,
}: {
  serviceId: string;
  sub: AdminSubService | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { token } = useStaffAuth();
  const isNew = !sub;

  const [f, setF] = useState({
    name: sub?.name ?? '',
    pricingType: (sub?.pricingType ?? 'FIXED') as PricingType,
    description: sub?.description ?? '',
    basePrice: paiseToRupeeInput(sub?.basePrice),
    hourlyRate: paiseToRupeeInput(sub?.hourlyRate),
    visitFee: paiseToRupeeInput(sub?.visitFee),
    durationLabel: sub?.durationLabel ?? '',
    displayOrder: sub?.displayOrder?.toString() ?? '',
    active: sub?.active ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    if (!f.name.trim()) return setError('Name is required.');
    if (!token) return;

    setSubmitting(true);
    try {
      if (isNew) {
        const body: SubServicePayload = {
          serviceId,
          name: f.name.trim(),
          pricingType: f.pricingType,
          description: f.description.trim() || undefined,
          basePrice: rupeesToPaise(f.basePrice),
          hourlyRate: rupeesToPaise(f.hourlyRate),
          visitFee: rupeesToPaise(f.visitFee),
          durationLabel: f.durationLabel.trim() || undefined,
          displayOrder: f.displayOrder === '' ? undefined : Number(f.displayOrder),
          active: f.active,
        };
        await createSubService(token, body);
      } else {
        await updateSubService(token, sub!.id, {
          name: f.name.trim(),
          pricingType: f.pricingType,
          description: f.description.trim() || undefined,
          basePrice: rupeesToPaise(f.basePrice),
          hourlyRate: rupeesToPaise(f.hourlyRate),
          visitFee: rupeesToPaise(f.visitFee),
          durationLabel: f.durationLabel.trim() || undefined,
          displayOrder: f.displayOrder === '' ? undefined : Number(f.displayOrder),
          active: f.active,
        });
      }
      await onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
      setSubmitting(false);
    }
  }

  return (
    <CatalogModal title={isNew ? 'Add sub-service' : `Edit ${sub!.name}`} onClose={onClose}>
      {error && <ErrorBox msg={error} />}
      <form onSubmit={submit} className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        <CatalogInput label="Name" value={f.name} onChange={(e) => set('name', e.target.value)} autoFocus />
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Pricing type</label>
          <select value={f.pricingType} onChange={(e) => set('pricingType', e.target.value as PricingType)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand">
            {PRICING.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <CatalogInput label="Description" value={f.description} onChange={(e) => set('description', e.target.value)} />
        <div className="grid grid-cols-3 gap-3">
          <CatalogInput label="Base (₹)" type="number" value={f.basePrice} onChange={(e) => set('basePrice', e.target.value)} />
          <CatalogInput label="Hourly (₹)" type="number" value={f.hourlyRate} onChange={(e) => set('hourlyRate', e.target.value)} />
          <CatalogInput label="Visit (₹)" type="number" value={f.visitFee} onChange={(e) => set('visitFee', e.target.value)} />
        </div>
        <CatalogInput label="Duration label" value={f.durationLabel} onChange={(e) => set('durationLabel', e.target.value)} placeholder="e.g. 1 hour" />
        <CatalogInput label="Display order" type="number" value={f.displayOrder} onChange={(e) => set('displayOrder', e.target.value)} />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
          Active
        </label>
        <ModalActions submitting={submitting} onClose={onClose} label={isNew ? 'Create' : 'Save'} />
      </form>
    </CatalogModal>
  );
}
