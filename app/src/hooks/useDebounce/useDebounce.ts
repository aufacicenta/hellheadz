/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback } from "react";

export function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): T[] {
  const functionTimeoutHandler = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useRef(callback);
  debouncedFunction.current = callback;

  const cancelDebouncedCallback = useCallback(() => {
    if (functionTimeoutHandler.current) {
      clearTimeout(functionTimeoutHandler.current);
      functionTimeoutHandler.current = null;
    }
  }, []);

  const debouncedCallback = useCallback(
    (...args: any[]) => {
      cancelDebouncedCallback();
      functionTimeoutHandler.current = setTimeout(() => {
        debouncedFunction.current(...args);
      }, delay);
    },
    [delay, cancelDebouncedCallback],
  );

  return [debouncedCallback as T];
}
