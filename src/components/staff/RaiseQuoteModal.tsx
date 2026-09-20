'use client';

import { useMemo, useState } from 'react';
import type { RaiseQuoteItemInput } from '@/lib/staffApi';

interface Row {
  name: string;
  description: string;
  amountRupees: string; // user types rupees; we convert to paise on submit
  quantity: string;
}

const emptyRow: Row = { name: '', description: '', amountRupees: '', quantity: '1' };

interface Props {
  title?: string;
  // gstRate in basis points (e.g. 1800). Pass 0/undefined if GST disabled or unknown.
  gstRate?: number;
  onClose: () => void;
  // Parent supplies the actual API call (employee or admin).
  submit: (items: RaiseQuoteItemInput[]) => Promise<unknown>;
  onSuccess: () => void;
}

export default function RaiseQuoteModal({
  title = 'Raise extra-work quote',
  gstRate = 0,
  onClose,
  submit,
  onSuccess,
}: Props) {
  const [rows, setRows] = useState<Row[]>([{ ...emptyRow }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, { ...emptyRow }]);
  }
  function removeRow(i: number) {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  // Live totals in paise.
  const { subtotal, tax, total } = useMemo(() => {
    const sub = rows.reduce((s, r) => {
      const amt = Math.round(parseFloat(r.amountRupees || '0') * 100);
      const qty = parseInt(r.quantity || '1', 10);
      if (!Number.isFinite(amt) || amt <= 0 || !Number.isFinite(qty) || qty <= 0) return s;
      return s + amt * qty;
    }, 0);
    const t = gstRate > 0 ? Math.round((sub * gstRate) / 10000) : 0;
    return { subtotal: sub, tax: t, total: sub + t };
  }, [rows, gstRate]);

  const inr = (paise: number) =>
    `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  async function handleSubmit() {
    setError(null);
    // Build + validate the payload.
    const items: RaiseQuoteItemInput[] = [];
    for (const r of rows) {
      const name = r.name.trim();
      const amt = Math.round(parseFloat(r.amountRupees || '0') * 100);
      const qty = parseInt(r.quantity || '1', 10);
      if (!name) {
        setError('Every line item needs a name.');
        return;
      }
      if (!Number.isFinite(amt) || amt <= 0) {
        setError(`Enter a valid amount for "${name}".`);
        return;
      }
      if (!Number.isFinite(qty) || qty <= 0) {
        setError(`Enter a valid quantity for "${name}".`);
        return;
      }
      items.push({
        name,
        description: r.description.trim() || undefined,
        amount: amt,
        quantity: qty,
      });
    }
    setSubmitting(true);
    try {
      await submit(items);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not raise the quote.');
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink" aria-label="Close">✕</button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {rows.map((r, i) => (
            <div key={i} className="mb-3 rounded-xl bg-gray-50 p-3 ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink/60">Item {i + 1}</span>
                {rows.length > 1 && (
                  <button onClick={() => removeRow(i)} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                )}
              </div>
              <input
                value={r.name}
                onChange={(e) => updateRow(i, { name: e.target.value })}
                placeholder="Item name (e.g. Replace compressor)"
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:ring-brand"
              />
              <textarea
                value={r.description}
                onChange={(e) => updateRow(i, { description: e.target.value })}
                placeholder="Description (optional)"
                rows={2}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:ring-brand"
              />
              <div className="mt-2 flex gap-2">
                <div className="flex-1">
                  <label className="text-[11px] text-ink/50">Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={r.amountRupees}
                    onChange={(e) => updateRow(i, { amountRupees: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:ring-brand"
                  />
                </div>
                <div className="w-24">
                  <label className="text-[11px] text-ink/50">Qty</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={r.quantity}
                    onChange={(e) => updateRow(i, { quantity: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:ring-brand"
                  />
                </div>
              </div>
            </div>
          ))}

          <button onClick={addRow} className="text-sm font-semibold text-brand hover:underline">
            + Add another item
          </button>

          <div className="mt-4 space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span><span>{inr(subtotal)}</span>
            </div>
            {gstRate > 0 && (
              <div className="flex justify-between text-ink/60">
                <span>GST ({(gstRate / 100).toFixed(0)}%)</span><span>{inr(tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-ink">
              <span>Total</span><span>{inr(total)}</span>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <button onClick={onClose} className="rounded-full px-4 py-2 text-sm font-semibold text-ink/60 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || total <= 0}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? 'Raising…' : 'Raise quote'}
          </button>
        </div>
      </div>
    </div>
  );
}
