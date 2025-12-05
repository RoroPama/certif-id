/**
 * Server Component - Page détail d'un diplôme
 */

import { cookies } from "next/headers";
import { registryService } from "@/lib/services/registry.service";
import { transformDocumentToDiploma } from "../../utils/registryUtils";
import DiplomaDetailPageClient from "./pageClient";
import { notFound } from "next/navigation";
import ErrorState from "../../components/ErrorState";
import { ApiClientError } from "@/lib/api/axios";

interface DiplomaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DiplomaDetailPage({
  params,
}: DiplomaDetailPageProps) {
  const { id } = await params;

  let diploma;
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

    // Récupérer le document signé par son ID
    const document = await registryService.getDocumentById(id, cookieHeader);

    // Transformer le document en format ApprovedDiploma
    diploma = transformDocumentToDiploma(document);
  } catch (error) {
    // Si le document n'existe pas (404), afficher 404
    if (error instanceof ApiClientError && error.statusCode === 404) {
      notFound();
    }
    // Pour les autres erreurs, afficher le composant d'erreur
    console.error("Erreur lors du chargement du diplôme:", error);
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <ErrorState
          title="Erreur lors du chargement du diplôme"
          message="Impossible de charger les détails du diplôme. Veuillez rafraîchir la page."
        />
      </div>
    );
  }

  return <DiplomaDetailPageClient diploma={diploma} />;
}

