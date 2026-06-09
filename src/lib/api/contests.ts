import { contestApiGet } from "./client";
import type { ListResponse, Listing, ContestBackendData } from "./types";

/**
 * Transform contest backend data to Listing format
 */
function transformContestToListing(
  contest: ContestBackendData,
  index: number,
): Listing {
  const startDate = new Date(contest.start);
  const deadline = startDate.toISOString().split("T")[0]; // YYYY-MM-DD format

  return {
    id: `contest-${index}-${contest.name.replace(/\s+/g, "-").toLowerCase()}`,
    title: contest.name,
    org: "Programming Contest",
    location: "Online",
    region: "Online",
    description: `Programming competition: ${contest.name}`,
    image: "/images/placeholder.svg",
    category: "competition",
    badge: "Competition",
    footer: `Start: ${deadline}`,
    deadline: deadline,
    type: "TechContest",
    cost: "Free",
    grades: [9, 10, 11, 12],
    tags: ["Programming", "Competition", "STEM"],
  };
}

/**
 * Fetch contests/competitions from the contest backend API
 */
export async function getContests(
  params: {
    limit?: number;
    offset?: number;
    q?: string;
  } = {},
): Promise<ListResponse<Listing>> {
  const limit = params.limit ?? 50;
  const offset = params.offset ?? 0;
  const query = params.q?.toLowerCase() || "";

  // Fetch all contests from the backend
  const contests = await contestApiGet<ContestBackendData[]>("");

  // Filter by search query if provided
  let filtered = contests;
  if (query) {
    filtered = contests.filter((c) => c.name.toLowerCase().includes(query));
  }

  // Apply pagination
  const paginated = filtered.slice(offset, offset + limit);

  // Transform to Listing format
  const listings = paginated.map((contest, idx) =>
    transformContestToListing(contest, offset + idx),
  );

  return {
    data: listings,
    meta: {
      total: filtered.length,
      limit,
      offset,
    },
  };
}

/**
 * Fetch a single contest by ID
 */
export async function getContest(id: string): Promise<Listing> {
  const contests = await contestApiGet<ContestBackendData[]>("");
  const contest = contests.find((c) =>
    id.includes(c.name.replace(/\s+/g, "-").toLowerCase()),
  );

  if (!contest) {
    throw new Error(`Contest not found: ${id}`);
  }

  return transformContestToListing(contest, 0);
}
