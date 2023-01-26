import { SERVER_ROUTES } from "../const";
import {
  derivePasswordKey,
  deriveServerPasswordHash,
  generateWrappedKey,
} from "../crypto/password";
import { arrayBufferToString } from "../crypto/utils";
import { AccountSignupDetails } from "../types/Account";
import { Response } from "../types/API";

/**
 * Send an API request to register a new account.
 *
 * @param details Account details (email, password, nickname)
 * @returns ({ success: true, data: undefined })
 */
export async function registerAccount(
  details: AccountSignupDetails,
  captchaToken: string
): Promise<Response<ArrayBuffer>> {
  const passwordKey = derivePasswordKey(details.password, details.email);
  const passwordHash = await deriveServerPasswordHash(
    details.password,
    passwordKey
  );
  const [encryptedAccountKey, accountKey] = await generateWrappedKey(
    passwordKey
  );
  const response: Response = await (
    await fetch(SERVER_ROUTES.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-google-captcha": captchaToken,
      },
      body: JSON.stringify({
        email: details.email,
        nickname: details.nickname,
        passwordHash: arrayBufferToString(passwordHash, "base64"),
        accountKey: arrayBufferToString(encryptedAccountKey, "base64"),
      }),
    })
  ).json();
  if (!response.success) {
    return response;
  }
  return {
    success: true,
    data: accountKey,
  };
}
