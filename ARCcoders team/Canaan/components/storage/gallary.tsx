"use client";

import { memo, useState } from "react";
import Image from "next/image";
import type { MediaCreation, EditableImage } from "@/types/media";
import { ImageProgressComponent } from "./image-progress";
import { X, Edit3 } from "lucide-react";
import { ImageModal, MainImageModal } from "./image-modal";
import { Button } from "@/components/ui/button";

type Props = {
	images: MediaCreation[];
	deleteImage: (index: number) => void;
	uploading: boolean;
	completed: boolean;
};

const Gallery = ({ images, deleteImage, uploading, completed }: Props) => {
	const [selectedImage, setSelectedImage] = useState<MediaCreation | null>(
		null
	);

	const openModal = (image: MediaCreation) => {
		setSelectedImage(image);
	};

	const closeModal = () => {
		setSelectedImage(null);
	};

	return (
		<div className="h-full">
			<div className="bg-background rounded-lg border border-border p-4 backdrop-blur-sm h-full min-h-96">
				<div className="grid grid-cols-2 md:grid-cols-4 lg:max-w-full w-full max-h-96 overflow-y-auto gap-2 my-2">
					{images.map((image, index) => {
						return (
							<ImageCard
								onView={(image) => openModal(image)}
								completed={completed}
								uploading={uploading}
								key={index}
								image={image}
								index={index}
								deleteImage={() => deleteImage(index)}
							/>
						);
					})}
				</div>

				{selectedImage && (
					<ImageModal
						name={selectedImage.name}
						url={selectedImage.url}
						open={!!selectedImage}
						onClose={closeModal}
					/>
				)}
			</div>
		</div>
	);
};

type ImageCardProps = {
	image: MediaCreation;
	index: number;
	onView: (image: MediaCreation) => void;
	deleteImage: () => void;
	uploading: boolean;
	completed: boolean;
};

const ImageCard = memo(
	({
		image,
		index,
		onView,
		deleteImage,
		uploading,
		completed,
	}: ImageCardProps) => {
		return (
			<section className="w-full group" key={index}>
				<div className="inline-flex space-x-1.5 items-center w-full mb-2">
					{!uploading && !completed && (
						<>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 transition-all duration-300"
								onClick={() => deleteImage()}
								type="button"
							>
								<X className="w-4 h-4" />
							</Button>
						</>
					)}
				</div>

				<div className="relative group aspect-video flex border-2 border-border rounded-lg overflow-hidden bg-background/50 ">
					<div className="absolute inset-0  bg-background/70"></div>

					<CustomImage image={image} />
					<ImageProgressComponent image={image} onView={onView} />
				</div>
			</section>
		);
	}
);

ImageCard.displayName = "ImageCard";

const CustomImage = memo(({ image }: { image: MediaCreation }) => {
	return (
		<Image
			src={image.url || "/placeholder.svg"}
			alt={image.name}
			className="object-contain transition duration-300 ease-in-out group-hover:blur-sm"
			fill
			loading="eager"
			style={{
				filter: "brightness(0.9) contrast(1.1) saturate(1.2)",
			}}
		/>
	);
});

CustomImage.displayName = "CustomImage";

export default Gallery;
