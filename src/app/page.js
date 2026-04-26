"use client";

import { useRouter } from "next/navigation";
import { useNewsArt } from "@/context/match-art-context";

export default function HomePage() {
	const router = useRouter();
	const { setType } = useNewsArt();

	function goToPlacar() {
		setType("placar");
		router.push("/placar");
	}

	function goToNoticia() {
		setType("noticia");
		router.push("/noticia");
	}

	function goToNoticiaPortal() {
		setType("noticia-portal");
		router.push("/noticia-portal");
	}

	return (
		<main className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
			<div className="mx-auto w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
						Gerador de Arte
					</h1>
					<p className="mt-4 text-lg text-zinc-400">
						Escolha o tipo de arte para criar
					</p>
				</div>

				<div className="space-y-3">
					<button
						onClick={goToPlacar}
						className="w-full rounded bg-green-500 px-6 py-6 text font-black uppercase tracking-[0.2em] text-white transition hover:bg-green-400 active:scale-[0.98]">
						Arte para placar
					</button>

					<button
						onClick={goToNoticia}
						className="w-full rounded bg-indigo-600 px-6 py-6 text font-black uppercase tracking-[0.2em] text-white transition hover:bg-indigo-500 active:scale-[0.98]">
						Notícia com overlay
					</button>

					<button
						onClick={goToNoticiaPortal}
						className="w-full rounded bg-purple-600 px-6 py-6 text font-black uppercase tracking-[0.2em] text-white transition hover:bg-purple-500 active:scale-[0.98]">
						Notícia de portal
					</button>
				</div>
			</div>
		</main>
	);
}
