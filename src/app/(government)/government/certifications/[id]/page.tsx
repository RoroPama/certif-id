import CertificationDetailPageClient from "./pageClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CertificationDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CertificationDetailPageClient requestId={id} />;
}

