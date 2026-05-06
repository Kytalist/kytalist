import { apiGet } from "./client";
import type { ItemResponse, Testimonial } from "./types";

export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await apiGet<ItemResponse<Testimonial[]>>("/testimonials");
  return res.data;
}
