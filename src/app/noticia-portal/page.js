"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import leagues from "@/data/leagues.json";
import { useNewsArt } from "@/context/match-art-context";
import BackButton from "@/components/back-button";
import { getCroppedImage } from "@/lib/get-cropped-image";

export default function NoticiaPortalForm() {
	const router = useRouter();
	const fileInputRef = useRef(null);

	const { newsArt, setType, updateField, updateFields } = useNewsArt();

	const [error, setError] = useState("");
	const [isCropOpen, setIsCropOpen] = useState(false);

	const selectedLeague = useMemo(() => {
		return leagues.find((league) => league.id === newsArt.league);
	}, [newsArt.league]);

	function handleLeagueChange(event) {
		updateField("league", event.target.value);
		setError("");
	}

	function handleTitleChange(event) {
		updateField("title", event.target.value);
		setError("");
	}

	function handleSubtitleChange(event) {
		updateField("subtitle", event.target.value);
		setError("");
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
				croppedImage: "",
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
		if (!newsArt.title.trim()) return "Informe o título principal.";
		if (!newsArt.subtitle.trim()) return "Informe o subtítulo.";
		if (!newsArt.league) return "Selecione a liga.";
		if (!newsArt.imageSrc) return "Envie a imagem de fundo.";
		if (!newsArt.croppedImage)
			return "Ajuste e confirme o enquadramento da imagem.";
		return "";
	}

	function handleSubmit(event) {
		event.preventDefault();

		setType("noticia-portal");

		const validationError = validateForm();

		if (validationError) {
			setError(validationError);
			return;
		}

		setError("");
		router.push("/noticia-portal/preview");
	}

	async function handleConfirmCrop() {
		try {
			if (!newsArt.imageSrc || !newsArt.croppedAreaPixels) return;

			const croppedImage = await getCroppedImage(
				newsArt.imageSrc,
				newsArt.croppedAreaPixels,
			);

			updateField("croppedImage", croppedImage);
			setIsCropOpen(false);
			setError("");
		} catch (error) {
			console.error(error);
			setError("Não foi possível processar o recorte da imagem.");
		}
	}

	return (
		<>
			<main className="min-h-screen bg-zinc-950 px-4 py-6 text-white">
				<div className="mb-4">
					<BackButton fallbackHref="/" />
				</div>
				<div className="mx-auto w-full max-w-xl">
					<div className="mb-6">
						<span className="mb-3 inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
							Notícia de portal
						</span>

						<h1 className="text-3xl font-black tracking-tight text-white">
							Criar notícia de portal
						</h1>

						<p className="mt-2 text-sm leading-6 text-zinc-400">
							Preencha título, subtítulo, liga e ajuste a imagem
							para gerar a preview.
						</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-2xl shadow-black/20">
						<Field>
							<Label htmlFor="title">Título principal</Label>
							<Textarea
								id="title"
								rows={2}
								placeholder="Ex.: Brasileiro João Victor marca dois gols na vitória do Paços de Ferreira"
								value={newsArt.title}
								onChange={handleTitleChange}
							/>
						</Field>

						<Field>
							<Label htmlFor="subtitle">Subtítulo/resumo</Label>
							<Textarea
								id="subtitle"
								rows={3}
								placeholder="Ex.: Foi o sétimo gol do brasileiro que assume a artilharia da equipe do Capital do Móvel."
								value={newsArt.subtitle}
								onChange={handleSubtitleChange}
							/>
						</Field>

						<Field>
							<Label htmlFor="league">Liga</Label>
							<Select
								id="league"
								value={newsArt.league}
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
							<Label htmlFor="image">Imagem de fundo</Label>

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
								{newsArt.imageSrc
									? "Trocar imagem"
									: "Selecionar imagem"}
							</button>

							{newsArt.imageSrc ? (
								<div className="mt-3 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
									<img
										src={newsArt.imageSrc}
										alt="Pré-visualização da imagem enviada"
										className="h-56 w-full object-cover"
									/>
								</div>
							) : null}

							{newsArt.imageSrc ? (
								// <button
								// 	type="button"
								// 	onClick={() => setIsCropOpen(true)}
								// 	className="mt-3 w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-green-500 hover:text-white">
								// 	Ajustar enquadramento
								// </button>
								<button
									type="button"
									onClick={handleConfirmCrop}
									className="mt-4 w-full rounded-2xl bg-green-500 px-4 py-4 text-sm font-extrabold uppercase text-white transition hover:bg-green-400">
									Confirmar enquadramento
								</button>
							) : null}
						</Field>

						{selectedLeague?.baseColor ? (
							<div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
								Cor base da liga:
								<span
									className="ml-3 inline-flex h-4 w-4 rounded-full align-middle"
									style={{
										backgroundColor:
											selectedLeague.baseColor,
									}}
								/>
								<span className="ml-2 font-mono text-zinc-400">
									{selectedLeague.baseColor}
								</span>
							</div>
						) : null}

						{error ? (
							<div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
								{error}
							</div>
						) : null}

						<button
							type="submit"
							className="w-full rounded-2xl bg-green-500 px-4 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:bg-green-400 active:scale-[0.99]">
							Gerar notícia
						</button>
					</form>
				</div>
			</main>

			{isCropOpen && newsArt.imageSrc ? (
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
							image={newsArt.imageSrc}
							crop={newsArt.crop}
							zoom={newsArt.zoom}
							aspect={1080 / 766} // Proporção da imagem do seu rascunho
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
							value={newsArt.zoom}
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

function Textarea(props) {
	return (
		<textarea
			{...props}
			className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-green-500"
		/>
	);
}

function Select(props) {
	return (
		<select
			{...props}
			className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white outline-none transition focus:border-green-500"
		/>
	);
}
