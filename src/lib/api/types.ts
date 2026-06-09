export type ListingCategory =
  | "academic"
  | "professional"
  | "competition"
  | "opportunity";

export type ExtracurricularType =
  | "Olympiad"
  | "Quiz"
  | "LocalFairs"
  | "Research"
  | "WritingCompetition"
  | "Debate"
  | "Internship"
  | "Mentorship"
  | "TechContest"
  | "Hackathon"
  | "Startup"
  | "FilmArt"
  | "ExchangeProgram"
  | "Conference"
  | "MUN";

export type CostOption = "Free" | "Paid" | "Stipend";

export type ListingsSort = "deadline" | "alpha" | "recent";

export type Listing = {
  id: string;
  title: string;
  org: string;
  location: string;
  region: string;
  description: string;
  image: string;
  category: ListingCategory;
  badge: string;
  footer: string;
  deadline?: string;
  type?: ExtracurricularType;
  cost?: CostOption;
  grades?: number[];
  tags?: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  avatar: string | null;
  order: number | null;
  createdAt: string;
  updatedAt: string;
};

export type SortOption = {
  value: ListingsSort;
  label: string;
};

export type Meta = {
  regions: string[];
  extracurricularTypes: string[];
  costOptions: string[];
  gradeOptions: number[];
  sortOptions: SortOption[];
};

export type ListMeta = {
  total: number;
  limit: number;
  offset: number;
};

export type ListResponse<T> = {
  data: T[];
  meta: ListMeta;
};

export type ItemResponse<T> = {
  data: T;
};

export type ListingsListParams = {
  category?: ListingCategory | "all";
  type?: ExtracurricularType;
  cost?: CostOption;
  grade?: number;
  region?: string;
  q?: string;
  sort?: ListingsSort;
  limit?: number;
  offset?: number;
};

export type NewsletterSubscribeResponse = {
  status: "pending" | "confirmed" | "unsubscribed";
};

// Contest backend types
export type ContestBackendData = {
  name: string;
  url: string;
  start: string;
};
