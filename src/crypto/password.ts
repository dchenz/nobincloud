import { Buffer } from "buffer";
import ScryptJS from "scrypt-js";
import { encrypt } from "./cipher";
import { randomBytes } from "./utils";

/**
 * Default values in Python scrypt.
 * https://github.com/holgern/py-scrypt/blob/master/scrypt/scrypt.py#L200
 */
const scryptDefaultOptions = {
  cpu: 2 ** 14,
  memory: 8,
  threads: 1,
};

/**
 * Derive the key from user's email and password.
 *
 * @param password Plaintext password
 * @param salt Unique value per user (email, must be dupe-checked beforehand)
 * @param useCache Whether to cache in sessionStorage (testing purposes).
 * @returns AES key derived from password
 */
export function derivePasswordKey(password: string, salt: string): ArrayBuffer {
  // Key is directly as an AES256 key to decrypt wrapped DEK,
  // so it's 32 bytes long.
  return Buffer.from(
    ScryptJS.syncScrypt(
      Buffer.from(password),
      Buffer.from(salt),
      scryptDefaultOptions.cpu,
      scryptDefaultOptions.memory,
      scryptDefaultOptions.threads,
      32
    )
  );
}

/**
 * Derive the password hash received by the server during a login attempt.
 *
 * @param pw Plaintext password
 * @param passwordKey AES key derived from password
 * @returns Hash to be sent to server to prove identity
 */
export function deriveServerPasswordHash(
  pw: string,
  passwordKey: ArrayBuffer
): Promise<ArrayBuffer> {
  return window.crypto.subtle.digest(
    "SHA-512",
    Buffer.concat([passwordKey as Buffer, Buffer.from(pw)])
  );
}

/**
 * Generate an encrypted AES256 key.
 * This is used during account creation and is stored on the server.
 *
 * @param key AES key to encrypt the other AES key
 * @returns AES key, both encrypted and unencrypted
 */
export async function generateWrappedKey(
  key: ArrayBuffer
): Promise<ArrayBuffer[]> {
  const k = randomBytes(32);
  return [await encrypt(k, key), k];
}
