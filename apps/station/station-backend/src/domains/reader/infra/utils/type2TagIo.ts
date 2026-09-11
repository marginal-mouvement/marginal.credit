import type { Reader } from "@tockawa/nfc-pcsc";
import { InfrastructureError } from "@marginal.credit/backend-framework";

import { Buffer } from "node:buffer";

export class Type2TagIo {
  static readonly PAGE_SIZE = 4;

  private static readonly APDU = {
    CLA: 0xff,
    INS_READ_BINARY: 0xb0,
    INS_UPDATE_BINARY: 0xd6,
    P1: 0x00,
    LE_PAGE: 0x04, // read 4 bytes
    LC_PAGE: 0x04, // write 4 bytes
    SW1_OK: 0x90,
    SW2_OK: 0x00,
  } as const;

  constructor(private readonly reader: Reader) {}

  private async readPage(page: number): Promise<Buffer> {
    const apdu = Buffer.from([
      Type2TagIo.APDU.CLA,
      Type2TagIo.APDU.INS_READ_BINARY,
      Type2TagIo.APDU.P1,
      page & 0xff,
      Type2TagIo.APDU.LE_PAGE,
    ]);

    const resp = await this.reader.transmit(apdu, 6);
    this.assertOk(resp, `READ page ${page}`);
    return resp.subarray(0, 4);
  }

  private async writePage(page: number, data4: Buffer): Promise<void> {
    if (data4.length !== Type2TagIo.PAGE_SIZE) {
      throw InfrastructureError.because(
        `writePage expects exactly ${Type2TagIo.PAGE_SIZE} bytes`,
      );
    }

    const apdu = Buffer.from([
      Type2TagIo.APDU.CLA,
      Type2TagIo.APDU.INS_UPDATE_BINARY,
      Type2TagIo.APDU.P1,
      page & 0xff,
      Type2TagIo.APDU.LC_PAGE,
      ...data4,
    ]);

    // ACR122 usually returns only SW1SW2 here
    const resp = await this.reader.transmit(apdu, 2);
    this.assertOk(resp, `WRITE page ${page}`);
  }

  async readPages(startPage: number, pageCount: number): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for (let i = 0; i < pageCount; i++) {
      chunks.push(await this.readPage(startPage + i));
    }
    return Buffer.concat(chunks);
  }

  async writePages(startPage: number, data: Buffer): Promise<void> {
    if (data.length % 4 !== 0) {
      throw InfrastructureError.because(
        "writePages data length must be a multiple of 4",
      );
    }
    const pages = data.length / 4;
    for (let i = 0; i < pages; i++) {
      await this.writePage(startPage + i, data.subarray(i * 4, (i + 1) * 4));
    }
  }

  async invalidateAt(startPage: number): Promise<void> {
    await this.writePage(startPage, Buffer.alloc(4, 0x00));
  }

  private assertOk(resp: unknown, label: string): asserts resp is Buffer {
    if (!Buffer.isBuffer(resp)) {
      throw InfrastructureError.because(
        `${label} failed: invalid response`,
        resp,
      );
    }

    if (resp.length < 2) {
      throw InfrastructureError.because(
        `${label} failed: short response (${resp.toString("hex")})`,
      );
    }
    const sw1 = resp[resp.length - 2];
    const sw2 = resp[resp.length - 1];
    if (sw1 !== Type2TagIo.APDU.SW1_OK || sw2 !== Type2TagIo.APDU.SW2_OK) {
      throw InfrastructureError.because(
        `${label} failed (SW=${(sw1 ?? 0).toString(16)}${(sw2 ?? 0).toString(16)}), resp=${resp.toString("hex")}`,
      );
    }
  }

  static padTo4(data: Buffer) {
    const pad = (4 - (data.length % 4)) % 4;
    return pad === 0 ? data : Buffer.concat([data, Buffer.alloc(pad, 0x00)]);
  }
}
