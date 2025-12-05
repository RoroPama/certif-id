/**
 * Server Component - Page détail d'une demande
 */

import { cookies } from "next/headers";
import { requestsService } from "@/lib/services/requests.service";
import { enrichDemande } from "../../utils/requestUtils";
import RequestDetailPageClient from "./pageClient";
import ErrorState from "../../components/ErrorState";
import { ApiClientError } from "@/lib/api/axios";
import { notFound } from "next/navigation";

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({
  params,
}: RequestDetailPageProps) {
  const { id } = await params;

  let request;
  try {
    // Récupérer les cookies pour l'authentification
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Vérifier si le token est présent dans les cookies
    const authCookie = cookieStore.get("auth_token");
    if (!authCookie) {
      console.warn(
        "Token d'authentification non trouvé dans les cookies. L'utilisateur doit se reconnecter."
      );
    }

    // Chargement de la demande depuis le backend
    const demande = await requestsService.getRequestById(id, cookieHeader);

    // Enrichir la demande avec les champs calculés
    request = enrichDemande(demande);
  } catch (error) {
    // Si la demande n'existe pas (404), afficher 404
    if (error instanceof ApiClientError && error.statusCode === 404) {
      notFound();
    }
    // Pour les autres erreurs, afficher le composant d'erreur
    console.error("Erreur lors du chargement de la demande:", error);
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <ErrorState
          title="Erreur lors du chargement de la demande"
          message="Impossible de charger les détails de la demande. Veuillez rafraîchir la page."
        />
      </div>
    );
  }

  return <RequestDetailPageClient request={request} />;
}
