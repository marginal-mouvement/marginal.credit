import type { AnyStationSnapshot } from "@marginal.credit/station-sdk";

import type { ReaderAction, ReaderDict } from "./types.ts";

export class Readers {
  static applyEvent(
    readers: ReaderDict,
    event: AnyStationSnapshot,
  ): ReaderDict {
    if (event.name === "ReaderConnected") {
      return {
        ...readers,
        [event.payload.readerId]: {
          id: event.payload.readerId,
          name: event.payload.readerName,
          keyPresence: false,
          locked: false,
          lastEvent: undefined,
          keyId: undefined,
        },
      };
    }

    const reader = readers[event.payload.readerId];

    if (!reader) {
      return readers;
    }

    if (reader.locked) {
      return readers;
    }

    switch (event.name) {
      case "KeyOn":
      case "KeyOff": {
        return {
          ...readers,
          [event.payload.readerId]: {
            ...reader,
            keyPresence: event.name === "KeyOn",
          },
        };
      }
      case "ReaderDisconnected": {
        const { [event.payload.readerId]: _, ...rest } = readers;
        void _;
        return rest;
      }
      case "KeyIdRead": {
        return {
          ...readers,
          [event.payload.readerId]: {
            ...reader,
            keyId: event.payload.keyId,
          },
        };
      }
      case "ReaderNotFound":
      case "ReaderUnknownError":
      case "ReadFailed":
      case "NoTagRead":
        return readers;
    }
  }

  static reducer(state: ReaderDict, action: ReaderAction) {
    switch (action.type) {
      case "fetch-initial-data": {
        return action.payload.readers.reduce<ReaderDict>(
          (acc, reader) => ({
            ...acc,
            [reader.id]: {
              id: reader.id,
              name: reader.name,
              keyPresence: false,
              locked: false,
              lastEvent: undefined,
              keyId: undefined,
            },
          }),
          {},
        );
      }
      case "apply-event":
        return Readers.applyEvent(state, action.payload);
      case "lock-reader": {
        const reader = state[action.payload.readerId];

        if (!reader) {
          return state;
        }

        return {
          ...state,
          [action.payload.readerId]: {
            ...reader,
            locked: true,
          },
        };
      }
      case "unlock-reader": {
        const reader = state[action.payload.readerId];

        if (!reader) {
          return state;
        }

        return {
          ...state,
          [action.payload.readerId]: {
            ...reader,
            locked: false,
            keyPresence: false,
            keyId: undefined,
            lastEvent: undefined,
          },
        };
      }
    }
  }
}
