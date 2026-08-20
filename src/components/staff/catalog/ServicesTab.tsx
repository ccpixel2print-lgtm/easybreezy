'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchAdminServices, fetchAdminService, deleteService,
  fetchCategories, deleteSubService,
  updateService, updateSubService,
  StaffAuthError,
  type AdminService, type AdminSubService, type AdminCategory,
} from '@/lib/staffApi';
import { formatRupees } from '@/lib/format';
import { ErrorBox } from './shared';
import ServiceModal from './ServiceModal';
import SubServiceModal from './SubServiceModal';

export default function ServicesTab() {
  const { token, logout } = useStaffAuth();
  const [services, setServices] = useState<AdminService[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState('');

  const [editingService, setEditingService] = useState<AdminService | 'new' | null>(null);
  const [subModal, setSubModal] = useState<{ serviceId: string; sub: AdminSubService | 'new' } | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const [svc, cats] = await Promise.all([
        fetchAdminServices(token, filterCat || undefined),
        fetchCategories(token),
      ]);
      setServices(svc);
      setCategories(cats);
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not load services.');
    } finally { setLoading(false); }
  }, [token, filterCat, logout]);

  useEffect(() => { load(); }, [load]);

  // load full detail (with sub-services) when a row is expanded
  const [detail, setDetail] = useState<Record<string, AdminService>>({});
  const expand = useCallback(async (svc: AdminService) => {
    if (expanded === svc.id) { setExpanded(null); return; }
    setExpanded(svc.id);
    if (!token || detail[svc.id]) return;
    try {
      const full = await fetchAdminService(token, svc.id);
      setDetail((d) => ({ ...d, [svc.id]: full }));
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Could not load sub-services.');
    }
  }, [expanded, token, detail, logout]);

  async function removeService(s: AdminService) {
    if (!token) return;
    if (!confirm(`Delete service "${s.name}"? (Soft-deletes if referenced by bookings.)`)) return;
    setActionError(null);
    try { await deleteService(token, s.id); await load(); }
    catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  async function removeSub(serviceId: string, sub: AdminSubService) {
    if (!token) return;
    if (!confirm(`Delete sub-service "${sub.name}"?`)) return;
    setActionError(null);
    try {
      await deleteSubService(token, sub.id);
      const full = await fetchAdminService(token, serviceId);
      setDetail((d) => ({ ...d, [serviceId]: full }));
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  async function toggleServiceActive(s: AdminService) {
    if (!token) return;
    const next = !(s.active ?? true);
    setActionError(null);
    try {
      await updateService(token, s.id, { active: next });
      await load();
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Could not update service.');
    }
  }

  async function toggleSubActive(serviceId: string, sub: AdminSubService) {
    if (!token) return;
    const next = !(sub.active ?? true);
    setActionError(null);
    try {
      await updateSubService(token, sub.id, { active: next });
      await refreshDetail(serviceId);
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Could not update sub-service.');
    }
  }

  async function refreshDetail(serviceId: string) {
    if (!token) return;
    const full = await fetchAdminService(token, serviceId);
    setDetail((d) => ({ ...d, [serviceId]: full }));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button
          onClick={() => setEditingService('new')}
          className="ml-auto rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Add service
        </button>
      </div>

      {actionError && <div className="mb-4"><ErrorBox msg={actionError} /></div>}

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div>
        ) : error ? (
          <ErrorBox msg={error} />
        ) : services.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/50">No services yet.</p>
        ) : (
          services.map((s) => {
            const full = detail[s.id];
            const subs = full?.subServices ?? [];
            const isOpen = expanded === s.id;
            return (
              <div key={s.id} className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
                <div className="flex items-center gap-3 p-4">
                  <button onClick={() => expand(s)} className="flex flex-1 items-center gap-3 text-left">
                    <svg className={`h-4 w-4 flex-shrink-0 text-ink/40 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink">{s.name}</span>
                        {!(s.active ?? true) && <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-500">Inactive</span>}
                        {s.hasSubServices && <span className="rounded-full bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand">Has packages</span>}
                      </div>
                      <p className="mt-0.5 text-xs text-ink/50">
                        {s.category?.name ?? '—'} · {s.pricingType ?? 'FIXED'} · from {formatRupees(s.startingPrice ?? s.basePrice)}
                      </p>
                    </div>
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingService(s)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-tint">Edit</button>
                    <button
                      onClick={() => toggleServiceActive(s)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        (s.active ?? true)
                          ? 'text-amber-600 hover:bg-amber-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {(s.active ?? true) ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => removeService(s)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-black/5 bg-cloud/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-ink">Sub-services / packages</h4>
                      <button onClick={() => setSubModal({ serviceId: s.id, sub: 'new' })} className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark">+ Add sub-service</button>
                    </div>
                    {!full ? (
                      <p className="py-4 text-center text-xs text-ink/50">Loading…</p>
                    ) : subs.length === 0 ? (
                      <p className="py-4 text-center text-xs text-ink/50">No sub-services. Add one above.</p>
                    ) : (
                      <div className="space-y-2">
                        {subs.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5 ring-1 ring-black/5">
                            <div>
                              <span className="text-sm font-medium text-ink">{sub.name}</span>
                              <span className="ml-2 text-xs text-ink/50">{sub.pricingType} · {formatRupees(sub.basePrice ?? sub.hourlyRate ?? sub.visitFee)}{sub.durationLabel ? ` · ${sub.durationLabel}` : ''}</span>
                              {!(sub.active ?? true) && <span className="ml-2 text-xs font-semibold text-red-500">Inactive</span>}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setSubModal({ serviceId: s.id, sub })} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-brand hover:bg-brand-tint">Edit</button>
                              <button
                                onClick={() => toggleSubActive(s.id, sub)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                  (sub.active ?? true)
                                    ? 'text-amber-600 hover:bg-amber-50'
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                              >
                                {(sub.active ?? true) ? 'Deactivate' : 'Activate'}
                              </button>
                              <button onClick={() => removeSub(s.id, sub)} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {editingService && (
        <ServiceModal
          service={editingService === 'new' ? null : editingService}
          categories={categories}
          onClose={() => setEditingService(null)}
          onSaved={async () => { await load(); }}
        />
      )}

      {subModal && (
        <SubServiceModal
          serviceId={subModal.serviceId}
          sub={subModal.sub === 'new' ? null : subModal.sub}
          onClose={() => setSubModal(null)}
          onSaved={async () => { await refreshDetail(subModal.serviceId); }}
        />
      )}
    </div>
  );
}
