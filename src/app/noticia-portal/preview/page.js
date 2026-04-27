"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import leagues from "@/data/leagues.json";
import { useNewsArt } from "@/context/match-art-context";

export default function NoticiaPortalPreview() {
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
						onClick={() => router.push("/noticia-portal")}
						className="mt-6 w-full rounded-2xl bg-green-500 px-4 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white">
						Voltar ao formulário
					</button>
				</div>
			</main>
		);
	}

	function handleNewImage() {
		reset();
		router.push("/noticia-portal");
	}

	return (
		<main className="min-h-screen bg-zinc-950 px-3 py-4 font-special text-white">
			<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4">
				<div className="w-full max-w-md">
					<div
						className="relative w-full overflow-hidden bg-black shadow-2xl"
						style={{ aspectRatio: "1080 / 1350" }}>
						<header
							className="w-full py-3 text-center"
							style={{
								backgroundColor:
									selectedLeague?.baseColor || "#067a5e",
								fontFamily: "var(--font-sora)",
							}}>
							<p className="text-xs uppercase text-white">
								FUTEBOL PORTUGUÊS
							</p>
						</header>

						<div
							className="flex flex-col items-start gap-2 p-6"
							style={{ backgroundColor: "white" }}>
							<p
								className="inline-block px-2 py-1 text-[9px] uppercase text-white"
								style={{
									backgroundColor:
										selectedLeague?.baseColor || "#067a5e",
									fontFamily: "var(--font-special-gothic)",
								}}>
								{selectedLeague?.name}
							</p>

							<p
								className="text-xl leading-tight text-zinc-950"
								style={{
									fontFamily: "var(--font-sora)",
									fontWeight: 600,
								}}>
								{newsArt.title}
							</p>

							<p
								className="mb-2 text-sm font-light text-zinc-500"
								style={{
									fontFamily: "var(--font-sora)",
									fontWeight: 200,
								}}>
								{newsArt.subtitle}
							</p>

							<div className="flex items-center gap-2">
								<img
									src="/images/icon-author-zona.png"
									alt="Logo Zona de Acesso"
									className="h-6 w-6 object-contain"
								/>
								<p
									className="text-xs text-zinc-950"
									style={{
										fontFamily: "var(--font-sora)",
										fontWeight: 500,
									}}>
									por Zona de Acesso
								</p>
							</div>
						</div>

						<figure className="w-full h-[766px] overflow-hidden bg-black">
							<img
								src={newsArt.imageSrc}
								alt="Imagem da notícia"
								className="block h-full w-full object-cover"
								style={{
									objectPosition: `${50 + newsArt.crop.x / 8}% ${50 + newsArt.crop.y / 8}%`,
									transform: `scale(${newsArt.zoom})`,
									transformOrigin: "center",
								}}
							/>
						</figure>
					</div>
				</div>

				<div className="sr-only">
					<div
						id="export-canvas"
						className="h-[1350px] w-[1080px] overflow-hidden bg-black">
						<header
							className="w-full py-6 text-center"
							style={{
								backgroundColor:
									selectedLeague?.baseColor || "#067a5e",
								fontFamily: "var(--font-special-gothic)",
							}}>
							<p className="text-sm uppercase tracking-[0.2em] text-white">
								FUTEBOL PORTUGUÊS
							</p>
						</header>

						<div
							className="flex flex-col gap-6 px-48 py-48"
							style={{ backgroundColor: "white" }}>
							<p
								className="inline-block px-6 py-2 text-xs uppercase tracking-[0.2em] text-white"
								style={{
									backgroundColor:
										selectedLeague?.baseColor || "#067a5e",
									fontFamily: "var(--font-special-gothic)",
								}}>
								{selectedLeague?.name}
							</p>

							<p
								className="text-4xl leading-tight text-zinc-950"
								style={{
									fontFamily: "var(--font-sora)",
									fontWeight: 500,
								}}>
								{newsArt.title}
							</p>

							<p
								className="mb-6 text-2xl font-light text-zinc-500"
								style={{
									fontFamily: "var(--font-sora)",
									fontWeight: 200,
								}}>
								{newsArt.subtitle}
							</p>

							<div className="flex items-center gap-4">
								<img
									src="/images/icon-author-zona.png"
									alt="Logo Zona de Acesso"
									className="h-12 w-12 object-contain"
								/>
								<p
									className="text-lg text-zinc-950"
									style={{
										fontFamily: "var(--font-sora)",
										fontWeight: 500,
									}}>
									por Zona de Acesso
								</p>
							</div>
						</div>

						<figure className="w-full h-[766px] overflow-hidden bg-black">
							<img
								src={newsArt.imageSrc}
								alt="Imagem da notícia"
								className="block h-full w-full object-cover"
								style={{
									objectPosition: `${50 + newsArt.crop.x / 8}% ${50 + newsArt.crop.y / 8}%`,
									transform: `scale(${newsArt.zoom})`,
									transformOrigin: "center",
								}}
							/>
						</figure>
					</div>
				</div>

				<div className="sticky bottom-0 z-10 flex w-full max-w-md flex-col gap-2 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-3 backdrop-blur">
					<div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
						Preview 1080x1350 | Print manual no celular
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
