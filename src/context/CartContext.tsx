'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
  // stable key for the row (serviceId or subServiceId)
  key: string;
  serviceId: string;
  subServiceId: string | null;
  name: string;
  price: number;        // rupees, for display only (server re-validates)
  originalPrice?: number;
  isHourly: boolean;
  quantity: number;     // hours if hourly, else 1
  serviceSlug: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

const STORAGE_KEY = 'eb_cart';
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      /* ignore corrupt cart */
    }
    setHydrated(true);
  }, []);

  // Persist on change (only after hydration to avoid clobbering)
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextValue['addItem'] = useCallback((item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.key === item.key);
      if (existing) {
        // For hourly items, bump hours; otherwise keep single (no duplicate rows)
        return prev.map((i) =>
          i.key === item.key
            ? { ...i, quantity: item.isHourly ? i.quantity + 1 : 1 }
            : i,
        );
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + (i.isHourly ? 1 : 1), 0); // rows count

  return (
    <CartContext.Provider value={{ items, count, addItem, removeItem, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
