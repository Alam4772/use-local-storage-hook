import { useState, useEffect } from "react";

type Serializer = (value: any) => string;
type Deserializer = (value: string) => any;

interface Options {
  ttl?: number;
  namespace?: string;
  serializer?: Serializer;
  deserializer?: Deserializer;
}

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const testKey = "__ls_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export default function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: Options = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { ttl, namespace = "", serializer = JSON.stringify, deserializer = JSON.parse } = options;
  const storageKey = namespace ? `${namespace}:${key}` : key;
  const hasStorage = isLocalStorageAvailable();

  const readValue = (): T => {
    if (!hasStorage) return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue as T;

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw === null) return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue as T;

      const data = deserializer(raw);
      if (data && typeof data === "object" && "expiry" in data) {
        if (data.expiry && Date.now() > data.expiry) {
          window.localStorage.removeItem(storageKey);
          return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue as T;
        }
        return data.value as T;
      }
      return data as T;
    } catch {
      return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue as T;
    }
  };

  const [state, setState] = useState<T>(readValue);

  useEffect(() => {
    if (!hasStorage) return;
    try {
      const toStore = ttl ? { value: state, expiry: Date.now() + ttl } : { value: state };
      window.localStorage.setItem(storageKey, serializer(toStore));
    } catch {}
  }, [state, storageKey, ttl, serializer, hasStorage]);

  useEffect(() => {
    if (!hasStorage) return;
    const handler = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      try {
        if (e.newValue === null) {
          setState(typeof initialValue === "function" ? (initialValue as () => T)() : initialValue as T);
        } else {
          const data = deserializer(e.newValue);
          setState(data && "value" in data ? data.value : data);
        }
      } catch {}
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [storageKey, deserializer, initialValue, hasStorage]);

  const setValue = (val: T | ((prev: T) => T)) => {
    setState((prev: T) => (val instanceof Function ? (val as (prev: T) => T)(prev) : val as T));
  };

  const remove = () => {
    if (hasStorage) {
      try { window.localStorage.removeItem(storageKey); } catch {}
    }
    setState(typeof initialValue === "function" ? (initialValue as () => T)() : initialValue as T);
  };

  return [state, setValue, remove];
}
