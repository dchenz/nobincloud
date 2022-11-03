/* eslint-disable @typescript-eslint/ban-ts-comment */
import crypto from "crypto";

global.beforeAll(() => {
  // @ts-ignore
  global.window = {
    // @ts-ignore
    crypto: crypto.webcrypto
  };
});