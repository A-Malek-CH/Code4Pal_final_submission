import { cn } from "@/lib/utils";
import Image from "next/image";

import Link from "next/link";
import { ArrowRightIcon, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GameCardProps {
	product: any;
	principal?: boolean;
	className?: string;
}

export function GameCard({
	product,
	principal = false,
	className,
}: GameCardProps) {
	return (
		<div
			className={cn(
				"relative w-full bg-muted group overflow-hidden",
				principal ? "min-h-fold" : "aspect-[3/4] md:aspect-square",
				className
			)}
		>
			<Link
				href={`/games/${product.handle}`}
				className="block size-full focus-visible:outline-none"
				aria-label={`View ${product.title}`}
				prefetch
			>
				<Image
					src={
						product.featuredImage?.url ||
						"/placeholder.svg?height=400&width=400&query=product"
					}
					alt={product.title || product.featuredImage?.altText}
					priority={principal}
					width={principal ? 1200 : 400}
					height={principal ? 800 : 400}
					sizes={
						principal
							? "(max-width: 768px) 100vw, 50vw"
							: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					}
					className="object-cover size-full transition-all duration-500 group-hover:scale-105 filter grayscale group-hover:filter-none"
					quality={100}
				/>
			</Link>

			<div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] group-hover:shadow-[inset_0_0_60px_rgba(0,0,0,0.4)] transition-shadow duration-300 pointer-events-none"></div>

			<div className="absolute inset-0 p-2 w-full pointer-events-none">
				{/* Top badges - always visible */}
				<div className="flex justify-between items-start mb-2">
					{product.featured && (
						<Badge className="pointer-events-auto" variant="default">
							<Star className="h-3 w-3 mr-1" />
							Featured
						</Badge>
					)}
					{product.tags && product.tags.length > 0 && (
						<Badge className="pointer-events-auto ml-auto" variant="secondary">
							{product.tags[0]}
						</Badge>
					)}
				</div>

				{/* Desktop hover title - fades out on hover */}
				<div className="flex gap-6 justify-between items-baseline px-3 py-1 w-full font-semibold transition-all duration-300 translate-y-0 max-md:hidden group-hover:opacity-0 group-focus-visible:opacity-0 group-hover:-translate-y-full group-focus-visible:-translate-y-full">
					<p className="text-sm uppercase 2xl:text-base text-balance text-white drop-shadow-lg">
						{product.title}
					</p>
					{product.priceRange && (
						<div className="flex gap-2 items-center text-sm uppercase 2xl:text-base text-white drop-shadow-lg">
							{product.priceRange.minVariantPrice.amount}{" "}
							{product.priceRange.minVariantPrice.currencyCode}
						</div>
					)}
				</div>

				{/* Interactive overlay - slides up on hover */}
				<div className="flex absolute inset-x-3 bottom-3 flex-col gap-8 px-2 py-3 rounded-md transition-all duration-300 pointer-events-none bg-popover md:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 md:translate-y-1/3 group-hover:translate-y-0 group-focus-visible:translate-y-0 group-hover:pointer-events-auto group-focus-visible:pointer-events-auto max-md:pointer-events-auto">
					<div className="grid grid-cols-2 gap-x-4 gap-y-8 items-end">
						<div className="space-y-2">
							<p className="text-lg font-semibold text-pretty">
								{product.title}
							</p>
							<p className="text-sm text-muted-foreground">
								{product.description}
							</p>
						</div>

						<div className="col-span-2">
							<Button asChild className="w-full" size="sm" variant="default">
								<Link href={`/product/${product.handle}`}>
									<div className="flex justify-between items-center w-full">
										<span className="flex items-center gap-2">
											View Product
										</span>
										<ArrowRightIcon className="h-4 w-4" />
									</div>
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
