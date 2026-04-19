export function formatScoreInput(value) {
	const digits = value.replace(/\D/g, "").slice(0, 2);

	if (digits.length <= 1) return digits;
	return `${digits[0]}-${digits[1]}`;
}

export function isValidScore(value) {
	return /^\d-\d$/.test(value);
}
