/**
 * Server Component - Page détails d'un document (gouvernement)
 */

import { cookies } from "next/headers";
import { governmentService } from "@/lib/services/government.service";
import DocumentDetailPageClient from "./pageClient";
import { ApiClientError } from "@/lib/api/axios";
import { notFound } from "next/navigation";
import ErrorState from "@/app/(institution)/institution/components/ErrorState";

interface DocumentDetailPageProps {
  params: Promise<{ id: string; documentId: string }>;
}

export default async function DocumentDetailPage({
  params,
}: DocumentDetailPageProps) {
  const resolvedParams = await params;
  const demandeId = resolvedParams.id;
  const documentId = resolvedParams.documentId;

  // Vérifier que les paramètres sont présents
  if (!demandeId || !documentId) {
    console.error("Paramètres manquants:", {
      demandeId,
      documentId,
      resolvedParams,
    });
    notFound();
  }

  let documentDetail;
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

    // Récupérer les détails du document
    console.log("Appel getDocumentById avec:", { demandeId, documentId });
    const endpoint = `/ministere/demandes/${demandeId}/documents/${documentId}`;
    console.log("Endpoint attendu:", endpoint);
    documentDetail = await governmentService.getDocumentById(
      demandeId,
      documentId,
      cookieHeader
    );
  } catch (error) {
    // Log détaillé de l'erreur
    console.error("Erreur lors du chargement du document:", error);
    console.error(
      "Erreur type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "Erreur message:",
      error instanceof Error ? error.message : String(error)
    );

    if (error instanceof ApiClientError) {
      console.error(
        "ApiClientError - statusCode:",
        error.statusCode,
        "message:",
        error.message
      );
      // Si le document n'existe pas (404), afficher 404
      if (error.statusCode === 404) {
        notFound();
      }
    }

    // Pour les autres erreurs, afficher le composant d'erreur
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <ErrorState
          title="Erreur lors du chargement du document"
          message={
            error instanceof ApiClientError
              ? `Erreur ${error.statusCode}: ${error.message}`
              : "Impossible de charger les détails du document. Veuillez rafraîchir la page."
          }
        />
      </div>
    );
  }

  return (
    <DocumentDetailPageClient
      documentDetail={documentDetail}
      demandeId={demandeId}
    />
  );
}
