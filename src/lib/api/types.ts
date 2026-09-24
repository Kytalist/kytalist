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
  descriptionEnabled?: boolean;
  image: string;
  bannerImage?: string;
  bannerEnabled?: boolean;
  eventUrl?: string;
  category: ListingCategory;
  deadline?: string;
  types?: ExtracurricularType[];
  cost?: CostOption;
  grades?: string[];
  featured?: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  avatar: string | null;
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
  gradeOptions: string[];
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
  grade?: string;
  region?: string;
  q?: string;
  sort?: ListingsSort;
  past?: boolean;
  limit?: number;
  offset?: number;
};

export type NewsletterSubscribeResponse = {
  status: "pending" | "confirmed" | "unsubscribed";
};
