import RegistryDetailPageClient from "./pageClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RegistryDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <RegistryDetailPageClient entryId={id} />;
}

