'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchStaffList,
  createStaff,
  updateStaff,
  resetStaffPassword,
  StaffAuthError,
  type StaffMember,
  type CreateStaffPayload,
} from '@/lib/staffApi';
import StatusBadge from '@/components/staff/StatusBadge';
import EmployeeWalletPanel from '@/app/admin/_components/EmployeeWalletPanel';

export default function AdminStaffPage() {
  const { token, staff: me, logout } = useStaffAuth();

  const [list, setList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [resetFor, setResetFor] = useState<StaffMember | null>(null);

  const [walletFor, setWalletFor] = useState<string | null>(null);

  // A supervisor can only create employees; an admin can create both.
  const canCreateSupervisor = me?.role === 'ADMIN';

  const isActive = (s: StaffMember) => s.active ?? s.status !== 'INACTIVE';

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      setList(await fetchStaffList(token));
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setError(err instanceof Error ? err.message : 'Could not load staff.');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleActive(s: StaffMember) {
    if (!token) return;
    setActionError(null);
    try {
      await updateStaff(token, s.id, { status: isActive(s) ? 'INACTIVE' : 'ACTIVE' });
      await load();
    } catch (err) {
      if (err instanceof StaffAuthError) return logout();
      setActionError(err instanceof Error ? err.message : 'Could not update staff.');
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Staff</h1>
          <p className="mt-1 text-sm text-ink/60">Manage supervisors and employees.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Add staff
        </button>
      </div>

      {actionError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={load} className="mt-3 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              Retry
            </button>
          </div>
        ) : list.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/50">No staff yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink/40">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {list.map((s) => {
                  const active = isActive(s);
                  const self = s.id === me?.id;
                   return (
                    <React.Fragment key={s.id}>
                      <tr className="hover:bg-cloud/50">
                        <td className="px-5 py-3 font-medium text-ink">{s.fullName ?? '—'}</td>
                        <td className="px-5 py-3 text-ink/70">{s.email ?? '—'}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={s.role} />
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold ${active ? 'text-green-600' : 'text-red-500'}`}>
                            {active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            {s.role === 'EMPLOYEE' && (
                              <button
                                onClick={() => setWalletFor(walletFor === s.id ? null : s.id)}
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-tint"
                              >
                                {walletFor === s.id ? 'Hide wallet' : 'Wallet'}
                              </button>
                            )}
                            <button
                              onClick={() => setResetFor(s)}
                              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-tint"
                            >
                              Reset password
                            </button>
                            {!self && (
                              <button
                                onClick={() => toggleActive(s)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                  active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                                }`}
                              >
                                {active ? 'Deactivate' : 'Activate'}
                              </button>
                            )}
                          </div>
                        </td>
                    </tr>
                    {walletFor === s.id && (
                        <tr>
                          <td colSpan={5} className="bg-cloud/30 px-5 py-4">
                            <EmployeeWalletPanel
                              employeeId={s.id}
                              currentRatePercent={s.payoutRatePercent as number | null | undefined}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateStaffModal
          canCreateSupervisor={canCreateSupervisor}
          onClose={() => setShowCreate(false)}
          onCreate={async (payload) => {
            if (!token) return;
            await createStaff(token, payload); // errors bubble to modal
            await load();
          }}
        />
      )}

      {resetFor && (
        <ResetPasswordModal
          member={resetFor}
          onClose={() => setResetFor(null)}
          onReset={async (pwd) => {
            if (!token) return;
            await resetStaffPassword(token, resetFor.id, pwd);
          }}
        />
      )}
    </div>
  );
}

function CreateStaffModal({
  canCreateSupervisor,
  onClose,
  onCreate,
}: {
  canCreateSupervisor: boolean;
  onClose: () => void;
  onCreate: (p: CreateStaffPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateStaffPayload>({
    fullName: '',
    email: '',
    phone: '',
    role: 'EMPLOYEE',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof CreateStaffPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.fullName.trim()) return setError('Name is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Valid email required.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    setSubmitting(true);
    try {
      await onCreate({ ...form, fullName: form.fullName.trim(), email: form.email.trim() });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create staff.');
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Add staff" onClose={onClose}>
      {error && <ErrorBox msg={error} />}
      <form onSubmit={submit} className="space-y-3">
        <Input label="Full name" value={form.fullName} onChange={set('fullName')} autoFocus />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} />
        <Input label="Phone (optional)" value={form.phone ?? ''} onChange={set('phone')} />
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Role</label>
          <select value={form.role} onChange={set('role')} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand">
            <option value="EMPLOYEE">Employee</option>
            {canCreateSupervisor && <option value="SUPERVISOR">Supervisor</option>}
          </select>
        </div>
        <Input label="Temporary password" type="password" value={form.password} onChange={set('password')} />
        <ModalActions submitting={submitting} onClose={onClose} label="Create" />
      </form>
    </Modal>
  );
}

function ResetPasswordModal({
  member,
  onClose,
  onReset,
}: {
  member: StaffMember;
  onClose: () => void;
  onReset: (pwd: string) => Promise<void>;
}) {
  const [pwd, setPwd] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pwd.length < 8) return setError('Password must be at least 8 characters.');
    setSubmitting(true);
    try {
      await onReset(pwd);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset password.');
      setSubmitting(false);
    }
  }

  return (
    <Modal title={`Reset password — ${member.fullName || member.email}`} onClose={onClose}>
      {done ? (
        <div>
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
            Password updated. Share the new password with the staff member securely.
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Done</button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          {error && <ErrorBox msg={error} />}
          <Input label="New password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} autoFocus />
          <ModalActions submitting={submitting} onClose={onClose} label="Reset" />
        </form>
      )}
    </Modal>
  );
}

/* ---- small shared UI bits ---- */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-bold text-ink">{title}</h3>
        {children}
      </div>
    </div>
  );
}
function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
      <input {...props} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
    </div>
  );
}
function ErrorBox({ msg }: { msg: string }) {
  return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{msg}</div>;
}
function ModalActions({ submitting, onClose, label }: { submitting: boolean; onClose: () => void; label: string }) {
  return (
    <div className="mt-5 flex justify-end gap-2">
      <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 text-sm font-semibold text-ink/60 hover:text-ink">Cancel</button>
      <button type="submit" disabled={submitting} className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {submitting ? 'Saving…' : label}
      </button>
    </div>
  );
}
