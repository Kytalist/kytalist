import type { Listing } from "@/lib/api/types";

export type AdminListing = Listing & {
  status: "draft" | "published" | "archived";
  deadlineAt: string | null;
  featuredOrder: number | null;
  trendingOrder: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string | null;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminStats = {
  listings: {
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    total: number;
  };
  users: {
    byRole: Record<string, number>;
    total: number;
  };
};

export type TestimonialAdmin = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  avatar: string | null;
  published: boolean;
  order: number | null;
  createdAt: string;
  updatedAt: string;
};

export type SubscriberRow = {
  id: string;
  email: string;
  status: string;
  confirmedAt: string | null;
  createdAt: string;
};

export type AuditLogRow = {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  before: unknown;
  after: unknown;
  createdAt: string;
};

export type ListEnvelope<T> = {
  data: T[];
  meta: { total: number; limit: number; offset: number };
};

export type ItemEnvelope<T> = { data: T };

export type SignedUpload = {
  path: string;
  uploadUrl: string;
  publicUrl: string;
  token: string;
};
