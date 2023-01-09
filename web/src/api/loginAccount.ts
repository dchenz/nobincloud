import { Buffer } from "buffer";
import { ServerRoutes } from "../const";
import { decrypt } from "../crypto/cipher";
import {
  derivePasswordKey,
  deriveServerPasswordHash,
} from "../crypto/password";
import { arrayBufferToString } from "../crypto/utils";
import { AccountLoginDetails } from "../types/Account";
import { Response, SuccessfulLoginResponse } from "../types/API";
import { jsonFetch } from "./helpers";

/**
 * Send an API request to authenticate a login request.
 *
 * @param details Account details (email, password)
 * @returns Account key and decrypted AES data key
 */
export async function loginAccount(
  details: AccountLoginDetails
): Promise<ArrayBuffer | null> {
  const passwordKey = derivePasswordKey(details.password, details.email);
  const passwordHash = await deriveServerPasswordHash(
    details.password,
    passwordKey
  );

  const response: Response<SuccessfulLoginResponse> = await (
    await fetch(ServerRoutes.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: details.email,
        passwordHash: arrayBufferToString(passwordHash, "base64"),
      }),
    })
  ).json();

  if (!response.success) {
    return null;
  }

  const accountKey = Buffer.from(response.data.accountKey, "base64");

  const decryptedAccountKey = await decrypt(accountKey, passwordKey);
  if (!decryptedAccountKey) {
    throw new Error("could not retrieve account key");
  }

  return decryptedAccountKey;
}

export async function unlockAccount(
  password: string
): Promise<ArrayBuffer | null> {
  const emailResponse = await jsonFetch<string>(ServerRoutes.whoami);
  const passwordKey = derivePasswordKey(password, emailResponse);
  const passwordHash = await deriveServerPasswordHash(password, passwordKey);
  const response = await jsonFetch<SuccessfulLoginResponse>(
    ServerRoutes.unlock,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        passwordHash: arrayBufferToString(passwordHash, "base64"),
      }),
    }
  );

  const accountKey = Buffer.from(response.accountKey, "base64");

  const decryptedAccountKey = await decrypt(accountKey, passwordKey);
  if (!decryptedAccountKey) {
    throw new Error("could not retrieve account key");
  }

  return decryptedAccountKey;
}
