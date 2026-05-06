import { apiPost } from "./client";
import type { ItemResponse, NewsletterSubscribeResponse } from "./types";

export async function subscribeNewsletter(
  email: string,
): Promise<NewsletterSubscribeResponse> {
  const res = await apiPost<ItemResponse<NewsletterSubscribeResponse>>(
    "/newsletter/subscribe",
    { email },
  );
  return res.data;
}
