import {
  deriveMasterKey,
  deriveServerPasswordHash,
  generateWrappedDataEncryptionKey
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
  const expectedMasterKey = Buffer.from(
    "a1fb7e7f1130240cb053cac29cb4fa47" +
    "401100e20106a161e5546e585007d880",
    "hex"
  );
  /*
      Tested with Python.

      h = hashlib.sha512(k + b"P@ssw0rd hello_wor1d")
      print(h.hexdigest())
  */
  const expectedHashedMasterKey = Buffer.from(
    "6ac7112f8005d0bcf0c885c122ffceba" +
    "2e08b3bc34761b3c66484cadf1f4f55b" +
    "ecd87efe4ae68001cc4b25c390762272" +
    "d1991915537b11dfcb33b3fa9f81304e",
    "hex"
  );
  // Master key
  const masterKey = deriveMasterKey(PASSWORD, EMAIL);
  expect(masterKey.byteLength)
    .toBe(32);
  expect(Buffer.from(masterKey).toString())
    .toBe(expectedMasterKey.toString());
  // Hash of master key uploaded to server
  const hashedMasterKey = await deriveServerPasswordHash(PASSWORD, masterKey);
  expect(hashedMasterKey.byteLength)
    .toBe(64);
  expect(Buffer.from(hashedMasterKey).toString())
    .toBe(expectedHashedMasterKey.toString());
  // Encrypted encryption key uploaded to server
  const wrappedKey = await generateWrappedDataEncryptionKey(masterKey);
  // AES-GCM 12-byte IV + 32-byte encrypted AES key + 16-byte MAC
  expect(wrappedKey.byteLength)
    .toBe(12 + 32 + 16);
});

