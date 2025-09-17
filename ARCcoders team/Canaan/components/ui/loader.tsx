import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define the visual variants for the spinner part of the loader
const spinnerVariants = cva("animate-spin rounded-full border-solid", {
	variants: {
		variant: {
			primary: "border-primary/20 border-t-primary",
			secondary: "border-secondary/20 border-t-secondary",
			destructive: "border-destructive/20 border-t-destructive",
			muted: "border-muted/20 border-t-muted-foreground",
			default: "border-foreground/20 border-t-foreground",
		},
		size: {
			sm: "h-4 w-4 border-2",
			md: "h-8 w-8 border-4",
			lg: "h-12 w-12 border-4",
			xl: "h-16 w-16 border-5",
			icon: "h-5 w-5 border-2",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

// Define the props for the main Loader component
export interface LoaderProps extends VariantProps<typeof spinnerVariants> {
	className?: string;
	text?: string;
	showText?: boolean;
}

export function Loader({
	variant,
	size,
	className,
	text,
	showText = true,
}: LoaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-2 h-full",
				className
			)}
		>
			<div className={cn(spinnerVariants({ variant, size }))} />
			{text && showText && (
				<p className="text-sm text-muted-foreground">{text}</p>
			)}
		</div>
	);
}
