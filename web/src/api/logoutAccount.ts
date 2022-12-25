import { ServerRoutes } from "../const";
import { Response } from "../types/API";
import { jsonFetch } from "./helpers";

export async function logoutAccount(): Promise<Response> {
  return await jsonFetch(ServerRoutes.logout, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });
}