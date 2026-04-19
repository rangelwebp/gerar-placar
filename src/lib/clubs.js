import clubs from "@/data/clubs.json";
import leagues from "@/data/leagues.json";

export function getLeagueById(leagueId) {
	return leagues.find((league) => league.id === leagueId);
}

export function getFilteredClubsByLeague(leagueId) {
	const selectedLeague = getLeagueById(leagueId);

	if (!selectedLeague) return [];

	if (selectedLeague.type === "cup") {
		return clubs.filter((club) => !club.isB);
	}

	return clubs.filter((club) => club.league === leagueId);
}

export function getClubById(clubId) {
	return clubs.find((club) => club.id === clubId);
}
