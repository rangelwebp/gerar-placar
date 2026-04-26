"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ fallbackHref = "/" }) {
	const router = useRouter();

	function handleBack() {
		if (window.history.length > 1) {
			router.back();
			return;
		}

		router.push(fallbackHref);
	}

	return (
		<button
			type="button"
			onClick={handleBack}
			className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:text-white">
			<span aria-hidden="true">←</span>
			<span>Voltar</span>
		</button>
	);
}
