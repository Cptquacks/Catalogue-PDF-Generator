import { useState, type FormEvent } from 'react';
import { ArrowDownTrayIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createCurrencyFormatter, isSupportedCurrency } from '../lib/currency';
import { exportCataloguePdf } from '../lib/pdf/build-catalogue-document';
import { readImageFile } from '../lib/images/read-image-file';
import type { CatalogueProduct } from '../types/catalogue';

export default function CatalogueBuilder() {
	const [currency, setCurrency] = useState('');
	const [products, setProducts] = useState<CatalogueProduct[]>([]);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imageInputKey, setImageInputKey] = useState(0);
	const [error, setError] = useState('');
	const [isExporting, setIsExporting] = useState(false);
	const priceFormatter = isSupportedCurrency(currency)
		? createCurrencyFormatter(currency)
		: null;

	async function handleAddProduct(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError('');

		const form = event.currentTarget;
		const formData = new FormData(form);
		const name = String(formData.get('name') ?? '').trim();
		const description = String(formData.get('description') ?? '').trim();
		const price = Number(formData.get('price'));

		if (!name) {
			setError('El nombre del producto es obligatorio.');
			return;
		}

		if (!Number.isFinite(price) || price < 0) {
			setError('Introduce un precio válido, igual o mayor que cero.');
			return;
		}

		try {
			const image = imageFile ? await readImageFile(imageFile) : undefined;

			setProducts((currentProducts) => [
				...currentProducts,
				{
					id: crypto.randomUUID(),
					name,
					description: description || undefined,
					price,
					image,
				},
			]);
			form.reset();
			setImageFile(null);
			setImageInputKey((key) => key + 1);
		} catch (caughtError) {
			setError(
				caughtError instanceof Error
					? caughtError.message
					: 'No se pudo agregar el producto.',
			);
		}
	}

	async function handleExport() {
		setError('');

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
		<div className="builder">
			<form className="product-form" onSubmit={handleAddProduct}>
				<section className="form-section" aria-labelledby="catalogue-settings-title">
					<div className="section-heading">
						<span className="step-number">01</span>
						<div>
							<h2 id="catalogue-settings-title">Moneda del catálogo</h2>
							<p>Todos los precios se mostrarán en esta moneda.</p>
						</div>
					</div>
					<label className="field field-compact">
						<span>Moneda <span className="required">*</span></span>
						<input
							autoComplete="off"
							maxLength={3}
							name="currency"
							onChange={(event) => {
								setCurrency(event.target.value.toUpperCase());
								setError('');
							}}
							pattern="[A-Za-z]{3}"
							placeholder="EUR"
							required
							title="Escribe un código de moneda de tres letras, por ejemplo EUR o USD."
							value={currency}
						/>
						<small className={currency && !priceFormatter ? 'field-hint-error' : ''}>
							{currency && !priceFormatter
								? 'Introduce un código de moneda ISO 4217 válido.'
								: 'Usa un código de tres letras, por ejemplo EUR o USD.'}
						</small>
					</label>
				</section>

				<section className="form-section" aria-labelledby="product-details-title">
					<div className="section-heading">
						<span className="step-number">02</span>
						<div>
							<h2 id="product-details-title">Añade un producto</h2>
							<p>El nombre y el precio son obligatorios.</p>
						</div>
					</div>

					<div className="field-grid">
						<label className="field">
							<span>Nombre <span className="required">*</span></span>
							<input
								autoComplete="off"
								maxLength={120}
								name="name"
								placeholder="Ej. Jarrón de cerámica"
								required
							/>
						</label>
						<label className="field">
							<span>Precio <span className="required">*</span></span>
							<input
								inputMode="decimal"
								min="0"
								name="price"
								placeholder="0,00"
								required
								step="0.01"
								type="number"
							/>
						</label>
					</div>

					<label className="field">
						<span>Descripción</span>
						<textarea
							maxLength={500}
							name="description"
							placeholder="Materiales, medidas o detalles que quieras destacar"
							rows={3}
						/>
					</label>

					<label className="field">
						<span>Imagen <span className="optional">(opcional)</span></span>
						<input
							key={imageInputKey}
							accept="image/jpeg,image/png"
							name="image"
							onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
							type="file"
						/>
						<small>JPG o PNG, hasta 5 MB.</small>
					</label>

					<button className="button button-secondary" type="submit">
						<PlusIcon aria-hidden="true" />
						Agregar producto
					</button>
				</section>
			</form>

			<section className="product-list" aria-labelledby="product-list-title">
				<div className="list-heading">
					<div>
						<p className="eyebrow">TU CATÁLOGO</p>
						<h2 id="product-list-title">Productos</h2>
					</div>
					<span className="product-count">
						{products.length} {products.length === 1 ? 'producto' : 'productos'}
					</span>
				</div>

				{products.length === 0 ? (
					<p className="empty-state">Los productos que agregues aparecerán aquí.</p>
				) : (
					<ul className="product-items">
						{products.map((product) => (
							<li className="product-item" key={product.id}>
								{product.image ? (
									<img alt="" className="product-thumbnail" src={product.image} />
								) : (
									<div aria-hidden="true" className="product-thumbnail product-placeholder">
										Sin imagen
									</div>
								)}
								<div className="product-summary">
									<strong>{product.name}</strong>
									{product.description && <span>{product.description}</span>}
								</div>
								<strong className="product-price">
									{priceFormatter
										? priceFormatter.format(product.price)
										: `${product.price.toFixed(2)} ${currency}`}
								</strong>
								<button
									aria-label={`Eliminar ${product.name}`}
									className="icon-button"
									onClick={() =>
										setProducts((current) =>
											current.filter((item) => item.id !== product.id),
										)
									}
									type="button"
								>
									<TrashIcon aria-hidden="true" />
								</button>
							</li>
						))}
					</ul>
				)}

				{error && <p className="form-error" role="alert">{error}</p>}

				<button
					className="button button-primary"
					disabled={products.length === 0 || isExporting || !priceFormatter}
					onClick={handleExport}
					type="button"
				>
					<ArrowDownTrayIcon aria-hidden="true" />
					{isExporting ? 'Generando PDF…' : 'Descargar catálogo PDF'}
				</button>
				<p className="privacy-note">El PDF se genera en tu navegador; tus datos no se envían a un servidor.</p>
			</section>
		</div>
	);
}
