import { OAuthCallback } from "@/modules/auth/OAuthCallback";
import { redirect } from "next/navigation";

export default async function OAuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<"code", string | undefined>>;
}) {
  const parsedParams = await searchParams;

  if (!parsedParams.code) redirect("/login");

  return <OAuthCallback code={parsedParams.code} />;
}
