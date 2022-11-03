import { Buffer } from "buffer";

/**
 * Concatenate N ArrayBuffer into one ArrayBuffer.
 */
export function concatArrayBuffer(...buffers: ArrayBuffer[]): ArrayBuffer {
  const totalByteLength = buffers.reduce((prev, cur) => prev + cur.byteLength, 0);
  const tmp = new Uint8Array(totalByteLength);
  let curOffset = 0;
  for (const buf of buffers) {
    tmp.set(new Uint8Array(buf), curOffset);
    curOffset += buf.byteLength;
  }
  return tmp.buffer;
}

export function arrayBufferToString(buf: ArrayBuffer, encoding?: BufferEncoding): string {
  return Buffer.from(buf).toString(encoding);
}