import { InfrastructureError } from "@marginal.credit/backend-framework";

export class Type2Tlv {
  static readonly TLV_TERMINATOR = 0xfe;
  private static readonly TLV_NDEF = 0x03;

  static wrap(ndefMessage: Buffer): Buffer {
    if (ndefMessage.length > 0xfe) {
      throw InfrastructureError.because(
        "NDEF too long for 1-byte TLV length (max 254)",
      );
    }
    return Buffer.concat([
      Buffer.from([Type2Tlv.TLV_NDEF, ndefMessage.length]),
      ndefMessage,
      Buffer.from([Type2Tlv.TLV_TERMINATOR]),
    ]);
  }

  static extract(data: Buffer): Buffer | undefined {
    // minimal: expect TLV right at the start of user memory (page 4)
    if (data.length < 2) return undefined;
    if (data[0] !== Type2Tlv.TLV_NDEF) return undefined;

    const len = data[1];
    if (len === undefined) return undefined;

    const start = 2;
    const end = start + len;
    if (end > data.length) return undefined;

    return data.subarray(start, end);
  }
}
