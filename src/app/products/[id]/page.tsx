import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/market/${id}`);
}
