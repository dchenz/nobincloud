import crypto from "crypto";

global.beforeAll(() => {
  global.window = {
    // @ts-ignore
    crypto: crypto.webcrypto
  };
});