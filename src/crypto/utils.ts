import { Buffer } from "buffer";
import { UUID } from "../types/Files";

/**
 * Concatenate N ArrayBuffer into one ArrayBuffer.
 */
export function concatArrayBuffer(...buffers: ArrayBuffer[]): ArrayBuffer {
  const totalByteLength = buffers.reduce(
    (prev, cur) => prev + cur.byteLength,
    0
  );
  const tmp = new Uint8Array(totalByteLength);
  let curOffset = 0;
  for (const buf of buffers) {
    tmp.set(new Uint8Array(buf), curOffset);
    curOffset += buf.byteLength;
  }
  return tmp.buffer;
}

export function arrayBufferToString(
  buf: ArrayBuffer,
  encoding?: BufferEncoding
): string {
  return Buffer.from(buf).toString(encoding);
}

/**
 * Generate strong random bytes.
 *
 * @param n Number of bytes
 * @returns Random bytes
 */
export function randomBytes(n: number): ArrayBuffer {
  return window.crypto.getRandomValues(new Uint8Array(n));
}

/**
 * Generate a UUID string with dashes.
 *
 * @returns UUID
 */
export function uuid(): UUID {
  return window.crypto.randomUUID();
}
