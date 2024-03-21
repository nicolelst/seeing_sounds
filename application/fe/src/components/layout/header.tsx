import { ReactElement } from "react";

export function Header(): ReactElement {
	return (
		<div className="flex flex-col text-center content-center align-middle">
			{/* TODO configure header styles https://tailwindcss.com/docs/font-family#customizing-your-theme */}
			<h2 className="font-mono text-2xl font-semibold">SCSE23-038</h2>
			<h1 className="font-mono text-4xl font-extrabold">
				The Augmented Human — Seeing Sounds
			</h1>
			<p className="font-sans text-lg italic mt-1">
				a Final Year Project by Nicole Lim Sze Ting
			</p>
		</div>
	);
}
