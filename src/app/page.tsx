import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/utils/constants";

export default function Home() {
  redirect(AUTH_ROUTES.LOGIN);
}
