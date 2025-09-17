import { SearchTable } from "@/components/storage/media-table";

async function MediaTablePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const page = Number(searchParams.page) || 1;

	const folder =
		typeof searchParams.folder === "string" ? searchParams.folder : "";
	const searchQuery =
		typeof searchParams.searchQuery === "string"
			? searchParams.searchQuery
			: "";

	return <SearchTable page={page} folder={folder} searchQuery={searchQuery} />;
}
export default MediaTablePage;
