'use client';

import { useState } from 'react';

interface AddToCartButtonProps {
  label?: string;
  fullWidth?: boolean;
}

/**
 * Visual placeholder "Add to Cart" button.
 * Fires a global `eb-add-to-cart` event so the CartBadge count updates,
 * and shows a brief "Added ✓" confirmation. No real cart logic yet.
 */
export default function AddToCartButton({
  label = 'Add to Cart',
  fullWidth = true,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('eb-add-to-cart'));
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
        fullWidth ? 'w-full' : ''
      } ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-brand text-white hover:bg-brand-dark'
      }`}
    >
      {added ? (
        <>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
          </svg>
          Added
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
