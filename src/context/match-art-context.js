"use client";

import { createContext, useContext, useMemo, useState } from "react";

const initialState = {
	league: "",
	homeTeamId: "",
	awayTeamId: "",
	headline: "RESULTADO FINAL",
	round: "",
	score: "",
	imageSrc: "",
	crop: { x: 0, y: 0 },
	zoom: 1,
	croppedAreaPixels: null,
};

const MatchArtContext = createContext(null);

export function MatchArtProvider({ children }) {
	const [formData, setFormData] = useState(initialState);

	function updateField(field, value) {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	}

	function updateFields(values) {
		setFormData((prev) => ({
			...prev,
			...values,
		}));
	}

	function resetForm() {
		setFormData(initialState);
	}

	const value = useMemo(
		() => ({
			formData,
			updateField,
			updateFields,
			resetForm,
		}),
		[formData],
	);

	return (
		<MatchArtContext.Provider value={value}>
			{children}
		</MatchArtContext.Provider>
	);
}

export function useMatchArt() {
	const context = useContext(MatchArtContext);

	if (!context) {
		throw new Error("useMatchArt must be used inside MatchArtProvider");
	}

	return context;
}
