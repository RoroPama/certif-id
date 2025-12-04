/**
 * Server Component - Page nouvelle demande
 */

import { cookies } from "next/headers";
import { documentsService } from "@/lib/services/documents.service";
import NewRequestPageClient from "./pageClient";
import ErrorState from "../components/ErrorState";
import type { Filiere } from "../types";

export default async function NewRequestPage() {
  let documentTypes;
  let filieres: Filiere[] = [];

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

    // Récupérer les types de documents autorisés
    documentTypes = await documentsService.getAuthorizedTypes(cookieHeader);

    // Transformer les types de documents en filières/diplômes pour l'affichage
    // Note: Cette transformation est temporaire - idéalement, le formulaire devrait utiliser directement les types de documents
    // Pour l'instant, on crée une structure similaire aux mocks
    if (documentTypes && documentTypes.length > 0) {
      // Grouper par nom similaire ou créer une filière par type
      filieres = [
        {
          id: "doc-types",
          name: "Types de documents disponibles",
          diplomas: documentTypes.map((dt) => ({
            id: dt.id, // Utiliser l'UUID du type de document
            name: dt.nom,
          })),
        },
      ];
    } else {
      // Si aucun type de document n'est disponible, afficher une erreur
      return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
          <ErrorState
            title="Aucun type de document disponible"
            message="Impossible de charger les types de documents autorisés. Veuillez vérifier votre connexion et réessayer."
          />
        </div>
      );
    }
  } catch (error: any) {
    // En cas d'erreur, afficher un message d'erreur au lieu d'utiliser les mocks
    console.error("Erreur lors du chargement des types de documents:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inattendue s'est produite";
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <ErrorState
          title="Erreur lors du chargement des types de documents"
          message={`${errorMessage}. Veuillez vérifier votre connexion et réessayer.`}
        />
      </div>
    );
  }

  return (
    <NewRequestPageClient initialFilieres={filieres} foundationYear={2010} />
  );
}

