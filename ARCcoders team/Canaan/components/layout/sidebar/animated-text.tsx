"use client";
import React, { useEffect, useState } from "react";

function AnimatedText() {
	const [currentText, setCurrentText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);

	const texts = [
		`Occupying history is more dangerous than occupying land. All knowledge
is in favor of Palestine and its frank archaeological history.`,
	];

	useEffect(() => {
		const typeSpeed = isDeleting ? 40 : 100;
		const currentFullText = texts[currentIndex];

		const timer = setTimeout(() => {
			if (!isDeleting) {
				// Typing
				if (currentText.length < currentFullText.length) {
					setCurrentText(currentFullText.substring(0, currentText.length + 1));
				} else {
					// Finished typing, start deleting after delay
					setTimeout(() => setIsDeleting(true), 1500);
				}
			} else {
				// Deleting
				if (currentText.length > 0) {
					setCurrentText(currentText.substring(0, currentText.length - 1));
				} else {
					// Finished deleting, move to next text
					setIsDeleting(false);
					setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
				}
			}
		}, typeSpeed);

		return () => clearTimeout(timer);
	}, [currentText, currentIndex, isDeleting, texts]);
	return (
		<blockquote className="relative pl-4 border-l-2 border-primary/30">
			<p className="text-2xl text-foreground italic">{currentText}</p>
		</blockquote>
	);
}

export default AnimatedText;
