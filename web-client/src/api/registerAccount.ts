import { ServerRoutes } from "../const";
import {
  derivePasswordKey,
  deriveServerPasswordHash,
  generateWrappedKey
} from "../crypto/password";
import { arrayBufferToString } from "../crypto/utils";
import { AccountSignupDetails } from "../types/Account";
import { Response } from "../types/API";
import { jsonFetch } from "./helpers";

/**
 * Send an API request to register a new account.
 *
 * @param details Account details (email, password, nickname)
 * @returns ({ success: true, data: undefined })
 */
export async function registerAccount(details: AccountSignupDetails): Promise<Response> {
  const passwordKey = derivePasswordKey(details.password, details.email);
  const passwordHash = await deriveServerPasswordHash(details.password, passwordKey);
  const accountKey = await generateWrappedKey(passwordKey);

  return await jsonFetch(ServerRoutes.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: details.email,
      nickname: details.nickname,
      password_hash: arrayBufferToString(passwordHash, "hex"),
      account_key: arrayBufferToString(accountKey, "hex"),
    })
  });
}