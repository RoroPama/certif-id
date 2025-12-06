/**
 * Server Component - Page registre des documents signés
 */

import { cookies } from "next/headers";
import { governmentService } from "@/lib/services/government.service";
import { mapDocumentsToRegistryEntries } from "../utils/registryMapper";
import RegistryPageClient from "./pageClient";
import ErrorState from "@/app/(institution)/institution/components/ErrorState";
import { ApiClientError } from "@/lib/api/axios";
import type { RegistryEntry } from "../types";

export default async function RegistryPage() {
  let registryData: RegistryEntry[] = [];
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Récupération des données réelles
    const documents = await governmentService.getAllDocuments(cookieHeader);
    registryData = mapDocumentsToRegistryEntries(documents);
  } catch (error: unknown) {
    console.error("Erreur lors du chargement du registre:", error);

    // Fallback silencieux ou gestion d'erreur propre pour l'UI "Pro"
    if (error instanceof ApiClientError && error.statusCode !== 404) {
      return (
        <div className="p-8">
          <ErrorState
            title="Service Indisponible"
            message="L'accès aux archives est momentanément limité. Veuillez contacter le support technique."
          />
        </div>
      );
    }
    // Si c'est juste vide ou 404, on passe un tableau vide
    registryData = [];
  }

  return <RegistryPageClient initialRegistryData={registryData || []} />;
}
