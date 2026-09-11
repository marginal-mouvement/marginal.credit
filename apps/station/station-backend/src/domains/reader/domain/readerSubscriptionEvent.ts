import type { AnyStationSnapshot } from "@marginal.credit/station-sdk";

import type { ReaderId } from "./readerId";

function extractDataFromError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export const ReaderSubscriptionEvent = {
  Connected: (readerId: ReaderId, readerName: string, at: Date) => ({
    name: "ReaderConnected",
    payload: { readerId: readerId.serialize(), readerName },
    at,
  }),
  Disconnected: (readerId: ReaderId, at: Date) => ({
    name: "ReaderDisconnected",
    payload: { readerId: readerId.serialize() },
    at,
  }),
  NotFound: (readerId: ReaderId, at: Date) => ({
    name: "ReaderNotFound",
    payload: { readerId: readerId.serialize() },
    at,
  }),
  NoTagRead: (readerId: ReaderId, at: Date) => ({
    name: "NoTagRead",
    payload: { readerId: readerId.serialize() },
    at,
  }),
  KeyIdRead: (readerId: ReaderId, keyId: string, at: Date) => ({
    name: "KeyIdRead",
    payload: { readerId: readerId.serialize(), keyId },
    at,
  }),
  ReadFailed: (readerId: ReaderId, error: unknown, at: Date) => ({
    name: "ReadFailed",
    payload: {
      readerId: readerId.serialize(),
      error: extractDataFromError(error),
    },
    at,
  }),
  UnknownError: (readerId: ReaderId, error: unknown, at: Date) => ({
    name: "ReaderUnknownError",
    payload: {
      readerId: readerId.serialize(),
      error: extractDataFromError(error),
    },
    at,
  }),
  KeyOn: (readerId: ReaderId, at: Date) => ({
    name: "KeyOn",
    payload: { readerId: readerId.serialize() },
    at,
  }),
  KeyOff: (readerId: ReaderId, at: Date) => ({
    name: "KeyOff",
    payload: { readerId: readerId.serialize() },
    at,
  }),
} as const satisfies Record<string, (...params: any[]) => AnyStationSnapshot>;
