'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  checkPincode,
  submitCheckout,
  mockConfirmPayment,
  type CheckoutResponse,
} from '@/lib/api';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const rupeesFromPaise = (paise: number) => `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;
const GST_RATE = 0.18;

const TIME_WINDOWS = [
  '08:00 AM – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 PM – 02:00 PM',
  '02:00 PM – 04:00 PM',
  '04:00 PM – 06:00 PM',
  '06:00 PM – 08:00 PM',
];

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { user, token } = useAuth();

  const [loginOpen, setLoginOpen] = useState(false);
  const [form, setForm] = useState({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    addressLine1: '',
    addressLine2: '',
    area: '',
    city: 'Hyderabad',
    pincode: '',
    scheduledDate: '',
    scheduledTimeWindow: TIME_WINDOWS[1],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // order placed / payment state
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const { subtotal, gst, total } = useMemo(() => {
    const sub = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const g = Math.round(sub * GST_RATE);
    return { subtotal: sub, gst: g, total: sub + g };
  }, [items]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user || !token) {
      setLoginOpen(true);
      return;
    }

    if (
      !form.contactName ||
      !form.contactPhone ||
      !form.addressLine1 ||
      form.pincode.length !== 6 ||
      !form.scheduledDate
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Verify serviceability before creating the order
      const pin = await checkPincode(form.pincode);
      if (!pin.serviceable) {
        setError('Sorry, we do not serve this pincode yet.');
        setLoading(false);
        return;
      }

      const res = await submitCheckout(token, {
        items: items.map((i) => ({
          serviceId: i.serviceId,
          subServiceId: i.subServiceId,
          quantity: i.quantity,
        })),
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail || user.email,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        area: form.area,
        city: form.city,
        pincode: form.pincode,
        scheduledDate: form.scheduledDate,
        scheduledTimeWindow: form.scheduledTimeWindow,
      });

      clear();
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockPay = async () => {
    if (!token || !result) return;
    setPayLoading(true);
    setError('');
    try {
      await mockConfirmPayment(token, result.order.id);
      setPaid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed.');
    } finally {
      setPayLoading(false);
    }
  };

  // ---- Order placed state ----
  if (result) {
    const isCod = result.payment.provider === 'cod';
    const isMock = result.payment.provider === 'mock';
    const isRazorpay = result.payment.provider === 'razorpay';

    return (
      <>
        <Navbar />
        <main className="pt-[68px]">
          <section className="bg-cloud py-16">
            <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
              <span
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                  paid || isCod ? 'bg-green-100 text-green-600' : 'bg-brand-tint text-brand'
                }`}
              >
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>

              <h1 className="mt-5 text-2xl font-extrabold text-brand">
                {paid ? 'Payment successful!' : 'Order placed!'}
              </h1>
              <p className="mt-2 text-sm text-ink/70">
                Your order <strong className="text-ink">{result.order.orderNumber}</strong> has been created.
              </p>
              <p className="mt-1 text-sm text-ink/70">
                Amount: <strong className="text-ink">{rupeesFromPaise(result.order.totalAmount)}</strong>
              </p>

              {/* COD */}
              {isCod && !paid && (
                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
                  Payment pending — you can pay when the service is provided. Our team will reach out to confirm.
                </p>
              )}

              {/* MOCK */}
              {isMock && !paid && (
                <div className="mt-5">
                  <p className="mb-3 text-xs text-ink/55">Test mode: simulate an online payment.</p>
                  {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
                  <button
                    type="button"
                    onClick={handleMockPay}
                    disabled={payLoading}
                    className="w-full rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
                  >
                    {payLoading
                      ? 'Processing…'
                      : `Pay Now (Test) — ${rupeesFromPaise(result.order.totalAmount)}`}
                  </button>
                </div>
              )}

              {/* RAZORPAY (placeholder until real integration) */}
              {isRazorpay && !paid && (
                <p className="mt-4 rounded-lg bg-brand-tint px-3 py-2 text-xs text-brand">
                  Online payment via Razorpay will open here (integration pending).
                </p>
              )}

              {paid && (
                <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700 ring-1 ring-green-100">
                  Thank you! Your payment is confirmed and your booking is being processed.
                </p>
              )}

              <Link
                href="/"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Back to Home
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // ---- Empty cart guard ----
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-[68px]">
          <section className="bg-cloud py-16">
            <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
              <h1 className="text-xl font-bold text-ink">Your cart is empty</h1>
              <p className="mt-2 text-sm text-ink/65">Add a service before checking out.</p>
              <Link
                href="/services"
                className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Browse Services
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const inputCls =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

  return (
    <>
      <Navbar />
      <main className="pt-[68px]">
        <section className="bg-cloud py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-brand">Checkout</h1>

            {!user && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-tint px-4 py-3 text-sm text-brand">
                <span>Please log in to place your order.</span>
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-dark"
                >
                  Log in
                </button>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left: details */}
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
                  <h2 className="text-lg font-bold text-brand">Contact details</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      className={inputCls}
                      placeholder="Full name *"
                      value={form.contactName}
                      onChange={(e) => set('contactName', e.target.value)}
                    />
                    <input
                      className={inputCls}
                      placeholder="Phone number *"
                      value={form.contactPhone}
                      onChange={(e) => set('contactPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                    <input
                      className={`${inputCls} sm:col-span-2`}
                      placeholder="Email (optional)"
                      value={form.contactEmail}
                      onChange={(e) => set('contactEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
                  <h2 className="text-lg font-bold text-brand">Service address</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      className={`${inputCls} sm:col-span-2`}
                      placeholder="Address line 1 *"
                      value={form.addressLine1}
                      onChange={(e) => set('addressLine1', e.target.value)}
                    />
                    <input
                      className={`${inputCls} sm:col-span-2`}
                      placeholder="Address line 2 (optional)"
                      value={form.addressLine2}
                      onChange={(e) => set('addressLine2', e.target.value)}
                    />
                    <input
                      className={inputCls}
                      placeholder="Area / locality"
                      value={form.area}
                      onChange={(e) => set('area', e.target.value)}
                    />
                    <input
                      className={inputCls}
                      placeholder="City *"
                      value={form.city}
                      onChange={(e) => set('city', e.target.value)}
                    />
                    <input
                      className={inputCls}
                      placeholder="Pincode *"
                      value={form.pincode}
                      onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
                  <h2 className="text-lg font-bold text-brand">Preferred schedule</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      type="date"
                      className={inputCls}
                      value={form.scheduledDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => set('scheduledDate', e.target.value)}
                    />
                    <select
                      className={inputCls}
                      value={form.scheduledTimeWindow}
                      onChange={(e) => set('scheduledTimeWindow', e.target.value)}
                    >
                      {TIME_WINDOWS.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-xs text-ink/55">This schedule applies to all items in this order.</p>
                </div>
              </div>

              {/* Right: summary */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
                  <h2 className="text-lg font-bold text-brand">Order summary</h2>
                  <ul className="mt-4 space-y-2 text-sm">
                    {items.map((i) => (
                      <li key={i.key} className="flex justify-between gap-2 text-ink/75">
                        <span>
                          {i.name}
                          {i.isHourly ? ` × ${i.quantity}h` : ''}
                        </span>
                        <span className="font-medium text-ink">{inr(i.price * i.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-4 space-y-2 border-t border-dashed border-gray-200 pt-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink/70">Subtotal</dt>
                      <dd className="font-semibold">{inr(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink/70">GST (18%)</dt>
                      <dd className="font-semibold">{inr(gst)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-gray-200 pt-2">
                      <dt className="text-base font-bold">Total</dt>
                      <dd className="text-xl font-extrabold text-brand">{inr(total)}</dd>
                    </div>
                  </dl>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? 'Placing order…' : user ? 'Place Order' : 'Log in to Place Order'}
                  </button>
                  <p className="mt-3 text-xs text-ink/55">
                    For visiting/inspection services, only the visit fee applies now. Final charges are shared after assessment.
                  </p>
                </div>
              </aside>
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
