import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl font-semibold text-amber">404</p>
      <p className="mt-2 text-muted">We could not find that page.</p>
      <Link to="/" className="mt-6 rounded-xl bg-amber px-5 py-3 font-bold text-night">
        Back to sports
      </Link>
    </div>
  );
}
