import crypto from "crypto";

global.beforeAll(() => {
  global.window = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    crypto: crypto.webcrypto,
  };
});
