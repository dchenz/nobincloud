import {
  derivePasswordKey,
  deriveServerPasswordHash,
  generateWrappedKey,
} from "./password";

test("Derive main account key and upload hash to server", async () => {
  const PASSWORD = "P@ssw0rd hello_wor1d";
  const EMAIL = "hello@example.com";
  /*
      Tested with Python (pip install scrypt).

      k = scrypt.hash(
        "P@ssw0rd hello_wor1d",
        "hello@example.com",
        buflen=64
      )
      print(k.hex())
  */
  const expectedPasswordKey = Buffer.from(
    "a1fb7e7f1130240cb053cac29cb4fa47" + "401100e20106a161e5546e585007d880",
    "hex"
  );
  /*
      Tested with Python.

      h = hashlib.sha512(k + b"P@ssw0rd hello_wor1d")
      print(h.hexdigest())
  */
  const expectedHashedPasswordKey = Buffer.from(
    "6ac7112f8005d0bcf0c885c122ffceba" +
      "2e08b3bc34761b3c66484cadf1f4f55b" +
      "ecd87efe4ae68001cc4b25c390762272" +
      "d1991915537b11dfcb33b3fa9f81304e",
    "hex"
  );
  // Password key
  const passwordKey = derivePasswordKey(PASSWORD, EMAIL);
  expect(passwordKey.byteLength).toBe(32);
  expect(Buffer.from(passwordKey).toString()).toBe(
    expectedPasswordKey.toString()
  );
  // Hash of password key uploaded to server
  const hashedPasswordKey = await deriveServerPasswordHash(
    PASSWORD,
    passwordKey
  );
  expect(hashedPasswordKey.byteLength).toBe(64);
  expect(Buffer.from(hashedPasswordKey).toString()).toBe(
    expectedHashedPasswordKey.toString()
  );
  // Encrypted encryption key uploaded to server
  const [wrappedKey, key] = await generateWrappedKey(passwordKey);
  // AES-GCM 12-byte IV + 32-byte encrypted AES key + 16-byte MAC
  expect(wrappedKey.byteLength).toBe(12 + 32 + 16);
  expect(key.byteLength).toBe(32);
});
