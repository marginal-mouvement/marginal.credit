import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import type { SimpleTransfer } from "@marginal.credit/platform-sdk";

import { platformSDK } from "../platform/platformSDK.ts";

interface TransferContext {
  transfers: SimpleTransfer[];
  areTransfersLoading: boolean;
  loadMyTransfers: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components, ts/no-redeclare
export const TransferContext = createContext<TransferContext>(null!);

export const TransferContextProvider = ({ children }: PropsWithChildren) => {
  const [transfers, setTransfers] = useState<SimpleTransfer[]>([]);
  const [areTransfersLoading, setAreTransfersLoading] = useState(true);

  const loadMyTransfers = useCallback(() => {
    if (transfers.length > 0) return;

    platformSDK.transfer.allMines().then((response) => {
      setTransfers(response.transfers);
      setAreTransfersLoading(false);
    });
  }, [transfers.length]);

  const value = useMemo(
    () => ({
      transfers,
      areTransfersLoading,
      loadMyTransfers,
    }),
    [areTransfersLoading, loadMyTransfers, transfers],
  );

  return (
    <TransferContext.Provider value={value}>
      {children}
    </TransferContext.Provider>
  );
};
