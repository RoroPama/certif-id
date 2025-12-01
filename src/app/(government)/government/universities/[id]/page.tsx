import UniversityDetailPageClient from "./pageClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UniversityDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <UniversityDetailPageClient universityId={id} />;
}

