"use client";

import { NewsArtProvider } from "@/context/match-art-context";

export default function Providers({ children }) {
	return <NewsArtProvider>{children}</NewsArtProvider>;
}
