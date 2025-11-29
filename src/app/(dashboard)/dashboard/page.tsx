/**
 * Redirection vers la page Overview
 */

import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/dashboard/overview");
}
