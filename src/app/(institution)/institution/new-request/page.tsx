/**
 * Server Component - Page nouvelle demande
 */

import { cookies } from "next/headers";
import { documentsService } from "@/lib/services/documents.service";
import NewRequestPageClient from "./pageClient";
import ErrorState from "../components/ErrorState";
import { generateMockFilieres } from "../utils/mockData";

export default async function NewRequestPage() {
  let documentTypes;
  let filieres = generateMockFilieres(); // Fallback vers mock si erreur

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
            id: dt.id,
            name: dt.nom,
          })),
        },
      ];
    }
  } catch (error: any) {
    // En cas d'erreur, utiliser les mocks et afficher un avertissement
    console.error("Erreur lors du chargement des types de documents:", error);
    // On continue avec les mocks pour ne pas bloquer l'utilisateur
  }

  return (
    <NewRequestPageClient initialFilieres={filieres} foundationYear={2010} />
  );
}

