import { Buffer } from "buffer";
import { decrypt, encrypt } from "./cipher";

const PLAIN_TEXT = Buffer.from(
  "The quick brown fox jumps over the lazy dog 😂😂😂"
);

const EMPTY_PLAIN_TEXT = Buffer.from("");

const KEY = Buffer.from(
  "fe58fdbd72ab86bedffb463ecace5d270fee777c4abdcdd036d2f1081abda5f5",
  "hex"
);

const BAD_AES_KEY = Buffer.from(
  "98ce40cb093a01b14caae7a5bd1fa2767402d550e8b000fa68732610124da765",
  "hex"
);

test("Encrypt/decrypt - regular unicode text", async () => {
  const encryptionOutput = await encrypt(PLAIN_TEXT, KEY);
  const decryptionOutput = await decrypt(encryptionOutput, KEY);
  const badDecryptionOutput = await decrypt(encryptionOutput, BAD_AES_KEY);
  // Check for successful decryption using correct key.
  if (decryptionOutput === null) {
    fail("Expected successful decryption");
  } else {
    expect(Buffer.from(decryptionOutput).toString()).toBe(
      PLAIN_TEXT.toString()
    );
  }
  // Check for failed decryption using incorrect key.
  expect(badDecryptionOutput).toBeNull();
});

test("Encrypt/decrypt - empty plaintext", async () => {
  const encryptionOutput = await encrypt(EMPTY_PLAIN_TEXT, KEY);
  const decryptionOutput = await decrypt(encryptionOutput, KEY);
  const badDecryptionOutput = await decrypt(encryptionOutput, BAD_AES_KEY);
  // Check for successful decryption using correct key.
  if (decryptionOutput === null) {
    fail("Expected successful decryption");
  } else {
    expect(Buffer.from(decryptionOutput).toString()).toBe(
      EMPTY_PLAIN_TEXT.toString()
    );
  }
  // Check for failed decryption using incorrect key.
  expect(badDecryptionOutput).toBeNull();
});
