import { apiPost } from "./client";
import type { ItemResponse } from "./types";

export type WaitlistJoinResponse = {
  status: "joined" | "already-joined";
};

export async function joinWaitlist(
  email: string,
): Promise<WaitlistJoinResponse> {
  const res = await apiPost<ItemResponse<WaitlistJoinResponse>>(
    "/waitlist/join",
    { email },
  );
  return res.data;
}
