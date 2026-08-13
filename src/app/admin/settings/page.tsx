'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStaffAuth } from '@/context/StaffAuthContext';
import {
  fetchPricingSettings,
  updatePricingSettings,
  PricingSettings,
  ConfigurableFee,
  FeeType,
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
  const [platform, setPlatform] = useState<ConfigurableFee>({ enabled: false, type: 'FLAT', value: 0 });
  const [convenience, setConvenience] = useState<ConfigurableFee>({ enabled: false, type: 'FLAT', value: 0 });

  // Separate string inputs for the fee "value" fields (rupees when FLAT, percent when PERCENT)
  const [platformInput, setPlatformInput] = useState('');
  const [convenienceInput, setConvenienceInput] = useState('');

  const hydrate = useCallback((s: PricingSettings) => {
    setSettings(s);
    setGstPercent(String(Math.round(s.gstRate * 100)));
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
          <label className="block text-sm font-semibold text-ink">GST rate</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={gstPercent}
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
