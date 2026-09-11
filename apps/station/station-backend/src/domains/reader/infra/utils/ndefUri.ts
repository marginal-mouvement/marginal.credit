import { InfrastructureError } from "@marginal.credit/backend-framework";

import type { UriPrefix } from "./uriPrefix";

export class NdefUri {
  private static readonly RECORD_HEADER_SINGLE_SHORT = 0xd1;
  private static readonly TYPE_LENGTH_URI = 0x01;
  private static readonly TYPE_URI = 0x55; // 'U'

  static encodeRecord(prefix: UriPrefix, uriRemainder: string): Buffer {
    const uriBytes = Buffer.from(uriRemainder, "utf8");
    const payloadLen = 1 + uriBytes.length;

    if (payloadLen > 0xff) {
      throw InfrastructureError.because(
        "URI too long for short NDEF record (SR=1)",
      );
    }

    return Buffer.concat([
      Buffer.from([
        NdefUri.RECORD_HEADER_SINGLE_SHORT,
        NdefUri.TYPE_LENGTH_URI,
        payloadLen,
        NdefUri.TYPE_URI,
        prefix,
      ]),
      uriBytes,
    ]);
  }

  static decodeFirstRecordToUrl(ndef: Buffer): string | undefined {
    if (ndef.length < 5) return undefined;

    const header = ndef[0];
    if (header !== NdefUri.RECORD_HEADER_SINGLE_SHORT) {
      // minimal: only accept the exact record form we write
      return undefined;
    }

    const typeLen = ndef[1];
    const payloadLen = ndef[2] ?? 0;
    const type = ndef[3];

    if (typeLen !== 1 || type !== NdefUri.TYPE_URI) return undefined;

    const payload = ndef.subarray(4, 4 + payloadLen);
    if (payload.length < 1) return undefined;

    return payload.subarray(1).toString("utf8");
  }
}
