/**
 * Server Component - Page nouvelle demande
 */

import { cookies } from "next/headers";
import { documentsService } from "@/lib/services/documents.service";
import { configService } from "@/lib/services/config.service";
import NewRequestPageClient from "./pageClient";
import ErrorState from "../components/ErrorState";
import type { Filiere } from "../types";

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

  let documentTypes;
  let filieres: Filiere[] = [];
  let errorState: { title: string; message: string } | null = null;

  try {
    // Récupérer les types de documents autorisés pour cet établissement
    documentTypes = await documentsService.getAuthorizedTypes(cookieHeader);

    // Récupérer toutes les filières et diplômes configurés dans la plateforme
    const [allFilieres, allDiplomes] = await Promise.all([
      configService.getAllFilieres(cookieHeader),
      configService.getAllDocumentTypes(cookieHeader),
    ]);

    // Filtrer les diplômes autorisés pour cet établissement
    const authorizedDiplomeIds = new Set(documentTypes.map((dt) => dt.id));
    const authorizedDiplomes = allDiplomes.filter((d) =>
      authorizedDiplomeIds.has(d.id)
    );

    // Grouper les diplômes autorisés par filière
    if (authorizedDiplomes.length > 0) {
      // Créer un map des diplômes par filière
      const diplomesByFiliere = new Map<string, typeof authorizedDiplomes>();

      // Ajouter les diplômes avec filière
      authorizedDiplomes.forEach((diplome) => {
        if (diplome.filiereId) {
          if (!diplomesByFiliere.has(diplome.filiereId)) {
            diplomesByFiliere.set(diplome.filiereId, []);
          }
          diplomesByFiliere.get(diplome.filiereId)!.push(diplome);
        }
      });

      // Créer les filières avec leurs diplômes
      filieres = allFilieres
        .filter((f) => f.actif && diplomesByFiliere.has(f.id))
        .map((f) => ({
          id: f.id,
          name: f.nom,
          diplomas: diplomesByFiliere.get(f.id)!.map((d) => ({
            id: d.id,
            name: d.nom,
          })),
        }));

      // Ajouter les diplômes sans filière dans une catégorie "Autres"
      const diplomesSansFiliere = authorizedDiplomes.filter(
        (d) => !d.filiereId
      );
      if (diplomesSansFiliere.length > 0) {
        filieres.push({
          id: "autres",
          name: "Autres diplômes",
          diplomas: diplomesSansFiliere.map((d) => ({
            id: d.id,
            name: d.nom,
          })),
        });
      }
    } else {
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
    <NewRequestPageClient initialFilieres={filieres} foundationYear={2010} />
  );
}

