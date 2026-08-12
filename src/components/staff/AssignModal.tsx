'use client';

import { useState } from 'react';
import type { StaffMember, AdminBooking } from '@/lib/staffApi';

export default function AssignModal({
  booking,
  employees,
  mode,
  onClose,
  onConfirm,
}: {
  booking: AdminBooking;
  employees: StaffMember[];
  mode: 'assign' | 'reassign';
  onClose: () => void;
  onConfirm: (employeeId: string) => Promise<void>;
}) {
  const [employeeId, setEmployeeId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!employeeId) {
      setError('Please select an employee.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(employeeId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-ink">
          {mode === 'assign' ? 'Assign employee' : 'Reassign employee'}
        </h3>
        <p className="mt-1 text-sm text-ink/60">
          Booking #{booking.bookingNumber ?? booking.id}
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mt-4 block text-sm font-medium text-ink">Employee</label>
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
        >
          <option value="">Select an employee…</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.fullName || e.email}
            </option>
          ))}
        </select>

        {employees.length === 0 && (
          <p className="mt-2 text-xs text-amber-700">
            No active employees found. Create one under Staff first.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-ink/60 hover:text-ink"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
