import { Buffer } from "buffer";
import { deriveMasterKey, deriveServerPasswordHash } from "../crypto/password";
import { arrayBufferToString } from "../crypto/utils";
import { AccountLoginDetails, LoggedInSetup } from "../types/Account";
import { Response } from "../types/API";
import { jsonFetch } from "./helpers";

/**
 * Send an API request to authenticate a login request.
 *
 * @param details Account details (email, password)
 * @returns Master key and decrypted AES data key
 */
export async function loginAccount(details: AccountLoginDetails): Promise<Response<LoggedInSetup>> {
  const mainAccountKey = deriveMasterKey(details.password, details.email);
  const passwordHash = await deriveServerPasswordHash(details.password, mainAccountKey);

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
    response.data.wrappedKey = Buffer.from(response.data.wrapped_key, "hex");
    delete response.data.wrapped_key;
    response.data.masterKey = mainAccountKey;
  }
  return response;
}
