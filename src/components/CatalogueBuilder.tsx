import { useState } from 'react';
import { createCurrencyFormatter, isSupportedCurrency } from '../lib/currency';
import { exportCataloguePdf } from '../lib/pdf/build-catalogue-document';
import type { CatalogueProduct } from '../types/catalogue';
import ProductForm from './catalogue/ProductForm';
import ProductList from './catalogue/ProductList';

export default function CatalogueBuilder() {
	const [currency, setCurrency] = useState('');
	const [products, setProducts] = useState<CatalogueProduct[]>([]);
	const [error, setError] = useState('');
	const [isExporting, setIsExporting] = useState(false);
	const priceFormatter = isSupportedCurrency(currency)
		? createCurrencyFormatter(currency)
		: null;

	function handleAddProduct(product: Omit<CatalogueProduct, 'id'>) {
		setProducts((currentProducts) => [
			...currentProducts,
			{ ...product, id: crypto.randomUUID() },
		]);
	}

	function handleRemoveProduct(id: string) {
		setProducts((currentProducts) =>
			currentProducts.filter((product) => product.id !== id),
		);
	}

	async function handleExport() {
		setError('');

		if (!priceFormatter) {
			setError('Introduce un código de moneda ISO 4217 válido.');
			return;
		}

		if (products.length === 0) {
			setError('Agrega al menos un producto antes de exportar.');
			return;
		}

		setIsExporting(true);
		try {
			await exportCataloguePdf(
				{ currency, products },
				`catalogo-${currency.trim().toLowerCase()}.pdf`,
			);
		} catch (caughtError) {
			setError(
				caughtError instanceof Error
					? caughtError.message
					: 'No se pudo generar el PDF.',
			);
		} finally {
			setIsExporting(false);
		}
	}

	return (
		<div className="grid grid-cols-1 items-start gap-6 min-[801px]:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
			<ProductForm
				currency={currency}
				onAddProduct={handleAddProduct}
				onCurrencyChange={(value) => {
					setCurrency(value);
					setError('');
				}}
			/>
			<ProductList
				currency={currency}
				error={error}
				isExporting={isExporting}
				onExport={handleExport}
				onRemove={handleRemoveProduct}
				priceFormatter={priceFormatter}
				products={products}
			/>
		</div>
	);
}
