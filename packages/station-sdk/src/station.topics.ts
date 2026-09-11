import type { Topics } from "@marginal.credit/sdk";
import { Snapshots } from "@marginal.credit/sdk";
import type { z } from "zod";

import {
  KeyIdReadSnapshot,
  KeyOffSnapshot,
  KeyOnSnapshot,
  NoTagReadSnapshot,
  ReaderConnectedSnapshot,
  ReaderDisconnectedSnapshot,
  ReaderNotFoundSnapshot,
  ReaderUnknownErrorSnapshot,
  ReadFailedSnapshot,
} from "./reader/reader.snapshots";

export const AnyStationSnapshotSchema = Snapshots(
  ReaderConnectedSnapshot,
  ReaderDisconnectedSnapshot,
  ReaderNotFoundSnapshot,
  ReaderUnknownErrorSnapshot,
  ReadFailedSnapshot,
  KeyIdReadSnapshot,
  KeyOnSnapshot,
  KeyOffSnapshot,
  NoTagReadSnapshot,
);

export type AnyStationSnapshot = z.Infer<typeof AnyStationSnapshotSchema>;

export type StationTopics = Topics<
  AnyStationSnapshot,
  {
    "reader*":
      | ReaderConnectedSnapshot
      | ReaderDisconnectedSnapshot
      | ReaderNotFoundSnapshot
      | ReaderUnknownErrorSnapshot
      | ReadFailedSnapshot
      | KeyIdReadSnapshot
      | KeyOnSnapshot
      | KeyOffSnapshot
      | NoTagReadSnapshot;
  }
>;
