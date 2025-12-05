/**
 * Server Component - Page liste des demandes
 */

import { cookies } from "next/headers";
import { requestsService } from "@/lib/services/requests.service";
import { enrichDemande } from "../utils/requestUtils";
import RequestsPageClient from "./pageClient";
import ErrorState from "../components/ErrorState";

export default async function RequestsPage() {
  let historyData;
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

    const response = await requestsService.getAllRequests(
      {
        page: 1,
        limit: 100, // Récupérer toutes les demandes pour la pagination côté client
      },
      cookieHeader
    );

    // Enrichir chaque demande avec les champs calculés
    historyData = response.data.map((demande) => enrichDemande(demande));
  } catch (error: any) {
    // En cas d'erreur, afficher le composant d'erreur
    console.error("Erreur lors du chargement des demandes:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inattendue s'est produite";
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <ErrorState
          title="Erreur lors du chargement des demandes"
          message={`${errorMessage}. Veuillez vérifier votre connexion et réessayer.`}
        />
      </div>
    );
  }

  return <RequestsPageClient initialHistoryData={historyData} />;
}

