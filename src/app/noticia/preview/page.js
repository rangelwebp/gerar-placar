"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import leagues from "@/data/leagues.json";
import { useNewsArt } from "@/context/match-art-context";

export default function NoticiaPreviewPage() {
	const router = useRouter();
	const { newsArt, reset } = useNewsArt();

	const selectedLeague = useMemo(
		() => leagues.find((league) => league.id === newsArt.league),
		[newsArt.league],
	);

	if (!newsArt.title || !newsArt.league || !newsArt.imageSrc) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
				<div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-center">
					<h1 className="text-2xl font-bold">Nada para visualizar</h1>
					<p className="mt-2 text-sm text-zinc-400">
						Preencha o formulário antes de abrir o preview.
					</p>
					<button
						type="button"
						onClick={() => router.push("/noticia")}
						className="mt-6 w-full rounded-2xl bg-green-500 px-4 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white">
						Voltar ao formulário
					</button>
				</div>
			</main>
		);
	}

	function handleNewImage() {
		reset();
		router.push("/noticia");
	}

	return (
		<main className="min-h-screen bg-zinc-950 px-3 py-4 text-white">
			<div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
				<div
					id="preview"
					className="relative w-full overflow-hidden bg-black shadow-2xl"
					style={{ aspectRatio: "4 / 5" }}>
					<div className="absolute inset-0">
						<img
							src={newsArt.imageSrc}
							alt="Imagem de fundo da notícia"
							className="h-full w-full object-cover"
							style={{
								objectPosition: `${50 + newsArt.crop.x / 8}% ${50 + newsArt.crop.y / 8}%`,
								transform: `scale(${newsArt.zoom})`,
							}}
						/>
					</div>

					<div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/80" />

					<div
						className="pointer-events-none absolute inset-x-0 bottom-0 z-[0] h-[32%]"
						style={{
							backdropFilter: "blur(4px)",
							WebkitBackdropFilter: "blur(4px)",
							background:
								"linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.48) 50%, rgba(0,0,0,0) 100%)",
						}}
					/>

					{selectedLeague?.overlay ? (
						<div className="absolute inset-0">
							{/* Imagem padrão vindo do /public/overlays/ */}
							<img
								src="/overlays/overlay-padrao.png"
								className="h-full w-full object-cover"
							/>
						</div>
					) : null}

					<div className="absolute inset-x-0 bottom-0 p-6">
						<div
							className="mb-2 inline-flex px-3 py-1 text-xs uppercase text-white"
							style={{
								backgroundColor:
									selectedLeague?.baseColor || "#16a34a",
								fontFamily: "var(--font-special-gothic)",
							}}>
							{selectedLeague?.name}
						</div>

						<h1
							className="max-w-[90%] text-2xl leading-tight text-white"
							style={{ fontFamily: "var(--font-sora)" }}>
							{newsArt.title}
						</h1>
					</div>
				</div>

				<div className="sticky bottom-0 z-10 flex w-full flex-col gap-2 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-3 backdrop-blur">
					<div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
						Preview inicial da notícia com overlay.
					</div>

					<button
						type="button"
						onClick={handleNewImage}
						className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-zinc-100 transition hover:border-zinc-500">
						Gerar nova imagem
					</button>
				</div>
			</div>
		</main>
	);
}
