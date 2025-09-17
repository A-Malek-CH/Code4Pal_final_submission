import { SVGProps } from "react";

export function Quicktiles(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 48 48"
			width="1em"
			height="1em"
			{...props}
		>
			<path
				fill="none"
				strokeWidth={3}
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M7 7h17v17H7zm17 0h17v17H24zM7 24h17v17H7zm19.8 2.8h17v17h-17z"
			></path>
		</svg>
	);
}
