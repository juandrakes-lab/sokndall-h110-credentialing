import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";

// Where Sokndall opens (pedido 2026-11-16, punto 1): an account that holds two
// clients or more — every demo included — starts on the view across all of
// them; everyone else on the dashboard. Login, the auth callback, "/" for a
// signed-in visitor and the demo link all land here.
export default async function Home() {
  const { org, multiClient, clients } = await getAppContext();
  if (!org) redirect("/start");
  redirect(multiClient && clients.length > 1 ? "/clients" : "/dashboard");
}
