"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import leagues from "@/data/leagues.json";
import { useNewsArt } from "@/context/match-art-context";

export default function NoticiaPortalPreview() {
	const router = useRouter();
	const { newsArt, reset, updateField } = useNewsArt();

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
							<p className="text-[11px] uppercase tracking-widest text-white">
								FUTEBOL PORTUGUÊS
							</p>
						</header>

						<div
							className="flex flex-col items-start gap-2 p-6"
							style={{ backgroundColor: "white" }}>
							<p
								className="inline-block px-2 py-0.5 text-[11px] uppercase text-white"
								style={{
									backgroundColor:
										selectedLeague?.baseColor || "#067a5e",
									fontFamily: "var(--font-sora)",
								}}>
								{selectedLeague?.name}
							</p>

							<p
								className="text-xl leading-tight text-zinc-950"
								style={{
									fontWeight: 600,
								}}>
								{newsArt.title}
							</p>

							<p
								className="mb-2 text-sm font-light text-zinc-500"
								style={{
									fontWeight: 300,
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
									className="text-[10px] text-zinc-950"
									style={{
										fontWeight: 500,
									}}>
									por Zona de Acesso
								</p>
							</div>
						</div>

						<figure className="relative h-[766px] w-full overflow-hidden bg-black">
							<img
								src={newsArt.imageSrc}
								alt="Imagem da notícia"
								className="absolute left-0 top-0 h-full w-full object-cover"
								style={{
									transform: `translateY(${newsArt.imageOffsetY ?? 0}px)`,
									transformOrigin: "center top",
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
								fontFamily: "var(--font-sora)",
							}}>
							<p className="text-[10px] uppercase tracking-[0.2em] text-white">
								FUTEBOL PORTUGUÊS
							</p>
						</header>

						<div
							className="flex flex-col gap-6 px-48 py-48"
							style={{ backgroundColor: "white" }}>
							<p
								className="inline-block px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-white"
								style={{
									backgroundColor:
										selectedLeague?.baseColor || "#067a5e",
									fontFamily: "var(--font-sora)",
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

						<figure className="relative h-[766px] w-full overflow-hidden bg-black">
							<img
								src={newsArt.imageSrc}
								alt="Imagem da notícia"
								className="absolute left-0 top-0 h-full w-full object-cover"
								style={{
									transform: `translateY(${newsArt.imageOffsetY ?? 0}px)`,
									transformOrigin: "center top",
								}}
							/>
						</figure>
					</div>
				</div>

				<div className="sticky bottom-0 z-10 flex w-full max-w-md flex-col gap-2 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-3 backdrop-blur">
					<div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4">
						<label className="mb-2 block text-sm font-semibold text-zinc-200">
							Ajuste vertical da imagem
						</label>

						<input
							type="range"
							min={-300}
							max={300}
							step={1}
							value={newsArt.imageOffsetY ?? 0}
							onChange={(event) =>
								updateField(
									"imageOffsetY",
									Number(event.target.value),
								)
							}
							className="w-full accent-green-500"
						/>

						<div className="mt-2 text-xs text-zinc-500">
							Ajuste atual: {newsArt.imageOffsetY ?? 0}px
						</div>
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
