import { Buffer } from "buffer";
import { derivePasswordKey, deriveServerPasswordHash } from "../crypto/password";
import { arrayBufferToString } from "../crypto/utils";
import { AccountLoginDetails, SuccessfulLoginResult } from "../types/Account";
import { Response } from "../types/API";
import { jsonFetch } from "./helpers";

/**
 * Send an API request to authenticate a login request.
 *
 * @param details Account details (email, password)
 * @returns Account key and decrypted AES data key
 */
export async function loginAccount(details: AccountLoginDetails):
  Promise<Response<SuccessfulLoginResult>> {
  const passwordKey = derivePasswordKey(details.password, details.email);
  const passwordHash = await deriveServerPasswordHash(details.password, passwordKey);

  const response = await jsonFetch("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: details.email,
      password_hash: arrayBufferToString(passwordHash, "hex"),
    })
  });
  if (response.success) {
    response.data.accountKey = Buffer.from(response.data.account_key, "hex");
    delete response.data.account_key;
  }
  return response;
}
