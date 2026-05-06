import { apiGet } from "./client";
import type { ItemResponse, Meta } from "./types";

export async function getMeta(): Promise<Meta> {
  const res = await apiGet<ItemResponse<Meta>>("/meta");
  return res.data;
}

export async function getMetaCounts(): Promise<Record<string, number>> {
  const res = await apiGet<ItemResponse<Record<string, number>>>(
    "/meta/counts",
  );
  return res.data;
}
