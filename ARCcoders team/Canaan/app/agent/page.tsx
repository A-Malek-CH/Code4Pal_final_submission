// file: app/page.tsx
import WelcomePage from "@/components/agent/welcome-page";

export default async function HomePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const agentIdNotFound =
		typeof searchParams.notFound == "string" ? searchParams.notFound : "";
	return <WelcomePage agentIdNotFound={agentIdNotFound}></WelcomePage>;
}
