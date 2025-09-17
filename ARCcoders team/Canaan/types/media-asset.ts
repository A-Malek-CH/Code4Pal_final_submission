import { MediaAsset } from "@prisma/client";
export type MediaAssetInput = Omit<
	MediaAsset,
	"id" | "updated_at" | "created_at"
>;
