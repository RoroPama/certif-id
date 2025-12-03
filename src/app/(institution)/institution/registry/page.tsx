/**
 * Server Component - Page registre des diplômes
 */

import { cookies } from "next/headers";
import { registryService } from "@/lib/services/registry.service";
import { transformDocumentsToDiplomas } from "../utils/registryUtils";
import RegistryPageClient from "./pageClient";
import ErrorState from "../components/ErrorState";

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
    const documents = await registryService.getAllDocuments(cookieHeader);

    // Transformer les documents en format ApprovedDiploma
    registryData = transformDocumentsToDiplomas(documents);
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

