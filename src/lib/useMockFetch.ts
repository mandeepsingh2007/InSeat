import { useEffect, useState } from "react";

/** Walks through `steps` over `totalMs` to stand in for a network fetch in the prototype. */
export function useMockFetch(key: string | undefined, steps: number, totalMs: number) {
  const [state, setState] = useState({ key, step: 0 });
  const step = state.key === key ? state.step : 0;

  useEffect(() => {
    setState({ key, step: 0 });
    const per = totalMs / steps;
    const timers = Array.from({ length: steps }, (_, i) =>
      setTimeout(() => setState({ key, step: i + 1 }), per * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, [key, steps, totalMs]);

  return { step, loading: step < steps };
}
