/**
 * Server Component - Page registre des diplômes
 */

import { generateMockRegistry } from "../utils/mockData";
import RegistryPageClient from "./pageClient";

export default function RegistryPage() {
  // Chargement des données côté serveur
  const registryData = generateMockRegistry();

  return <RegistryPageClient initialRegistryData={registryData} />;
}

