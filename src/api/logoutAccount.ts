import { SERVER_ROUTES } from "../const";
import { jsonFetch } from "./helpers";

export async function logoutAccount(): Promise<null> {
  return await jsonFetch<null>(SERVER_ROUTES.logout, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
