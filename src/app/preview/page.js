"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
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

	const [homeScore = "0", awayScore = "0"] = (formData.score || "0-0").split(
		"-",
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

	function handleNewImage() {
		resetForm();
		router.push("/");
	}

	return (
		<main className="min-h-screen bg-zinc-950 px-3 py-4 text-white">
			<div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
				<div
					id="preview"
					className="relative w-full overflow-hidden bg-black shadow-2xl"
					style={{ aspectRatio: "4 / 5" }}>
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

					<div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/80" />

					<div className="absolute inset-0">
						<img
							src="/overlays/overlay-padrao.png"
							alt="Overlay padrão"
							className="h-full w-full object-cover"
						/>
					</div>

					<div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
						<div id="selectedLeague" className="w-full">
							<div className="flex items-center justify-between gap-3">
								<div
									className="px-2 text-[11px] uppercase text-white sm:text-sm"
									style={{
										backgroundColor:
											selectedLeague?.baseColor ||
											"#16a34a",
										fontFamily:
											"var(--font-special-gothic)",
									}}>
									{selectedLeague?.name}
								</div>

								<div className="h-px flex-1 bg-white/30" />

								<div
									className="text-[11px] uppercase text-white sm:text-sm"
									style={{
										fontFamily:
											"var(--font-special-gothic)",
									}}>
									{formData.round}
								</div>
							</div>
						</div>

						<div id="homeTeam">
							<div className="flex items-center justify-between gap-3">
								<div className="flex min-w-0 items-center gap-2 sm:gap-4">
									<img
										src={homeTeam.logo}
										className="w-8 shrink-0 object-contain sm:w-14"
										alt={homeTeam.name}
									/>

									<p
										className="truncate text-lg uppercase sm:text-3xl md:text-4xl"
										style={{
											fontFamily:
												"var(--font-special-gothic)",
										}}>
										{homeTeam.name}
									</p>
								</div>

								<div
									className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-10 sm:w-10"
									style={{
										backgroundColor:
											selectedLeague?.baseColor ||
											"#16a34a",
									}}>
									<p
										className="text-4xl leading-none text-white sm:text-5xl"
										style={{
											fontFamily: "var(--special-gothic)",
										}}>
										{homeScore}
									</p>
								</div>
							</div>
						</div>

						<div id="awayTeam">
							<div className="flex items-center justify-between gap-3">
								<div className="flex min-w-0 items-center gap-2 sm:gap-4">
									<img
										src={awayTeam.logo}
										className="w-8 shrink-0 object-contain sm:w-14"
										alt={awayTeam.name}
									/>

									<p
										className="truncate text-lg uppercase sm:text-xl md:text-4xl"
										style={{
											fontFamily:
												"var(--font-special-gothic)",
										}}>
										{awayTeam.name}
									</p>
								</div>

								<div
									className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-10 sm:w-10"
									style={{
										backgroundColor:
											selectedLeague?.baseColor ||
											"#16a34a",
									}}>
									<p
										className="text-4xl leading-none text-white sm:text-5xl"
										style={{
											fontFamily: "var(--special-gothic)",
										}}>
										{awayScore}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="sticky bottom-0 z-10 flex w-full flex-col gap-2 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-3 backdrop-blur">
					<div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
						Faça o print manual da arte no celular.
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
