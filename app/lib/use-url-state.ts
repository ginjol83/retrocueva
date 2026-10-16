"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

type Params = Record<string, string>;

const CHANGE_EVENT = "retrocueva:urlchange";

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
};

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

export function useUrlState<T extends Params>(defaults: T) {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const state = useMemo(() => {
    const params = new URLSearchParams(search);
    const next = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const value = params.get(key);
      if (value) next[key as keyof T] = value as T[keyof T];
    }
    return next;
  }, [search, defaults]);

  const setValues = useCallback(
    (patch: Partial<T>) => {
      const merged = { ...state, ...patch };
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(merged)) {
        if (!value || value === defaults[key as keyof T]) params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      window.history.replaceState(
        null,
        "",
        qs ? `?${qs}` : window.location.pathname,
      );
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [state, defaults],
  );

  const reset = useCallback(() => setValues(defaults), [setValues, defaults]);

  return { state, setValues, reset } as const;
}
