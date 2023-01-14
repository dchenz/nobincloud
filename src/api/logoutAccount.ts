import { ServerRoutes } from "../const";
import { jsonFetch } from "./helpers";

export async function logoutAccount(): Promise<null> {
  return await jsonFetch<null>(ServerRoutes.logout, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
