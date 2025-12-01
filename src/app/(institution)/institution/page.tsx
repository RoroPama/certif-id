/**
 * Redirection vers la page Overview
 */

import { redirect } from "next/navigation";

export default function InstitutionPage() {
  redirect("/institution/overview");
}
