'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchPincodes, createPincode, updatePincode, deletePincode,
  StaffAuthError, type AdminPincode,
} from '@/lib/staffApi';
import { CatalogModal, CatalogInput, ModalActions, ErrorBox } from './shared';

export default function PincodesTab() {
  const { token, logout } = useStaffAuth();
  const [items, setItems] = useState<AdminPincode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminPincode | 'new' | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try { setItems(await fetchPincodes(token)); }
    catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not load pincodes.');
    } finally { setLoading(false); }
  }, [token, logout]);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(p: AdminPincode) {
    if (!token) return;
    setActionError(null);
    try { await updatePincode(token, p.id, { active: !(p.active ?? true) }); await load(); }
    catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Update failed.');
    }
  }

  async function remove(p: AdminPincode) {
    if (!token) return;
    if (!confirm(`Delete pincode ${p.pincode}?`)) return;
    setActionError(null);
    try { await deletePincode(token, p.id); await load(); }
    catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing('new')} className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          + Add pincode
        </button>
      </div>

      {actionError && <div className="mb-4"><ErrorBox msg={actionError} /></div>}

      <div className="rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div>
        ) : error ? (
          <div className="p-6 text-center"><p className="text-sm text-red-700">{error}</p></div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/50">No pincodes yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink/40">
              <tr>
                <th className="px-5 py-3 font-medium">Pincode</th>
                <th className="px-5 py-3 font-medium">Area</th>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium">Active</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-cloud/50">
                  <td className="px-5 py-3 font-medium text-ink">{p.pincode}</td>
                  <td className="px-5 py-3 text-ink/70">{p.areaName ?? '—'}</td>
                  <td className="px-5 py-3 text-ink/70">{p.city ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold ${(p.active ?? true) ? 'text-green-600' : 'text-red-500'}`}>
                      {(p.active ?? true) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(p)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-tint">Edit</button>
                      <button onClick={() => toggleActive(p)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-ink/60 hover:bg-cloud">{(p.active ?? true) ? 'Deactivate' : 'Activate'}</button>
                      <button onClick={() => remove(p)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <PincodeModal
          pincode={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (body, isNew) => {
            if (!token) return;
            if (isNew) await createPincode(token, body);
            else await updatePincode(token, (editing as AdminPincode).id, { areaName: body.areaName, city: body.city, active: body.active });
            await load();
          }}
        />
      )}
    </div>
  );
}

function PincodeModal({
  pincode, onClose, onSave,
}: {
  pincode: AdminPincode | null;
  onClose: () => void;
  onSave: (b: { pincode: string; areaName?: string; city?: string; active?: boolean }, isNew: boolean) => Promise<void>;
}) {
  const isNew = !pincode;
  const [code, setCode] = useState(pincode?.pincode ?? '');
  const [area, setArea] = useState(pincode?.areaName ?? '');
  const [city, setCity] = useState(pincode?.city ?? 'Hyderabad');
  const [active, setActive] = useState(pincode?.active ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    if (isNew && !/^[0-9]{6}$/.test(code.trim())) return setError('Enter a valid 6-digit pincode.');
    if (!area.trim()) return setError('Area name is required.');
    setSubmitting(true);
    try {
      await onSave({ pincode: code.trim(), areaName: area.trim(), city: city.trim() || 'Hyderabad', active }, isNew);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
      setSubmitting(false);
    }
  }

  return (
    <CatalogModal title={isNew ? 'Add pincode' : `Edit ${pincode!.pincode}`} onClose={onClose}>
      {error && <ErrorBox msg={error} />}
      <form onSubmit={submit} className="space-y-3">
        <CatalogInput label="Pincode" value={code} onChange={(e) => setCode(e.target.value)} disabled={!isNew} maxLength={6} inputMode="numeric" autoFocus={isNew} />
        <CatalogInput label="Area name" value={area} onChange={(e) => setArea(e.target.value)} />
        <CatalogInput label="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
          Active
        </label>
        <ModalActions submitting={submitting} onClose={onClose} label={isNew ? 'Create' : 'Save'} />
      </form>
    </CatalogModal>
  );
}