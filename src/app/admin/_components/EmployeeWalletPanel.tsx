'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchEmployeeWallet,
  fetchEmployeeWalletLedger,
  recordEmployeePayout,
  setEmployeePayoutRate,
  StaffAuthError,
  type WalletSummary,
  type WalletEntry,
} from '@/lib/staffApi';

function rupees(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function EmployeeWalletPanel({
  employeeId,
  currentRatePercent,
}: {
  employeeId: string;
  currentRatePercent?: number | null;
}) {
  const { token, logout } = useStaffAuth();
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [ledger, setLedger] = useState<WalletEntry[]>([]);
  const [payoutRupees, setPayoutRupees] = useState('');
  const [payoutNote, setPayoutNote] = useState('');
  const [rate, setRate] = useState<string>(
    currentRatePercent == null ? '' : String(currentRatePercent),
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [s, l] = await Promise.all([
        fetchEmployeeWallet(token, employeeId),
        fetchEmployeeWalletLedger(token, employeeId),
      ]);
      setSummary(s);
      setLedger(l);
    } catch (e) {
      if (e instanceof StaffAuthError) return logout();
      setMsg(e instanceof Error ? e.message : 'Failed to load wallet.');
    }
  }, [token, employeeId, logout]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handlePayout() {
    if (!token) return;
    const amountPaise = Math.round(parseFloat(payoutRupees) * 100);
    if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
      setMsg('Enter a valid payout amount.');
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await recordEmployeePayout(token, employeeId, amountPaise, payoutNote || undefined);
      setPayoutRupees('');
      setPayoutNote('');
      setMsg('Payout recorded.');
      await load();
    } catch (e) {
      if (e instanceof StaffAuthError) return logout();
      setMsg(e instanceof Error ? e.message : 'Payout failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveRate() {
    if (!token) return;
    const parsed = rate.trim() === '' ? null : Number(rate);
    if (parsed !== null && (!Number.isInteger(parsed) || parsed < 0 || parsed > 100)) {
      setMsg('Rate must be a whole number 0–100, or blank for the global default.');
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await setEmployeePayoutRate(token, employeeId, parsed);
      setMsg(parsed === null ? 'Rate cleared (uses global default).' : `Rate set to ${parsed}%.`);
    } catch (e) {
      if (e instanceof StaffAuthError) return logout();
      setMsg(e instanceof Error ? e.message : 'Failed to save rate.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">Wallet</h3>

      {summary && (
        <div className="flex flex-wrap gap-4 text-sm">
          <span>Balance: <strong>{rupees(summary.balance)}</strong></span>
          <span>Earned: {rupees(summary.totalEarned)}</span>
          <span>Paid out: {rupees(summary.totalPaidOut)}</span>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-2">
        <label className="text-sm">
          Payout ₹
          <input
            className="ml-1 w-28 rounded border px-2 py-1"
            value={payoutRupees}
            onChange={(e) => setPayoutRupees(e.target.value)}
            placeholder="0.00"
          />
        </label>
        <input
          className="w-40 rounded border px-2 py-1 text-sm"
          value={payoutNote}
          onChange={(e) => setPayoutNote(e.target.value)}
          placeholder="Note (optional)"
        />
        <button
          className="rounded bg-black px-3 py-1 text-sm text-white disabled:opacity-50"
          onClick={handlePayout}
          disabled={busy}
        >
          Record payout
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="text-sm">
          Payout rate %
          <input
            className="ml-1 w-24 rounded border px-2 py-1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="global"
          />
        </label>
        <button
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          onClick={handleSaveRate}
          disabled={busy}
        >
          Save rate
        </button>
        <span className="text-xs text-gray-500">Blank = use global default</span>
      </div>

      {msg && <p className="text-sm text-blue-700">{msg}</p>}

      {ledger.length > 0 && (
        <details>
          <summary className="cursor-pointer text-sm text-gray-600">
            History ({ledger.length})
          </summary>
          <ul className="mt-2 space-y-1 text-sm">
            {ledger.map((e) => (
              <li key={e.id} className="flex justify-between border-b py-1">
                <span>{e.note ?? e.type}</span>
                <span className={e.amount < 0 ? 'text-red-600' : 'text-green-700'}>
                  {e.amount < 0 ? '−' : '+'}{rupees(Math.abs(e.amount))}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
