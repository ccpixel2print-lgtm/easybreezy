'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchMyWallet,
  fetchMyWalletLedger,
  StaffAuthError,
  type WalletSummary,
  type WalletEntry,
  type WalletEntryType,
} from '@/lib/staffApi';

/** paise → ₹ string, e.g. 125000 → "₹1,250.00" */
function inr(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const TYPE_LABEL: Record<WalletEntryType, string> = {
  JOB_CREDIT: 'Job earning',
  PAYOUT: 'Payout',
  REVERSAL: 'Reversal',
  ADJUSTMENT: 'Adjustment',
};

const TYPE_STYLE: Record<WalletEntryType, string> = {
  JOB_CREDIT: 'bg-green-50 text-green-700 ring-green-200',
  PAYOUT: 'bg-blue-50 text-blue-700 ring-blue-200',
  REVERSAL: 'bg-red-50 text-red-700 ring-red-200',
  ADJUSTMENT: 'bg-amber-50 text-amber-700 ring-amber-200',
};

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
}

export default function EmployeeWalletPage() {
  const { token, logout } = useStaffAuth();
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [ledger, setLedger] = useState<WalletEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [s, l] = await Promise.all([
        fetchMyWallet(token),
        fetchMyWalletLedger(token),
      ]);
      setSummary(s);
      setLedger(l);
    } catch (err) {
      if (err instanceof StaffAuthError) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : 'Could not load your wallet.');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    load();
  }, [load]);

  // "Earned this month" = sum of JOB_CREDIT entries in the current calendar month.
  const now = new Date();
  const earnedThisMonth = ledger.reduce((sum, e) => {
    if (e.type !== 'JOB_CREDIT' || !e.createdAt) return sum;
    const d = new Date(e.createdAt);
    if (Number.isNaN(d.getTime())) return sum;
    return d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
      ? sum + e.amount
      : sum;
  }, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">My Wallet</h1>
        <p className="mt-1 text-sm text-ink/60">
          Your earnings, payouts, and transaction history.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={load}
            className="mt-3 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-brand p-5 text-white shadow-soft">
              <p className="text-sm font-medium text-white/80">Current balance</p>
              <p className="mt-1 text-2xl font-bold">
                {inr(summary?.balance ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
              <p className="text-sm font-medium text-ink/60">Total earned</p>
              <p className="mt-1 text-2xl font-bold text-ink">
                {inr(summary?.totalEarned ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
              <p className="text-sm font-medium text-ink/60">Paid out</p>
              <p className="mt-1 text-2xl font-bold text-ink">
                {inr(summary?.totalPaidOut ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
              <p className="text-sm font-medium text-ink/60">Earned this month</p>
              <p className="mt-1 text-2xl font-bold text-ink">
                {inr(earnedThisMonth)}
              </p>
            </div>
          </div>

          {/* Ledger */}
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-ink">Transaction history</h2>
            {ledger.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center ring-1 ring-black/5">
                <p className="text-sm text-ink/60">No transactions yet.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Note</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((e) => {
                      const type = (e.type as WalletEntryType) ?? 'ADJUSTMENT';
                      const isCredit = e.amount >= 0;
                      return (
                        <tr
                          key={e.id}
                          className="border-b border-black/5 last:border-0"
                        >
                          <td className="whitespace-nowrap px-5 py-3 text-ink/70">
                            {formatDate(e.createdAt)}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${
                                TYPE_STYLE[type] ??
                                'bg-gray-50 text-gray-700 ring-gray-200'
                              }`}
                            >
                              {TYPE_LABEL[type] ?? e.type}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-ink/60">
                            {e.note || '—'}
                          </td>
                          <td
                            className={`whitespace-nowrap px-5 py-3 text-right font-semibold ${
                              isCredit ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {isCredit ? '+' : '−'}
                            {inr(Math.abs(e.amount))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
