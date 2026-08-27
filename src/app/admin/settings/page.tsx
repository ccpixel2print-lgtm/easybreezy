'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchPricingSettings,
  updatePricingSettings,
  PricingSettings,
  ConfigurableFee,
  FeeType,
  fetchPaymentsSettings,
  updatePaymentsSettings,
  PaymentsSettings,
  PaymentProviderName,
} from '@/lib/staffApi';
import { rupeesToPaise, paiseToRupeeInput } from '@/lib/format';

export default function AdminSettingsPage() {
  const { token, logout } = useStaffAuth();
  const [settings, setSettings] = useState<PricingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Local form state
  const [gstPercent, setGstPercent] = useState('18');
  const [gstEnabled, setGstEnabled] = useState(true);
  const [platform, setPlatform] = useState<ConfigurableFee>({ enabled: false, type: 'FLAT', value: 0 });
  const [convenience, setConvenience] = useState<ConfigurableFee>({ enabled: false, type: 'FLAT', value: 0 });

  // Separate string inputs for the fee "value" fields (rupees when FLAT, percent when PERCENT)
  const [platformInput, setPlatformInput] = useState('');
  const [convenienceInput, setConvenienceInput] = useState('');

  const hydrate = useCallback((s: PricingSettings) => {
    setSettings(s);
    setGstPercent(String(Math.round(s.gstRate * 100)));
    setGstEnabled(s.gstEnabled);
    setPlatform(s.platformFee);
    setConvenience(s.convenienceFee);
    setPlatformInput(
      s.platformFee.type === 'FLAT' ? paiseToRupeeInput(s.platformFee.value) : String(s.platformFee.value),
    );
    setConvenienceInput(
      s.convenienceFee.type === 'FLAT' ? paiseToRupeeInput(s.convenienceFee.value) : String(s.convenienceFee.value),
    );
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchPricingSettings(token)
      .then((s) => { hydrate(s); setError(null); })
      .catch((e) => {
        if (e?.name === 'StaffAuthError') { logout(); return; }
        setError(e?.message || 'Failed to load settings.');
      })
      .finally(() => setLoading(false));
  }, [token, hydrate, logout]);

  // Convert a fee's string input to the stored numeric value based on its type.
  function resolveFeeValue(type: FeeType, input: string): number | null {
    if (type === 'FLAT') {
      const paise = rupeesToPaise(input);
      return paise === undefined ? 0 : paise;
    }
    // PERCENT
    const trimmed = input.trim();
    if (trimmed === '') return 0;
    const n = Number(trimmed);
    if (Number.isNaN(n) || n < 0) return null;   // invalid
    if (n > 100) return null;                     // percent cap
    return Math.round(n);
  }

  async function handleSave() {
    if (!token) return;
    setError(null);
    setSaved(false);

    // GST validation
    const gstNum = Number(gstPercent);
    if (Number.isNaN(gstNum) || gstNum < 0 || gstNum > 100) {
      setError('GST must be a percentage between 0 and 100.');
      return;
    }

    const platformValue = resolveFeeValue(platform.type, platformInput);
    const convenienceValue = resolveFeeValue(convenience.type, convenienceInput);
    if (platformValue === null) {
      setError('Platform fee value is invalid (percent must be 0–100).');
      return;
    }
    if (convenienceValue === null) {
      setError('Convenience fee value is invalid (percent must be 0–100).');
      return;
    }

    const body: Partial<PricingSettings> = {
      gstEnabled,
      gstRate: gstNum / 100,
      platformFee: { ...platform, value: platformValue },
      convenienceFee: { ...convenience, value: convenienceValue },
    };

    setSaving(true);
    try {
      const updated = await updatePricingSettings(token, body);
      hydrate(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      if (e?.name === 'StaffAuthError') { logout(); return; }
      setError(e?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-sm text-ink/50">Loading settings…</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink/60">
          Configure pricing charges applied at checkout. Changes affect new orders only.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        {/* GST */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-ink">GST</label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={gstEnabled}
                onChange={(e) => setGstEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-black/20"
              />
              Enabled
            </label>
          </div>
          <div className={`mt-2 flex items-center gap-2 ${gstEnabled ? '' : 'opacity-50'}`}>
            <input
              type="number"
              min={0}
              max={100}
              value={gstPercent}
              disabled={!gstEnabled}
              onChange={(e) => setGstPercent(e.target.value)}
              className="w-28 rounded-lg border border-black/10 px-3 py-2 text-sm"
            />
            <span className="text-sm text-ink/60">%</span>
          </div>
          <p className="mt-1 text-xs text-ink/50">Applied to service charge + platform fee + convenience fee.</p>
        </div>

        <FeeEditor
          label="Platform fee"
          fee={platform}
          input={platformInput}
          onFeeChange={setPlatform}
          onInputChange={setPlatformInput}
        />

        <FeeEditor
          label="Convenience fee"
          fee={convenience}
          input={convenienceInput}
          onFeeChange={setConvenience}
          onInputChange={setConvenienceInput}
        />

        <div className="flex items-center gap-3 border-t border-black/5 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && <span className="text-sm font-medium text-green-600">Saved ✓</span>}
        </div>
      </div>
      {/* Payments provider selection */}
      <PaymentsSettingsCard />
    </div>
  );
}

/** Reusable editor for one configurable fee (enabled + type + value). */
function FeeEditor({
  label,
  fee,
  input,
  onFeeChange,
  onInputChange,
}: {
  label: string;
  fee: ConfigurableFee;
  input: string;
  onFeeChange: (f: ConfigurableFee) => void;
  onInputChange: (v: string) => void;
}) {
  return (
    <div className="border-t border-black/5 pt-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-ink">{label}</label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={fee.enabled}
            onChange={(e) => onFeeChange({ ...fee, enabled: e.target.checked })}
            className="h-4 w-4 rounded border-black/20"
          />
          Enabled
        </label>
      </div>

      <div className={`mt-3 flex items-center gap-2 ${fee.enabled ? '' : 'opacity-50'}`}>
        <select
          value={fee.type}
          disabled={!fee.enabled}
          onChange={(e) => onFeeChange({ ...fee, type: e.target.value as FeeType })}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        >
          <option value="FLAT">Flat (₹)</option>
          <option value="PERCENT">Percent (%)</option>
        </select>

        <div className="flex items-center gap-1.5">
          {fee.type === 'FLAT' && <span className="text-sm text-ink/60">₹</span>}
          <input
            type="number"
            min={0}
            value={input}
            disabled={!fee.enabled}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={fee.type === 'FLAT' ? 'e.g. 29' : 'e.g. 5'}
            className="w-32 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          {fee.type === 'PERCENT' && <span className="text-sm text-ink/60">%</span>}
        </div>
      </div>
      <p className="mt-1 text-xs text-ink/50">
        {fee.type === 'FLAT'
          ? 'A fixed amount in rupees added to every order.'
          : 'A percentage of the service charge added to every order.'}
      </p>
    </div>
  );
}

/** Payments provider selection (which gateway is live at checkout). */
function PaymentsSettingsCard() {
  const { token, logout } = useStaffAuth();
  const [settings, setSettings] = useState<PaymentsSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [active, setActive] = useState<PaymentProviderName>('mock');
  const [enabled, setEnabled] = useState<PaymentProviderName[]>(['mock', 'cod']);

  const ALL_PROVIDERS: { id: PaymentProviderName; label: string; hint: string }[] = [
    { id: 'mock', label: 'Mock (testing)', hint: 'Simulated payments — no real money. For internal testing only.' },
    { id: 'cod', label: 'Cash on Delivery', hint: 'Customer pays the technician directly; order enters ops immediately.' },
    { id: 'phonepe', label: 'PhonePe', hint: 'Live UPI / cards / netbanking via PhonePe Standard Checkout.' },
  ];

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchPaymentsSettings(token)
      .then((s) => {
        setSettings(s);
        setActive(s.activeProvider);
        setEnabled(s.enabledProviders);
        setError(null);
      })
      .catch((e: any) => {
        if (e?.name === 'StaffAuthError') { logout(); return; }
        setError(e?.message || 'Failed to load payment settings.');
      })
      .finally(() => setLoading(false));
  }, [token, logout]);

  function toggleEnabled(id: PaymentProviderName) {
    setEnabled((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  async function handleSave() {
    if (!token) return;
    setError(null);
    setSaved(false);

    // Guard: active provider must be one of the enabled ones.
    if (!enabled.includes(active)) {
      setError('The active provider must also be enabled.');
      return;
    }
    if (enabled.length === 0) {
      setError('At least one provider must be enabled.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updatePaymentsSettings(token, {
        activeProvider: active,
        enabledProviders: enabled,
      });
      setSettings(updated);
      setActive(updated.activeProvider);
      setEnabled(updated.enabledProviders);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      if (e?.name === 'StaffAuthError') { logout(); return; }
      setError(e?.message || 'Failed to save payment settings.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 text-sm text-ink/50 shadow-sm">
        Loading payment settings…
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-ink">Payments</h2>
        <p className="mt-1 text-sm text-ink/60">
          Choose which payment method is live at checkout. Use “Mock” for testing.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {ALL_PROVIDERS.map((p) => {
            const isEnabled = enabled.includes(p.id);
            const isActive = active === p.id;
            return (
              <div
                key={p.id}
                className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors ${
                  isActive ? 'border-brand bg-brand-tint' : 'border-black/10'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{p.label}</span>
                    {isActive && (
                      <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink/50">{p.hint}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-ink/70">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => toggleEnabled(p.id)}
                      className="h-4 w-4 rounded border-black/20"
                    />
                    Enabled
                  </label>
                  <button
                    type="button"
                    disabled={!isEnabled || isActive}
                    onClick={() => setActive(p.id)}
                    className="rounded-full border border-brand px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-brand"
                  >
                    {isActive ? 'Current' : 'Set active'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 border-t border-black/5 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark active:scale-95 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save payment settings'}
          </button>
          {saved && <span className="text-sm font-medium text-green-600">Saved ✓</span>}
          {settings && (
            <span className="ml-auto text-xs text-ink/40">
              Live: <strong className="text-ink/60">{settings.activeProvider}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

