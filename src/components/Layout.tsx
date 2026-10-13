import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Armchair, ShoppingBag } from "lucide-react";
import { useCart } from "../lib/cart";

export default function Layout() {
  const { count } = useCart();
  const { pathname } = useLocation();
  const hideCart = pathname === "/cart" || pathname.startsWith("/track");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/60 bg-night/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-amber text-night shadow-lg shadow-amber/30">
              <Armchair className="size-5" strokeWidth={2.5} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-semibold tracking-wide">InSeat</span>
              <span className="block text-[11px] font-medium text-muted">Food to your seat</span>
            </span>
          </Link>

          {!hideCart && (
            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold transition hover:border-amber/60"
              aria-label={`Cart with ${count} items`}
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-amber px-1 text-xs font-bold text-night">
                  {count}
                </span>
              )}
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
