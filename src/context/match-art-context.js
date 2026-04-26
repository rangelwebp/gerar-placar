"use client";

import { createContext, useContext, useReducer } from "react";

const NewsArtContext = createContext();

const initialState = {
	type: null, // "placar" | "noticia" | "noticia-portal"
	// placar
	league: "",
	homeTeamId: "",
	awayTeamId: "",
	headline: "RESULTADO FINAL",
	round: "",
	score: "",
	// noticia
	title: "",
	subtitle: "",
	// geral
	imageSrc: "",
	crop: { x: 0, y: 0 },
	zoom: 1,
	croppedAreaPixels: null,
};

function reducer(state, action) {
	switch (action.type) {
		case "SET_TYPE":
			return { ...state, type: action.payload };
		case "UPDATE_FIELD":
			return { ...state, [action.field]: action.value };
		case "UPDATE_FIELDS":
			return { ...state, ...action.fields };
		case "RESET":
			return initialState;
		default:
			return state;
	}
}

export function NewsArtProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	function setType(type) {
		dispatch({ type: "SET_TYPE", payload: type });
	}

	function updateField(field, value) {
		dispatch({ type: "UPDATE_FIELD", field, value });
	}

	function updateFields(fields) {
		dispatch({ type: "UPDATE_FIELDS", fields });
	}

	function reset() {
		dispatch({ type: "RESET" });
	}

	return (
		<NewsArtContext.Provider
			value={{
				newsArt: state,
				setType,
				updateField,
				updateFields,
				reset,
			}}>
			{children}
		</NewsArtContext.Provider>
	);
}

export function useNewsArt() {
	const context = useContext(NewsArtContext);
	if (!context) {
		throw new Error("useNewsArt deve ser usado dentro de NewsArtProvider");
	}
	return context;
}
