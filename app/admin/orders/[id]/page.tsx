import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { OrderReview } from "@/components/admin/order-review";

export default async function OrderReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!order) notFound();

  // Get screenshot URL
  let screenshotUrl: string | null = null;
  if (order.screenshot_url) {
    const { data } = await supabaseAdmin.storage
      .from("payment-screenshots")
      .createSignedUrl(order.screenshot_url, 3600);
    screenshotUrl = data?.signedUrl || null;
  }

  return <OrderReview order={order} screenshotUrl={screenshotUrl} />;
}