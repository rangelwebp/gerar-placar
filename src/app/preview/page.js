"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import clubs from "@/data/clubs.json";
import leagues from "@/data/leagues.json";
import { useMatchArt } from "@/context/match-art-context";

export default function PreviewPage() {
	const router = useRouter();
	const { formData, resetForm } = useMatchArt();

	const homeTeam = useMemo(
		() => clubs.find((club) => club.id === formData.homeTeamId),
		[formData.homeTeamId],
	);

	const awayTeam = useMemo(
		() => clubs.find((club) => club.id === formData.awayTeamId),
		[formData.awayTeamId],
	);

	const selectedLeague = useMemo(
		() => leagues.find((league) => league.id === formData.league),
		[formData.league],
	);

	if (!formData.league || !homeTeam || !awayTeam || !formData.imageSrc) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
				<div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-center">
					<h1 className="text-2xl font-bold">Nada para visualizar</h1>
					<p className="mt-2 text-sm text-zinc-400">
						Preencha o formulário antes de abrir o preview.
					</p>
					<button
						type="button"
						onClick={() => router.push("/")}
						className="mt-6 w-full rounded-2xl bg-green-500 px-4 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white">
						Voltar ao formulário
					</button>
				</div>
			</main>
		);
	}

	async function waitForImages(container) {
		const images = Array.from(container.querySelectorAll("img"));

		await Promise.all(
			images.map((img) => {
				if (img.complete) return Promise.resolve();

				return new Promise((resolve) => {
					img.onload = resolve;
					img.onerror = resolve;
				});
			}),
		);
	}

	async function handlePrintPreview() {
		const previewElement = document.getElementById("preview");

		if (!previewElement) return;

		try {
			await waitForImages(previewElement);
			await new Promise((resolve) => setTimeout(resolve, 400));

			if (document.fonts?.ready) {
				await document.fonts.ready;
			}

			const isMobile = window.innerWidth < 768;

			const canvas = await html2canvas(previewElement, {
				backgroundColor: null,
				useCORS: true,
				allowTaint: false,
				scale: 1,
				logging: false,
			});

			canvas.toBlob(
				(blob) => {
					if (!blob) {
						alert(
							"Não foi possível gerar a imagem neste dispositivo.",
						);
						return;
					}

					const blobUrl = URL.createObjectURL(blob);

					if (isMobile) {
						window.open(blobUrl, "_blank");
						return;
					}

					const link = document.createElement("a");
					link.href = blobUrl;
					link.download = "placar.png";
					link.click();

					setTimeout(() => {
						URL.revokeObjectURL(blobUrl);
					}, 1000);
				},
				"image/png",
				1,
			);
		} catch (error) {
			console.error("Erro ao gerar imagem:", error);
			alert(
				"Não foi possível gerar a imagem automaticamente neste dispositivo.",
			);
		}
	}

	function handleNewImage() {
		resetForm();
		router.push("/");
	}

	return (
		<main className="min-h-screen bg-zinc-950 px-3 py-4 text-white">
			<div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
				<div
					id="preview"
					className="relative w-full overflow-hidden bg-black shadow-2xl"
					style={{ aspectRatio: "1080 / 1350" }}>
					<div className="absolute inset-0">
						<img
							src={formData.imageSrc}
							alt="Imagem de fundo da partida"
							className="h-full w-full object-cover"
							style={{
								objectPosition: `${50 + formData.crop.x / 8}% ${50 + formData.crop.y / 8}%`,
								transform: `scale(${formData.zoom})`,
							}}
						/>
					</div>

					<div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />

					{selectedLeague?.overlay ? (
						<div className="absolute inset-0">
							<img
								src={selectedLeague.overlay}
								alt={selectedLeague.name}
								className="h-full w-full object-cover"
							/>
						</div>
					) : null}

					<div className="absolute max-w-[100%] inset-x-[15%] bottom-[11%] flex items-center justify-between">
						<div className="flex w-20 max-w-[188px] justify-center">
							<img
								src={homeTeam.logo}
								alt={homeTeam.name}
								className="max-h-24 w-20 max-w-[188px] object-contain"
							/>
						</div>

						<div className="flex flex-col items-center text-center">
							<p
								className="text-[9px] font-bold uppercase -tracking-widest] text-white/90"
								style={{
									fontFamily: "var(--font-sora)",
								}}>
								{/* {formData.headline} */}
								{formData.round}
							</p>

							<h1
								className="mt-0 mb-0 text-[50px] font-black leading-none tracking-tight text-white"
								style={{ fontFamily: "var(--font-sora)" }}>
								{formData.score}
							</h1>

							<p
								className="mt-0 text-[9px] font-bold uppercase -tracking-widest] text-white"
								style={{
									fontFamily: "var(--font-sora)",
								}}>
								{selectedLeague?.name}
							</p>
						</div>

						<div className="flex w-20 max-w-[188px] justify-center">
							<img
								src={awayTeam.logo}
								alt={awayTeam.name}
								className="max-h-24 w-20 max-w-[188px] object-contain"
							/>
						</div>
					</div>

					<div className="absolute max-w-[100%] inset-x-[15%] bottom-[3%] flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
						<p
							className="max-w-[50%] text-[10px] text-left"
							style={{
								fontFamily: "var(--font-sora)",
							}}>
							{homeTeam.name}
						</p>
						{/* <p
							className="text-center text-[10px]"
							style={{
								fontFamily: "var(--font-sora)",
							}}>
							{formData.round}
						</p> */}
						<p
							className="max-w-[50%] text-[10px] text-right"
							style={{
								fontFamily: "var(--font-sora)",
							}}>
							{awayTeam.name}
						</p>
					</div>
				</div>

				<div className="sticky bottom-0 z-10 flex w-full flex-col gap-2 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-3 backdrop-blur">
					<button
						type="button"
						onClick={handlePrintPreview}
						className="w-full rounded-2xl bg-green-500 px-4 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:bg-green-400">
						Tirar print
					</button>

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
