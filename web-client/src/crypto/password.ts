import { Buffer } from "buffer";
import ScryptJS from "scrypt-js";
import { encrypt } from "./cipher";

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
 * Derive the account master key from user's email and password.
 *
 * @param password Plaintext password
 * @param salt Unique value per user (email, must be dupe-checked beforehand)
 * @param useCache Whether to cache in sessionStorage (testing purposes).
 * @returns Account master key
 */
export function deriveMasterKey(password: string, salt: string, useCache?: boolean): ArrayBuffer {
  if (useCache) {
    const cachedKey = sessionStorage.getItem("master-key");
    if (cachedKey) {
      return Buffer.from(cachedKey, "base64");
    }
  }
  // Master key is directly as an AES256 key to decrypt wrapped DEK,
  // so it's 32 bytes long.
  const key = Buffer.from(ScryptJS.syncScrypt(
    Buffer.from(password),
    Buffer.from(salt),
    scryptDefaultOptions.cpu,
    scryptDefaultOptions.memory,
    scryptDefaultOptions.threads,
    32,
  ));
  if (useCache) {
    sessionStorage.setItem("password-key", key.toString("base64"));
  }
  return key;
}

/**
 * Derive the password hash received by the server during a login attempt.
 *
 * @param pw Plaintext password
 * @param masterKey Account master key
 * @returns Hash to be sent to server to prove identity
 */
export function deriveServerPasswordHash(pw: string, masterKey: ArrayBuffer): Promise<ArrayBuffer> {
  return window.crypto.subtle.digest("SHA-512",
    Buffer.concat([masterKey as Buffer, Buffer.from(pw)])
  );
}

/**
 * Generate an encrypted AES256 key.
 * This is used during account creation and is stored on the server.
 *
 * @param masterKey Account master key
 * @returns Encrypted AES256 key
 */
export function generateWrappedDataEncryptionKey(masterKey: ArrayBuffer): Promise<ArrayBuffer> {
  return encrypt(window.crypto.getRandomValues(new Uint8Array(32)), masterKey);
}