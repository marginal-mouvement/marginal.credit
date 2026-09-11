import type { Dispatch, SetStateAction } from "react";
import { useCallback, useRef, useState } from "react";

export function useStateRef<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef(initialValue);

  const wrappedSetValue = useCallback(
    (valueOrFactory: T | ((prev: T) => T)) => {
      if (typeof valueOrFactory === "function") {
        setValue((prev) => {
          const value = (valueOrFactory as (prev: T) => T)(prev);
          ref.current = value;
          return value;
        });
      } else {
        setValue(valueOrFactory);
        ref.current = valueOrFactory;
      }
    },
    [],
  );

  return {
    ref: ref,
    state: [value, wrappedSetValue as Dispatch<SetStateAction<T>>] as const,
  };
}
