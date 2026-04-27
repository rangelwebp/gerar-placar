import "./globals.css";
import Providers from "@/components/providers";
import { Sora, Special_Gothic_Expanded_One } from "next/font/google";

const sora = Sora({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"], // Light, Regular, Medium, SemiBold
	display: "swap",
});

const specialGothicExpandedOne = Special_Gothic_Expanded_One({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-special-gothic",
	display: "swap",
});

export const metadata = {
	title: "Gerar Placar",
	description: "Gerador de imagem de resultados do futebol português",
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="pt-BR"
			className={`${sora.variable} ${specialGothicExpandedOne.variable}`}>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
