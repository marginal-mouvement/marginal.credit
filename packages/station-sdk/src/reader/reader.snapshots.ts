/* eslint-disable ts/no-redeclare */
import { Snapshot } from "@marginal.credit/sdk";
import { z } from "zod";

export const ReaderConnectedSnapshot = Snapshot("ReaderConnected", {
  readerId: z.string(),
  readerName: z.string(),
});
export type ReaderConnectedSnapshot = z.infer<typeof ReaderConnectedSnapshot>;

export const ReaderDisconnectedSnapshot = Snapshot("ReaderDisconnected", {
  readerId: z.string(),
});
export type ReaderDisconnectedSnapshot = z.infer<
  typeof ReaderDisconnectedSnapshot
>;

export const ReaderNotFoundSnapshot = Snapshot("ReaderNotFound", {
  readerId: z.string(),
});
export type ReaderNotFoundSnapshot = z.infer<typeof ReaderNotFoundSnapshot>;

export const NoTagReadSnapshot = Snapshot("NoTagRead", {
  readerId: z.string(),
});
export type NoTagReadSnapshot = z.infer<typeof NoTagReadSnapshot>;

export const ReadFailedSnapshot = Snapshot("ReadFailed", {
  readerId: z.string(),
  error: z.string(),
});
export type ReadFailedSnapshot = z.infer<typeof ReadFailedSnapshot>;

export const KeyIdReadSnapshot = Snapshot("KeyIdRead", {
  keyId: z.string(),
  readerId: z.string(),
});
export type KeyIdReadSnapshot = z.infer<typeof KeyIdReadSnapshot>;

export const ReaderUnknownErrorSnapshot = Snapshot("ReaderUnknownError", {
  readerId: z.string(),
  error: z.string(),
});
export type ReaderUnknownErrorSnapshot = z.infer<
  typeof ReaderUnknownErrorSnapshot
>;

export const KeyOnSnapshot = Snapshot("KeyOn", {
  readerId: z.string(),
});
export type KeyOnSnapshot = z.infer<typeof KeyOnSnapshot>;

export const KeyOffSnapshot = Snapshot("KeyOff", {
  readerId: z.string(),
});
export type KeyOffSnapshot = z.infer<typeof KeyOffSnapshot>;
