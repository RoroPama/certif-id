/**
 * Server Component - Page détail d'une entrée du registre
 */

import { cookies } from "next/headers";
import { governmentService } from "@/lib/services/government.service";
import { mapDocumentToRegistryEntry } from "../../utils/registryMapper";
import RegistryDetailPageClient from "./pageClient";
import { notFound } from "next/navigation";
import ErrorState from "@/app/(institution)/institution/components/ErrorState";
import { ApiClientError } from "@/lib/api/axios";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RegistryDetailPage({ params }: PageProps) {
  const { id } = await params;

  let entry;
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
    const document = await governmentService.getSignedDocumentById(id, cookieHeader);

    // Transformer le document en format RegistryEntry
    entry = mapDocumentToRegistryEntry(document);
  } catch (error) {
    // Si le document n'existe pas (404), afficher 404
    if (error instanceof ApiClientError && error.statusCode === 404) {
      notFound();
    }
    // Pour les autres erreurs, afficher le composant d'erreur
    console.error("Erreur lors du chargement de l'entrée du registre:", error);
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
        <ErrorState
          title="Erreur lors du chargement de l'entrée"
          message="Impossible de charger les détails de l'entrée du registre. Veuillez rafraîchir la page."
        />
      </div>
    );
  }

  return <RegistryDetailPageClient entry={entry} />;
}

