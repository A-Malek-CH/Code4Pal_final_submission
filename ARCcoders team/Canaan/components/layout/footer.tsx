import { LogoSvg } from "@/components/icons/logo-svg";
import { AppLinks } from "./app-links";

export async function Footer({ collections }: { collections: any[] }) {
	return (
		<footer className="p-sides">
			<div className="w-full md:h-[532px] p-sides md:p-11 text-background bg-foreground rounded-[12px] flex flex-col justify-between max-md:gap-8">
				<div className="flex flex-col justify-between md:flex-row">
					<AppLinks
						collections={collections}
						className="max-md:hidden"
						footer
					/>
					<LogoSvg className="md:basis-3/4 max-md:w-full max-w-[1200px] h-auto block" />

					<span className="mt-3 italic font-semibold md:hidden">
						Refined. Minimal. Never boring.
					</span>
				</div>
				<div className="flex justify-between max-md:contents text-muted-foreground">
					<p className="text-base">
						{new Date().getFullYear()}© — All rights reserved
					</p>
				</div>
			</div>
		</footer>
	);
}
