import { apiGet } from "./client";
import type {
  ItemResponse,
  Listing,
  ListResponse,
  ListingsListParams,
} from "./types";

export async function getListings(
  params: ListingsListParams = {},
): Promise<ListResponse<Listing>> {
  return apiGet<ListResponse<Listing>>("/listings", {
    searchParams: {
      category: params.category,
      type: params.type,
      cost: params.cost,
      grade: params.grade,
      region: params.region,
      q: params.q,
      sort: params.sort,
      limit: params.limit,
      offset: params.offset,
    },
  });
}

export async function getListing(id: string): Promise<Listing> {
  const res = await apiGet<ItemResponse<Listing>>(
    `/listings/${encodeURIComponent(id)}`,
  );
  return res.data;
}

export async function getFeatured(): Promise<Listing[]> {
  const res = await apiGet<ItemResponse<Listing[]>>("/listings/featured");
  return res.data;
}

export async function getTrending(): Promise<Listing[]> {
  const res = await apiGet<ItemResponse<Listing[]>>("/listings/trending");
  return res.data;
}
