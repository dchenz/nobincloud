import { Buffer } from "buffer";
import { ServerRoutes } from "../const";
import {
  derivePasswordKey,
  deriveServerPasswordHash,
} from "../crypto/password";
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
export async function loginAccount(
  details: AccountLoginDetails
): Promise<Response<SuccessfulLoginResult>> {
  const passwordKey = derivePasswordKey(details.password, details.email);
  const passwordHash = await deriveServerPasswordHash(
    details.password,
    passwordKey
  );

  const response = await jsonFetch(ServerRoutes.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: details.email,
      passwordHash: arrayBufferToString(passwordHash, "base64"),
    }),
  });
  if (response.success) {
    response.data.accountKey = Buffer.from(response.data.accountKey, "base64");
    response.data.passwordKey = passwordKey;
  }
  return response;
}

export async function unlockAccount(
  password: string
): Promise<Response<SuccessfulLoginResult>> {
  const emailResponse: Response<string> = await jsonFetch(ServerRoutes.whoami);
  if (!emailResponse.success) {
    throw new Error(emailResponse.data);
  }
  const passwordKey = derivePasswordKey(password, emailResponse.data);
  const passwordHash = await deriveServerPasswordHash(password, passwordKey);
  const response = await jsonFetch(ServerRoutes.unlock, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      passwordHash: arrayBufferToString(passwordHash, "base64"),
    }),
  });
  if (response.success) {
    response.data.accountKey = Buffer.from(response.data.accountKey, "base64");
    response.data.passwordKey = passwordKey;
  }
  return response;
}
