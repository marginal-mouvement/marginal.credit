import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import { ShowApi, type SimpleShow } from "@marginal.credit/platform-sdk";
import type { PayloadOf } from "@marginal.credit/sdk";

import { platformSDK } from "../platform/platformSDK.ts";

interface ShowContext {
  shows: SimpleShow[];
  showsLoading: boolean;
  createShow: (payload: PayloadOf<typeof ShowApi.Create>) => Promise<void>;
  fetchShows: () => void;
  fetchError?: Error;
  retry: () => void;
}

// eslint-disable-next-line ts/no-redeclare, react-refresh/only-export-components
export const ShowContext = createContext<ShowContext>(null!);

export const ShowContextProvider = ({ children }: PropsWithChildren) => {
  const [showsLoading, setShowsLoading] = useState(true);
  const [shows, setShows] = useState<SimpleShow[]>([]);

  const [fetchInitiated, setFetchInitiated] = useState(false);
  const [fetchError, setFetchError] = useState<Error | undefined>(undefined);

  const fetchShows = useCallback(() => {
    if (fetchInitiated) {
      return;
    }

    setFetchInitiated(true);
    platformSDK
      .use(ShowApi.AllShows)
      .then((res) => {
        setShowsLoading(false);
        setShows(res.shows);
      })
      .catch((err) => {
        console.log(err);
        setFetchError(err);
      });
  }, [fetchInitiated]);

  const retry = useCallback(() => {
    setShowsLoading(true);
    setFetchInitiated(false);
    setFetchError(undefined);
  }, []);

  const createShow = useCallback(
    async (payload: PayloadOf<typeof ShowApi.Create>) => {
      const show = await platformSDK.show.create(payload);
      setShows((shows) =>
        shows.some((s) => s.id === show.id) ? shows : [...shows, show],
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      showsLoading,
      shows,
      createShow,
      fetchShows,
      fetchError,
      retry,
    }),
    [createShow, fetchError, fetchShows, retry, shows, showsLoading],
  );

  return <ShowContext.Provider value={value}>{children}</ShowContext.Provider>;
};
