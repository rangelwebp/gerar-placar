"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import leagues from "@/data/leagues.json";
import { useMatchArt } from "@/context/match-art-context";
import { getFilteredClubsByLeague } from "@/lib/clubs";
import { formatScoreInput, isValidScore } from "@/lib/score";

const HEADLINE_OPTIONS = [
	"RESULTADO FINAL",
	"FIM DE JOGO",
	"PLACAR FINAL",
	"INTERVALO",
];

export default function HomePage() {
	const router = useRouter();
	const fileInputRef = useRef(null);

	const { formData, updateField, updateFields } = useMatchArt();

	const [error, setError] = useState("");
	const [isCropOpen, setIsCropOpen] = useState(false);

	const availableClubs = useMemo(() => {
		if (!formData.league) return [];
		return getFilteredClubsByLeague(formData.league);
	}, [formData.league]);

	const homeClubOptions = useMemo(() => {
		return availableClubs.filter((club) => club.id !== formData.awayTeamId);
	}, [availableClubs, formData.awayTeamId]);

	const awayClubOptions = useMemo(() => {
		return availableClubs.filter((club) => club.id !== formData.homeTeamId);
	}, [availableClubs, formData.homeTeamId]);

	function handleLeagueChange(event) {
		const nextLeague = event.target.value;

		updateFields({
			league: nextLeague,
			homeTeamId: "",
			awayTeamId: "",
		});

		setError("");
	}

	function handleScoreChange(event) {
		const formattedScore = formatScoreInput(event.target.value);
		updateField("score", formattedScore);
	}

	function handleImageChange(event) {
		const file = event.target.files?.[0];

		if (!file) return;

		if (!file.type.startsWith("image/")) {
			setError("Selecione uma imagem válida.");
			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result !== "string") return;

			updateFields({
				imageSrc: reader.result,
				crop: { x: 0, y: 0 },
				zoom: 1,
				croppedAreaPixels: null,
			});

			setError("");
			setIsCropOpen(true);
		};

		reader.readAsDataURL(file);
	}

	const handleCropComplete = useCallback(
		(_, croppedAreaPixels) => {
			updateField("croppedAreaPixels", croppedAreaPixels);
		},
		[updateField],
	);

	function validateForm() {
		if (!formData.league) return "Selecione a liga.";
		if (!formData.homeTeamId) return "Selecione o clube da casa.";
		if (!formData.awayTeamId) return "Selecione o clube visitante.";
		if (formData.homeTeamId === formData.awayTeamId) {
			return "Os clubes da casa e visitante não podem ser iguais.";
		}
		if (!formData.round.trim()) return "Informe a rodada.";
		if (!isValidScore(formData.score))
			return "Informe o placar no formato 1-1.";
		if (!formData.imageSrc) return "Envie a imagem de fundo.";

		return "";
	}

	function handleSubmit(event) {
		event.preventDefault();

		const validationError = validateForm();

		if (validationError) {
			setError(validationError);
			return;
		}

		setError("");
		router.push("/preview");
	}

	return (
		<>
			<main className="min-h-screen bg-zinc-950 px-4 py-6 text-white">
				<div className="mx-auto w-full max-w-xl">
					<div className="mb-6">
						<span className="mb-3 inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
							Gerar placar
						</span>

						<h1 className="text-3xl font-black tracking-tight text-white">
							Criar imagem de resultado
						</h1>

						<p className="mt-2 text-sm leading-6 text-zinc-400">
							Preencha os dados da partida, ajuste a imagem e gere
							a arte para publicação.
						</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-2xl shadow-black/20">
						<Field>
							<Label htmlFor="league">Liga</Label>
							<Select
								id="league"
								value={formData.league}
								onChange={handleLeagueChange}>
								<option value="">Selecione a liga</option>
								{leagues.map((league) => (
									<option key={league.id} value={league.id}>
										{league.name}
									</option>
								))}
							</Select>
						</Field>

						<Field>
							<Label htmlFor="homeTeam">Clube da casa</Label>
							<Select
								id="homeTeam"
								value={formData.homeTeamId}
								onChange={(event) =>
									updateField(
										"homeTeamId",
										event.target.value,
									)
								}
								disabled={!formData.league}>
								<option value="">
									Selecione o clube da casa
								</option>
								{homeClubOptions.map((club) => (
									<option key={club.id} value={club.id}>
										{club.name}
									</option>
								))}
							</Select>
						</Field>

						<Field>
							<Label htmlFor="awayTeam">Clube visitante</Label>
							<Select
								id="awayTeam"
								value={formData.awayTeamId}
								onChange={(event) =>
									updateField(
										"awayTeamId",
										event.target.value,
									)
								}
								disabled={!formData.league}>
								<option value="">
									Selecione o clube visitante
								</option>
								{awayClubOptions.map((club) => (
									<option key={club.id} value={club.id}>
										{club.name}
									</option>
								))}
							</Select>
						</Field>

						<Field>
							<Label htmlFor="headline">Texto principal</Label>
							<Select
								id="headline"
								value={formData.headline}
								onChange={(event) =>
									updateField("headline", event.target.value)
								}>
								{HEADLINE_OPTIONS.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</Select>
						</Field>

						<Field>
							<Label htmlFor="round">Rodada</Label>
							<Input
								id="round"
								type="text"
								placeholder="Ex.: 28ª RODADA"
								value={formData.round}
								onChange={(event) =>
									updateField("round", event.target.value)
								}
							/>
						</Field>

						<Field>
							<Label htmlFor="score">Placar</Label>
							<Input
								id="score"
								type="text"
								inputMode="numeric"
								pattern="[0-9]-[0-9]"
								placeholder="Digite 11 para virar 1-1"
								value={formData.score}
								onChange={handleScoreChange}
								maxLength={3}
							/>
							<p className="mt-2 text-xs text-zinc-500">
								Digite apenas dois números. Ex.: 11 vira 1-1.
							</p>
						</Field>

						<Field>
							<Label htmlFor="image">Imagem de background</Label>

							<input
								ref={fileInputRef}
								id="image"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
							/>

							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="flex w-full items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 px-4 py-4 text-sm font-medium text-zinc-300 transition hover:border-green-500 hover:text-white">
								{formData.imageSrc
									? "Trocar imagem"
									: "Selecionar imagem"}
							</button>

							{formData.imageSrc ? (
								<div className="mt-3 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
									<img
										src={formData.imageSrc}
										alt="Pré-visualização da imagem enviada"
										className="h-56 w-full object-cover"
									/>
								</div>
							) : null}

							{formData.imageSrc ? (
								<button
									type="button"
									onClick={() => setIsCropOpen(true)}
									className="mt-3 w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-green-500 hover:text-white">
									Ajustar enquadramento
								</button>
							) : null}
						</Field>

						{error ? (
							<div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
								{error}
							</div>
						) : null}

						<button
							type="submit"
							className="w-full rounded-2xl bg-green-500 px-4 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:bg-green-400 active:scale-[0.99]">
							Gerar imagem
						</button>
					</form>
				</div>
			</main>

			{isCropOpen && formData.imageSrc ? (
				<div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95">
					<div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
								Cropper
							</p>
							<h2 className="text-lg font-bold text-white">
								Ajustar imagem
							</h2>
						</div>

						<button
							type="button"
							onClick={() => setIsCropOpen(false)}
							className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-200">
							Fechar
						</button>
					</div>

					<div className="relative flex-1">
						<Cropper
							image={formData.imageSrc}
							crop={formData.crop}
							zoom={formData.zoom}
							aspect={4 / 5}
							onCropChange={(value) => updateField("crop", value)}
							onCropComplete={handleCropComplete}
							onZoomChange={(value) => updateField("zoom", value)}
							showGrid={true}
						/>
					</div>

					<div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4">
						<label className="mb-2 block text-sm font-semibold text-zinc-200">
							Zoom
						</label>

						<input
							type="range"
							min={1}
							max={3}
							step={0.1}
							value={formData.zoom}
							onChange={(event) =>
								updateField("zoom", Number(event.target.value))
							}
							className="w-full accent-green-500"
						/>

						<button
							type="button"
							onClick={() => setIsCropOpen(false)}
							className="mt-4 w-full rounded-2xl bg-green-500 px-4 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:bg-green-400">
							Confirmar enquadramento
						</button>
					</div>
				</div>
			) : null}
		</>
	);
}

function Field({ children }) {
	return <div>{children}</div>;
}

function Label({ htmlFor, children }) {
	return (
		<label
			htmlFor={htmlFor}
			className="mb-2 block text-sm font-semibold text-zinc-200">
			{children}
		</label>
	);
}

function Input(props) {
	return (
		<input
			{...props}
			className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-green-500"
		/>
	);
}

function Select(props) {
	return (
		<select
			{...props}
			className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none transition focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50"
		/>
	);
}
