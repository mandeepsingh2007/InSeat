import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { MenuItem, Vendor } from "../data/catalog";
import { getVendor } from "../data/catalog";
import type { Stadium } from "../data/stadiums";

type CartState = {
  stadiumId: string;
  vendorId: string;
  qty: Record<string, number>;
} | null;

export type CartLine = { item: MenuItem; qty: number };

type CartContextValue = {
  stadium?: Stadium;
  vendor?: Vendor;
  lines: CartLine[];
  count: number;
  itemTotal: number;
  qtyOf: (itemId: string) => number;
  add: (vendor: Vendor, item: MenuItem) => "added" | "conflict";
  remove: (item: MenuItem) => void;
  replaceWith: (vendor: Vendor, item: MenuItem) => void;
  clear: () => void;
};

const STORAGE_KEY = "inseat.cart";
const CartContext = createContext<CartContextValue | null>(null);

function load(): CartState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartState) : null;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(load);

  useEffect(() => {
    if (cart) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    else sessionStorage.removeItem(STORAGE_KEY);
  }, [cart]);

  const resolved = cart ? getVendor(cart.stadiumId, cart.vendorId) : undefined;

  const lines = useMemo<CartLine[]>(() => {
    if (!cart || !resolved) return [];
    return resolved.vendor.items
      .filter((item) => (cart.qty[item.id] ?? 0) > 0)
      .map((item) => ({ item, qty: cart.qty[item.id] }));
  }, [cart, resolved]);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const itemTotal = lines.reduce((n, l) => n + l.qty * l.item.price, 0);

  const qtyOf = useCallback((itemId: string) => cart?.qty[itemId] ?? 0, [cart]);

  const add = useCallback(
    (vendor: Vendor, item: MenuItem) => {
      if (cart && cart.vendorId !== vendor.id && Object.keys(cart.qty).length > 0) return "conflict";
      setCart((prev) => {
        const base = prev && prev.vendorId === vendor.id ? prev : { stadiumId: vendor.stadiumId, vendorId: vendor.id, qty: {} };
        return { ...base, qty: { ...base.qty, [item.id]: (base.qty[item.id] ?? 0) + 1 } };
      });
      return "added";
    },
    [cart],
  );

  const remove = useCallback((item: MenuItem) => {
    setCart((prev) => {
      if (!prev) return prev;
      const next = { ...prev.qty };
      const q = (next[item.id] ?? 0) - 1;
      if (q > 0) next[item.id] = q;
      else delete next[item.id];
      return Object.keys(next).length ? { ...prev, qty: next } : null;
    });
  }, []);

  const replaceWith = useCallback((vendor: Vendor, item: MenuItem) => {
    setCart({ stadiumId: vendor.stadiumId, vendorId: vendor.id, qty: { [item.id]: 1 } });
  }, []);

  const clear = useCallback(() => setCart(null), []);

  const value: CartContextValue = {
    stadium: resolved?.stadium,
    vendor: resolved?.vendor,
    lines,
    count,
    itemTotal,
    qtyOf,
    add,
    remove,
    replaceWith,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
