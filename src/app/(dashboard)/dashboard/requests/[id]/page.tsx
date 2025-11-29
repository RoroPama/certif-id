/**
 * Server Component - Page détail d'une demande
 */

import { generateMockHistory } from "../../utils/mockData";
import RequestDetailPageClient from "./pageClient";
import { notFound } from "next/navigation";

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { id } = await params;
  
  // Chargement des données côté serveur
  const historyData = generateMockHistory();
  const request = historyData.find((req) => req.id === id);

  if (!request) {
    notFound();
  }

  return <RequestDetailPageClient request={request} />;
}

