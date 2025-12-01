import { redirect } from "next/navigation";
import { GOVERNMENT_ROUTES } from "@/lib/utils/constants";

export default function GovernmentPage() {
  redirect(GOVERNMENT_ROUTES.OVERVIEW);
}

