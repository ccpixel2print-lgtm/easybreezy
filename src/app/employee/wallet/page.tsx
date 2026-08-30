'use client';

import { useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchMyWallet,
  fetchMyWalletLedger,
  StaffAuthError,
  type WalletSummary,
  type WalletEntry,
} from '@/lib/staffApi';

function rupees(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const TYPE_LABEL: Record<string, string> = {
  JOB_CREDIT: 'Job credit',
  PAYOUT: 'Payout',
  REVERSAL: 'Reversal',
  ADJUSTMENT: 'Adjustment',
};

export default function EmployeeWalletPage() {
  const { token, logout } = useStaffAuth();
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [ledger, setLedger] = useState<WalletEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [s, l] = await Promise.all([
          fetchMyWallet(token),
          fetchMyWalletLedger(token),
        ]);
        if (!cancelled) {
          setSummary(s);
          setLedger(l);
        }
      } catch (e) {
        if (e instanceof StaffAuthError) {
          logout();
          return;
        }
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load wallet.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  if (loading) return <div className="p-6">Loading wallet…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Wallet</h1>

      {summary && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Balance</div>
            <div className="text-xl font-bold">{rupees(summary.balance)}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Total earned</div>
            <div className="text-xl font-semibold">{rupees(summary.totalEarned)}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Total paid out</div>
            <div className="text-xl font-semibold">{rupees(summary.totalPaidOut)}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Reversed</div>
            <div className="text-xl font-semibold">{rupees(summary.totalReversed)}</div>
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-2 text-lg font-semibold">History</h2>
        {ledger.length === 0 ? (
          <p className="text-gray-500">No wallet activity yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Note</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="p-3">
                      {e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td className="p-3">{TYPE_LABEL[e.type] ?? e.type}</td>
                    <td className="p-3 text-gray-600">{e.note ?? '—'}</td>
                    <td
                      className={`p-3 text-right font-medium ${
                        e.amount < 0 ? 'text-red-600' : 'text-green-700'
                      }`}
                    >
                      {e.amount < 0 ? '−' : '+'}
                      {rupees(Math.abs(e.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
