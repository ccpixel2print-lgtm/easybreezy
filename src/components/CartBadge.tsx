'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartBadge() {
  const { count } = useCart();

  if (count === 0) return null; // hide when empty

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
      className="fixed bottom-24 right-5 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-card transition-transform duration-200 hover:scale-105 active:scale-95 sm:bottom-6 sm:right-24"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
      <span className="absolute -right-1 -top-1 flex min-h-[22px] min-w-[22px] items-center justify-center rounded-full bg-accent px-1.5 text-xs font-extrabold text-brand-dark ring-2 ring-white">
        {count}
      </span>
    </Link>
  );
}