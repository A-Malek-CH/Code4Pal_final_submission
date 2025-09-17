"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import { type FC } from "react";

interface IImageModalProps {
	name: string;
	url: string;
	onClose?: () => void;
	open?: boolean;
}

export const ImageModal: FC<IImageModalProps> = ({
	name,
	url,
	open,
	onClose,
}) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="flex flex-col max-w-6xl w-full h-[90vh] border-2 border-border backdrop-blur-md shadow-lg">
				<DialogHeader className="border-none pb-4">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-xl font-mono text-primary animate-[glitchText_3s_ease-in-out_infinite]">
							_IMAGE: {name}
						</DialogTitle>
					</div>
				</DialogHeader>

				<div className="relative h-full">
					<div className="absolute inset-0 bg-gradient-to-br "></div>
					<div className="relative w-full h-full flex items-center justify-center">
						<Image
							src={url || "/placeholder.svg"}
							alt={name}
							fill
							className="object-contain transition-all duration-300 ease-in-out h-full drop-shadow-lg"
							loading="eager"
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export const MainImageModal = ({ name, url }: IImageModalProps) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="icon"
					type="button"
					className="bg-gray-800/50 border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_15px_rgba(0,247,255,0.5)] transition-all duration-300 "
				>
					<EyeIcon className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col max-w-6xl w-full h-[90vh] border-2 border-primary/50 backdrop-blur-md shadow-[0_0_50px_rgba(0,247,255,0.3)]">
				<DialogHeader className="border-none pb-4">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-xl font-mono text-primary animate-[glitchText_3s_ease-in-out_infinite]">
							_IMAGE: {name}
						</DialogTitle>
					</div>
				</DialogHeader>

				<div className="relative h-full">
					<div className="absolute inset-0 bg-gradient-to-br "></div>
					<div className="relative w-full h-full flex items-center justify-center">
						<Image
							src={url || "/placeholder.svg"}
							alt={name}
							fill
							className="object-contain transition-all duration-300 ease-in-out h-full"
							style={{
								filter: "drop-shadow(0 0 10px rgba(0, 247, 255, 0.3))",
							}}
							loading="eager"
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
