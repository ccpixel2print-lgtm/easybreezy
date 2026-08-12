'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
  StaffAuthError, type AdminCategory,
} from '@/lib/staffApi';
import { CatalogModal, CatalogInput, ModalActions, ErrorBox } from './shared';

export default function CategoriesTab() {
  const { token, logout } = useStaffAuth();
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminCategory | 'new' | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try { setItems(await fetchCategories(token)); }
    catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not load categories.');
    } finally { setLoading(false); }
  }, [token, logout]);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(c: AdminCategory) {
    if (!token) return;
    setActionError(null);
    try { await updateCategory(token, c.id, { active: !(c.active ?? true) }); await load(); }
    catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Update failed.');
    }
  }

  async function remove(c: AdminCategory) {
    if (!token) return;
    if (!confirm(`Delete category "${c.name}"? This may fail if services reference it.`)) return;
    setActionError(null);
    try { await deleteCategory(token, c.id); await load(); }
    catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Delete failed (category may be in use).');
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing('new')} className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          + Add category
        </button>
      </div>

      {actionError && <div className="mb-4"><ErrorBox msg={actionError} /></div>}

      <div className="rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div>
        ) : error ? (
          <div className="p-6 text-center"><p className="text-sm text-red-700">{error}</p></div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/50">No categories yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink/40">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium text-right">Order</th>
                <th className="px-5 py-3 font-medium">Active</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-cloud/50">
                  <td className="px-5 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-5 py-3 text-right text-ink/70">{c.displayOrder ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold ${(c.active ?? true) ? 'text-green-600' : 'text-red-500'}`}>
                      {(c.active ?? true) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(c)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-tint">Edit</button>
                      <button onClick={() => toggleActive(c)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-ink/60 hover:bg-cloud">{(c.active ?? true) ? 'Deactivate' : 'Activate'}</button>
                      <button onClick={() => remove(c)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <CategoryModal
          category={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (body) => {
            if (!token) return;
            if (editing === 'new') await createCategory(token, body);
            else await updateCategory(token, editing.id, body);
            await load();
          }}
        />
      )}
    </div>
  );
}

function CategoryModal({
  category, onClose, onSave,
}: {
  category: AdminCategory | null;
  onClose: () => void;
  onSave: (b: { name: string; displayOrder?: number; active?: boolean }) => Promise<void>;
}) {
  const [name, setName] = useState(category?.name ?? '');
  const [order, setOrder] = useState(category?.displayOrder?.toString() ?? '');
  const [active, setActive] = useState(category?.active ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    if (!name.trim()) return setError('Name is required.');
    setSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        displayOrder: order === '' ? undefined : Number(order),
        active,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
      setSubmitting(false);
    }
  }

  return (
    <CatalogModal title={category ? 'Edit category' : 'Add category'} onClose={onClose}>
      {error && <ErrorBox msg={error} />}
      <form onSubmit={submit} className="space-y-3">
        <CatalogInput label="Name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        <CatalogInput label="Display order (optional)" type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
          Active
        </label>
        <ModalActions submitting={submitting} onClose={onClose} label={category ? 'Save' : 'Create'} />
      </form>
    </CatalogModal>
  );
}