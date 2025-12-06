/**
 * Server Component - Page nouvelle demande
 */

import { cookies } from "next/headers";
import {
  documentsService,
  type DocumentTypeEntity,
} from "@/lib/services/documents.service";
import NewRequestPageClient from "./pageClient";
import ErrorState from "../components/ErrorState";
import type { DiplomeWithParcours } from "../types";

export default async function NewRequestPage() {
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

  let diplomes: DiplomeWithParcours[] = [];
  let errorState: { title: string; message: string } | null = null;

  try {
    // Récupérer les types de documents autorisés pour l'établissement
    const documentTypesData = await documentsService.getAuthorizedTypes(
      cookieHeader
    );

    console.log("[NewRequestPage] Diplômes autorisés:", documentTypesData);

    // Pour chaque diplôme, récupérer les parcours associés
    const diplomesWithParcours = await Promise.all(
      documentTypesData.map(async (diplome) => {
        try {
          const parcours = await documentsService.getParcoursByDocumentType(
            diplome.id,
            cookieHeader
          );
          return {
            id: diplome.id,
            name: diplome.nom,
            parcours: parcours.map((p) => ({
              id: p.id,
              name: p.nom,
              duree: p.duree,
            })),
          };
        } catch (error) {
          // Si le diplôme n'a pas de parcours (ex: BEPC), retourner un tableau vide
          console.log(
            `[NewRequestPage] Aucun parcours pour le diplôme ${diplome.nom}`
          );
          return {
            id: diplome.id,
            name: diplome.nom,
            parcours: [],
          };
        }
      })
    );

    diplomes = diplomesWithParcours;

    console.log("[NewRequestPage] Diplômes avec parcours:", diplomes);

    if (diplomes.length === 0) {
      // Si aucun type de document n'est disponible
      errorState = {
        title: "Aucun type de document disponible",
        message:
          "Aucun diplôme n'est autorisé pour votre établissement. Veuillez contacter l'administration.",
      };
    }
  } catch (error: unknown) {
    // En cas d'erreur
    console.error("Erreur lors du chargement des types de documents:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inattendue s'est produite";
    errorState = {
      title: "Erreur lors du chargement des types de documents",
      message: `${errorMessage}. Veuillez vérifier votre connexion et réessayer.`,
    };
  }

  // Afficher l'erreur si nécessaire
  if (errorState) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <ErrorState title={errorState.title} message={errorState.message} />
      </div>
    );
  }

  return (
    <NewRequestPageClient initialDiplomes={diplomes} foundationYear={2010} />
  );
}

