import Link from "next/link";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
	<div className="min-h-[100dvh-10rem] mx-auto relative py-20 px-4 flex items-center justify-center">
		{children}
	</div>
);

export const Error = ({ message }: { message: string }) => (
	<Wrapper>
		<div className="text-center max-w-md mx-auto">
			<div className="mb-8">
				<h1 className="text-8xl font-bold text-primary/20 mb-4">500</h1>
				<h2 className="text-2xl font-semibold text-foreground mb-2">
					Error Found.{" "}
					<Link href="/" className="underline">
						Go Back Home
					</Link>
				</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">
					Error: {message}
				</p>
			</div>
		</div>
	</Wrapper>
);
export const NotFound = () => (
	<Wrapper>
		<div className="text-center max-w-md mx-auto">
			<div className="mb-8">
				<h1 className="text-8xl font-bold text-primary/20 mb-4">404</h1>
				<h2 className="text-2xl font-semibold text-foreground mb-2">
					Items Not Found.{" "}
					<Link href="/" className="underline">
						Go Back Home
					</Link>
				</h2>
				<p className="text-muted-foreground text-sm leading-relaxed">
					Sorry, we couldn&apos;t find the items you&apos;re looking for. The
					items might have been moved, deleted, or you entered the wrong URL.
				</p>
			</div>
		</div>
	</Wrapper>
);
