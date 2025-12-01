/**
 * Redirection vers la page Overview
 */

import { redirect } from "next/navigation";
import { INSTITUTION_ROUTES } from "@/lib/utils/constants";

export default function InstitutionPage() {
  redirect(INSTITUTION_ROUTES.OVERVIEW);
}
