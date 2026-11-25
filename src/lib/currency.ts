export function isSupportedCurrency(currency: string): boolean {
	const normalizedCurrency = currency.trim().toUpperCase();

	return (
		/^[A-Z]{3}$/.test(normalizedCurrency) &&
		Intl.supportedValuesOf('currency').includes(normalizedCurrency)
	);
}

export function createCurrencyFormatter(currency: string): Intl.NumberFormat {
	const normalizedCurrency = currency.trim().toUpperCase();

	if (!isSupportedCurrency(normalizedCurrency)) {
		throw new Error('Introduce un código de moneda ISO 4217 válido, como EUR o USD.');
	}

	return new Intl.NumberFormat('es', {
		style: 'currency',
		currency: normalizedCurrency,
	});
}
