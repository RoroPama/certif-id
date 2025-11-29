/**
 * Server Component - Page liste des demandes
 */

import { generateMockHistory } from "../utils/mockData";
import RequestsPageClient from "./pageClient";

export default function RequestsPage() {
  // Chargement des données côté serveur
  const historyData = generateMockHistory();

  return <RequestsPageClient initialHistoryData={historyData} />;
}

