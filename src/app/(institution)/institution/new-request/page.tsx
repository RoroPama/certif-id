/**
 * Server Component - Page nouvelle demande
 */

import NewRequestPageClient from "./pageClient";
import { generateMockFilieres } from "../utils/mockData";

export default function NewRequestPage() {
  const filieres = generateMockFilieres();

  return (
    <NewRequestPageClient
      initialFilieres={filieres}
      foundationYear={2010}
    />
  );
}

