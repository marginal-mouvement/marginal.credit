import {
  type ActionDispatch,
  createContext,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { ReaderApi } from "@marginal.credit/station-sdk";

import type { Reader, ReaderAction, ReaderDict } from "./types.ts";
import { Readers } from "./readers.ts";

import { stationSDK } from "../sdk/stationSDK.ts";

interface ReaderContextValue {
  readerDict: Record<string, Reader>;
  readerList: Reader[];
  dispatchReaderAction: ActionDispatch<[action: ReaderAction]>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ReaderContext = createContext<ReaderContextValue>(null!);

export const ReaderContextProvider = ({ children }: PropsWithChildren) => {
  const [readerDict, dispatchReaderAction] = useReducer(
    Readers.reducer,
    {} as ReaderDict,
  );
  const unsubscribeFromReaderEvents = useRef<() => void>(null);

  useEffect(() => {
    async function fetchReaders() {
      const res = await stationSDK.use(ReaderApi.GetAll);

      dispatchReaderAction({
        type: "fetch-initial-data",
        payload: res,
      });

      const { unsubscribe } = await stationSDK.subscribe((event) => {
        dispatchReaderAction({
          type: "apply-event",
          payload: event,
        });
      });

      unsubscribeFromReaderEvents.current = unsubscribe;
    }

    fetchReaders().catch(console.error);

    return () => {
      unsubscribeFromReaderEvents.current?.();
    };
  }, []);

  const readerList = useMemo(() => Object.values(readerDict), [readerDict]);

  const value = useMemo(
    () => ({ readerDict, readerList, dispatchReaderAction }),
    [readerDict, readerList],
  );

  return (
    <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>
  );
};
