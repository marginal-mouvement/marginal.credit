import type {
  ReaderApi,
  AnyStationSnapshot,
} from "@marginal.credit/station-sdk";
import type { ResultOf } from "@marginal.credit/sdk";

export interface Reader {
  id: string;
  name: string;
  keyPresence: boolean;
  locked: boolean;
  keyId: string | undefined;
  lastEvent: AnyStationSnapshot | undefined;
}

interface FetchInitialDataAction {
  type: "fetch-initial-data";
  payload: ResultOf<typeof ReaderApi.GetAll>;
}

interface ApplyEventAction {
  type: "apply-event";
  payload: AnyStationSnapshot;
}

interface LockReaderAction {
  type: "lock-reader";
  payload: { readerId: string };
}

interface UnlockReaderAction {
  type: "unlock-reader";
  payload: { readerId: string };
}

export type ReaderAction =
  | FetchInitialDataAction
  | ApplyEventAction
  | LockReaderAction
  | UnlockReaderAction;

export type ReaderDict = Record<string, Reader>;
