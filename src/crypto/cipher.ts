import { concatArrayBuffer, randomBytes } from "./utils";

/**
 * Encrypt data using AES-GCM mode.
 * The returned buffer includes the IV and authentication tag.
 *
 * @param plain Data to be encrypted
 * @param key AES key
 * @returns Cipher text prepended with IV
 */
export async function encrypt(
  plain: ArrayBuffer,
  key: ArrayBuffer
): Promise<ArrayBuffer> {
  const iv = randomBytes(12);
  const cipher = { name: "AES-GCM", iv };
  const _key = await window.crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  return concatArrayBuffer(
    iv,
    await window.crypto.subtle.encrypt(cipher, _key, plain)
  );
}

/**
 * Decrypt data using AES-GCM mode.
 * The cipher text must include the IV and authentication tag.
 *
 * @param enc Data to be decrypted
 * @param key AES key
 * @returns Plain text (null, if decryption failed)
 */
export async function decrypt(
  enc: ArrayBuffer,
  key: ArrayBuffer
): Promise<ArrayBuffer | null> {
  const cipher = { name: "AES-GCM", iv: enc.slice(0, 12) };
  const _key = await window.crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  try {
    return await window.crypto.subtle.decrypt(cipher, _key, enc.slice(12));
  } catch (e) {
    return null;
  }
}
