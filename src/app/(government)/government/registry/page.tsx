/**
 * Server Component - Page registre des documents signés
 */

import { cookies } from "next/headers";
import { governmentService } from "@/lib/services/government.service";
import { mapDocumentsToRegistryEntries } from "../utils/registryMapper";
import RegistryPageClient from "./pageClient";
import ErrorState from "@/app/(institution)/institution/components/ErrorState";

export default async function RegistryPage() {
  let registryData;
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

    // Récupérer tous les documents signés
    const documents = await governmentService.getAllDocuments(cookieHeader);

    // Transformer les documents en format RegistryEntry
    registryData = mapDocumentsToRegistryEntries(documents);
  } catch (error: any) {
    // En cas d'erreur, afficher le composant d'erreur
    console.error("Erreur lors du chargement du registre:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inattendue s'est produite";
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <ErrorState
          title="Erreur lors du chargement du registre"
          message={`${errorMessage}. Veuillez vérifier votre connexion et réessayer.`}
        />
      </div>
    );
  }

  return <RegistryPageClient initialRegistryData={registryData} />;
}

