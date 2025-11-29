/**
 * Server Component - Page détail d'un diplôme
 */

import { generateMockRegistry } from "../../utils/mockData";
import DiplomaDetailPageClient from "./pageClient";
import { notFound } from "next/navigation";

interface DiplomaDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DiplomaDetailPage({ params }: DiplomaDetailPageProps) {
  const { id } = await params;
  
  // Chargement des données côté serveur
  const registryData = generateMockRegistry();
  const diploma = registryData.find((dip) => dip.id === id);

  if (!diploma) {
    notFound();
  }

  return <DiplomaDetailPageClient diploma={diploma} />;
}

