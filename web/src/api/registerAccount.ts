import { ServerRoutes } from "../const";
import {
  derivePasswordKey,
  deriveServerPasswordHash,
  generateWrappedKey,
} from "../crypto/password";
import { arrayBufferToString } from "../crypto/utils";
import { AccountSignupDetails, SuccessfulSignupResult } from "../types/Account";
import { Response } from "../types/API";
import { jsonFetch } from "./helpers";

/**
 * Send an API request to register a new account.
 *
 * @param details Account details (email, password, nickname)
 * @returns ({ success: true, data: undefined })
 */
export async function registerAccount(
  details: AccountSignupDetails
): Promise<Response<SuccessfulSignupResult>> {
  const passwordKey = derivePasswordKey(details.password, details.email);
  const passwordHash = await deriveServerPasswordHash(
    details.password,
    passwordKey
  );
  const [encryptedAccountKey, accountKey] = await generateWrappedKey(
    passwordKey
  );

  const response = await jsonFetch(ServerRoutes.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: details.email,
      nickname: details.nickname,
      passwordHash: arrayBufferToString(passwordHash, "base64"),
      accountKey: arrayBufferToString(encryptedAccountKey, "base64"),
    }),
  });
  if (response.success) {
    response.data = { accountKey };
  }
  return response;
}
