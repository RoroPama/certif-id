/**
 * Server Component - Page détails d'un document
 */

import { cookies } from "next/headers";
import { requestsService } from "@/lib/services/requests.service";
import RequestDetailsPageClient from "./pageClient";
import ErrorState from "../../../components/ErrorState";
import { ApiClientError } from "@/lib/api/axios";
import { notFound } from "next/navigation";

interface RequestDetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ documentId?: string }>;
}

export default async function RequestDetailsPage({
  params,
  searchParams,
}: RequestDetailsPageProps) {
  const { id } = await params;
  const { documentId } = await searchParams;

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

    // Si documentId est fourni, utiliser le nouvel endpoint pour récupérer les détails complets
    if (documentId) {
      documentDetail = await requestsService.getDocumentById(
        id,
        documentId,
        cookieHeader
      );
    } else {
      // Fallback: utiliser l'ancienne méthode si documentId n'est pas fourni
      const demande = await requestsService.getRequestById(id, cookieHeader);
      // Prendre le premier document par défaut
      if (demande.documents && demande.documents.length > 0) {
        // Convertir en format DocumentDetail pour compatibilité
        const firstDoc = demande.documents[0];
        const date = new Date(demande.createdAt);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const reference = `BORD-${year}-${month}${day}-${demande.id
          .substring(0, 4)
          .toUpperCase()}`;

        documentDetail = {
          ...firstDoc,
          demandeId: demande.id,
          demande: {
            id: demande.id,
            reference,
            statut: demande.statut,
            note: demande.note,
            createdAt: demande.createdAt,
            updatedAt: demande.updatedAt,
            etablissement: demande.etablissement,
          },
        };
      } else {
        throw new Error("Aucun document trouvé dans cette demande");
      }
    }
  } catch (error) {
    // Si la demande ou le document n'existe pas (404), afficher 404
    if (error instanceof ApiClientError && error.statusCode === 404) {
      notFound();
    }
    // Pour les autres erreurs, afficher le composant d'erreur
    console.error("Erreur lors du chargement du document:", error);
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <ErrorState
          title="Erreur lors du chargement du document"
          message="Impossible de charger les détails du document. Veuillez rafraîchir la page."
        />
      </div>
    );
  }

  return <RequestDetailsPageClient documentDetail={documentDetail} />;
}
