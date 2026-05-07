import { use } from "react";
import { ListingForm } from "@/components/admin/ListingForm";

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ListingForm listingId={id} />;
}
