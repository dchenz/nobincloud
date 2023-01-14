import {
  arrayBufferToString,
  concatArrayBuffer,
  randomBytes,
  uuid,
} from "./utils";

test("Concat array buffer", () => {
  const text1 = "hello world";
  const text2 = "test";
  const text3 = "";
  const buf1 = Buffer.from(text1);
  const buf2 = Buffer.from(text2);
  const buf3 = Buffer.from(text3);

  const concatToString = (...buffers: ArrayBuffer[]) =>
    Buffer.from(concatArrayBuffer(...buffers)).toString("utf8");

  // Single ArrayBuffer

  expect(concatToString(buf1)).toBe(text1);

  expect(concatToString(buf3)).toBe(text3);

  // Two ArrayBuffer

  expect(concatToString(buf1, buf2)).toBe(text1 + text2);

  expect(concatToString(buf2, buf1)).toBe(text2 + text1);

  // ArrayBuffer with itself

  expect(concatToString(buf1, buf1)).toBe(text1 + text1);

  // More than two ArrayBuffer

  expect(concatToString(buf1, buf2, buf2, buf1)).toBe(
    text1 + text2 + text2 + text1
  );

  // No ArrayBuffer

  expect(concatToString()).toBe("");
});

test("Convert array buffer to string", () => {
  expect(arrayBufferToString(Buffer.from("hello world"))).toBe("hello world");
  expect(arrayBufferToString(Buffer.from("hello world"), "hex")).toBe(
    "68656c6c6f20776f726c64"
  );
  expect(arrayBufferToString(Buffer.from("hello world"), "utf-8")).toBe(
    "hello world"
  );
});

test("Generate random bytes", () => {
  expect(randomBytes(32).byteLength).toBe(32);
});

test("Generate UUID", () => {
  expect(uuid().length).toBe(36);
});
