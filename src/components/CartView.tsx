'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ImagePlaceholder from './ImagePlaceholder';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const GST_RATE = 0.18;

export default function CartView() {
  const { items, removeItem, updateQuantity } = useCart();

  const { subtotal, gst, total } = useMemo(() => {
    const sub = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const g = Math.round(sub * GST_RATE);
    return { subtotal: sub, gst: g, total: sub + g };
  }, [items]);

  /* ---------- Empty state ---------- */
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-black/5">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-tint text-brand">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </span>
        <h2 className="mt-5 text-xl font-bold text-ink">Your cart is empty</h2>
        <p className="mt-2 text-sm text-ink/65">
          Looks like you haven&apos;t added any services yet. Browse our services to
          get started.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-dark active:scale-95"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  /* ---------- Cart with items ---------- */
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Items list */}
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.key}
              className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5 transition-shadow hover:shadow-card-hover sm:flex-row sm:p-5"
            >
              {/* Placeholder image */}
              <ImagePlaceholder className="aspect-[16/10] w-full flex-shrink-0 sm:aspect-square sm:w-28" />

              {/* Details */}
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-ink">{item.name}</h3>
                    <Link
                      href={`/services/${item.serviceSlug}`}
                      className="mt-0.5 text-xs font-medium text-brand hover:underline"
                    >
                      View service
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>

                {/* Note: date/time/pincode are captured at checkout */}
                <p className="mt-2 text-xs text-ink/50">
                  You&apos;ll choose your preferred date, time &amp; address at checkout.
                </p>

                {/* Bottom: quantity + price */}
                <div className="mt-4 flex items-center justify-between">
                  {item.isHourly ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-ink/60">Hours</span>
                      <div className="flex items-center rounded-lg ring-1 ring-black/10">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          aria-label="Decrease hours"
                          className="flex h-8 w-8 items-center justify-center rounded-l-lg text-brand transition-colors hover:bg-brand-tint"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          aria-label="Increase hours"
                          className="flex h-8 w-8 items-center justify-center rounded-r-lg text-brand transition-colors hover:bg-brand-tint"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-ink/50">Qty: 1</span>
                  )}

                  <div className="text-right">
                    <p className="text-base font-extrabold text-brand">
                      {inr(item.price * item.quantity)}
                    </p>
                    {item.isHourly && (
                      <p className="text-xs text-ink/50">{inr(item.price)} / hr</p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Continue shopping
        </Link>
      </div>

      {/* Order summary */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5">
          <h2 className="text-lg font-bold text-brand">Order Summary</h2>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ink/70">Subtotal</dt>
              <dd className="font-semibold text-ink">{inr(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink/70">GST (18%)</dt>
              <dd className="font-semibold text-ink">{inr(gst)}</dd>
            </div>
            <div className="my-2 border-t border-dashed border-gray-200" />
            <div className="flex items-center justify-between">
              <dt className="text-base font-bold text-ink">Total</dt>
              <dd className="text-xl font-extrabold text-brand">{inr(total)}</dd>
            </div>
          </dl>

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-dark active:scale-[0.98]"
          >
            Proceed to Checkout
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          <p className="mt-3 flex items-start gap-2 text-xs text-ink/55">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            For inspection/visit services, only the visit fee is charged now. Final
            charges are shared after the professional&apos;s assessment.
          </p>
        </div>
      </aside>
    </div>
  );
}
