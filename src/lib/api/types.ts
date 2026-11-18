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
  /** Optional organizer logo shown on event cards. */
  orgLogo?: string;
  location: string;
  region: string;
  /** Full markdown body — only returned by the listing detail endpoint. */
  description?: string;
  /** Short plain-text excerpt — returned by list/featured/trending for cards. */
  summary?: string;
  descriptionEnabled?: boolean;
  image: string;
  bannerImage?: string;
  bannerEnabled?: boolean;
  eventUrl?: string;
  category: ListingCategory;
  deadline?: string;
  /** When the event takes place (ISO). Date-only values are UTC midnight. */
  eventStartAt?: string;
  /** When the event ends; equals/omits the start for single-day events. */
  eventEndAt?: string;
  /** Whether the detail page shows a day-by-day checkpoint while running. */
  eventProgressEnabled?: boolean;
  /** Admin-selected checkpoint dates (for events longer than 5 days). */
  eventCheckpointDates?: string[];
  /** False (default) means every day in the range is a checkpoint. */
  eventCheckpointsCustomized?: boolean;
  /** Checkpoint dates hidden from the event page. */
  eventCheckpointHiddenDates?: string[];
  /** Optional checkpoint titles keyed by YYYY-MM-DD. */
  eventDayTitles?: Record<string, string>;
  types?: ExtracurricularType[];
  cost?: CostOption;
  grades?: string[];
  featured?: boolean;
  international?: boolean;
  viewCount?: number;
  clickCount?: number;
  saveCount?: number;
  applicationCount?: number;
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
  type?: ExtracurricularType | ExtracurricularType[] | string;
  cost?: CostOption | CostOption[] | string;
  grade?: string | string[];
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
