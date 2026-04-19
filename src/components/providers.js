"use client";

import { MatchArtProvider } from "@/context/match-art-context";

export default function Providers({ children }) {
	return <MatchArtProvider>{children}</MatchArtProvider>;
}
