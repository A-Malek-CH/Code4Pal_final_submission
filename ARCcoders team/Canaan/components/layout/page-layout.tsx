import { Footer } from "./footer";

export const PageLayout = ({
	children,
	className,
	collections,
}: {
	children: React.ReactNode;
	collections: any[];
	className?: string;
}) => {
	return (
		<div className={className}>
			<main>{children}</main>
			<Footer collections={collections} />
		</div>
	);
};
