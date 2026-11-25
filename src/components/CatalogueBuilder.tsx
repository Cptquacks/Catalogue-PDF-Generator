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
			for (const field of form.querySelectorAll<
				HTMLInputElement | HTMLTextAreaElement
			>('[name="name"], [name="price"], [name="description"]')) {
				field.value = '';
			}
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
		<div className="grid grid-cols-1 items-start gap-6 min-[801px]:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
			<form
				className="overflow-hidden rounded-[18px] border border-[#e4eae5] bg-white shadow-[0_12px_40px_rgb(34_54_43_/_5%)]"
				onSubmit={handleAddProduct}
			>
				<section className="p-7 max-[460px]:p-[21px]" aria-labelledby="catalogue-settings-title">
					<div className="mb-6 flex items-center gap-3.5">
						<span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#edf4ef] text-[11px] font-bold text-[#4c8065]">
							01
						</span>
						<div>
							<h2
								className="m-0 text-[17px] font-semibold tracking-[-0.02em]"
								id="catalogue-settings-title"
							>
								Moneda del catálogo
							</h2>
							<p className="mt-1 mb-0 text-xs text-[#758179]">
								Todos los precios se mostrarán en esta moneda.
							</p>
						</div>
					</div>
					<label className="mb-4.5 grid max-w-55 gap-2 text-[13px] font-semibold text-[#26352d]">
						<span>
							Moneda <span className="text-[#b34d3b]">*</span>
						</span>
						<input
							autoComplete="off"
							className="w-full rounded-[9px] border border-[#dfe6e0] bg-white px-3 py-2.75 text-sm font-normal text-[#17251f] outline-none transition focus:border-[#75a087] focus:ring-[3px] focus:ring-[#4c8065]/[0.12]"
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
						<small
							className={`text-[11px] font-normal ${
								currency && !priceFormatter ? 'text-[#9c3e30]' : 'text-[#849087]'
							}`}
						>
							{currency && !priceFormatter
								? 'Introduce un código de moneda ISO 4217 válido.'
								: 'Usa un código de tres letras, por ejemplo EUR o USD.'}
						</small>
					</label>
				</section>

				<section
					className="border-t border-[#edf0ed] p-7 max-[460px]:p-5.25"
					aria-labelledby="product-details-title"
				>
					<div className="mb-6 flex items-center gap-3.5">
						<span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#edf4ef] text-[11px] font-bold text-[#4c8065]">
							02
						</span>
						<div>
							<h2
								className="m-0 text-[17px] font-semibold tracking-[-0.02em]"
								id="product-details-title"
							>
								Añade un producto
							</h2>
							<p className="mt-1 mb-0 text-xs text-[#758179]">
								El nombre y el precio son obligatorios.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-x-3.5 min-[461px]:grid-cols-[minmax(0,1.5fr)_minmax(110px,0.8fr)]">
						<label className="mb-4.5 grid gap-2 text-[13px] font-semibold text-[#26352d]">
							<span>
								Nombre <span className="text-[#b34d3b]">*</span>
							</span>
							<input
								autoComplete="off"
								className="w-full rounded-[9px] border border-[#dfe6e0] bg-white px-3 py-[11px] text-sm font-normal text-[#17251f] outline-none transition placeholder:text-[#9aa49c] focus:border-[#75a087] focus:ring-[3px] focus:ring-[#4c8065]/[0.12]"
								maxLength={120}
								name="name"
								placeholder="Ej. Jarrón de cerámica"
								required
							/>
						</label>
						<label className="mb-[18px] grid gap-2 text-[13px] font-semibold text-[#26352d]">
							<span>
								Precio <span className="text-[#b34d3b]">*</span>
							</span>
							<input
								className="w-full rounded-[9px] border border-[#dfe6e0] bg-white px-3 py-[11px] text-sm font-normal text-[#17251f] outline-none transition placeholder:text-[#9aa49c] focus:border-[#75a087] focus:ring-[3px] focus:ring-[#4c8065]/[0.12]"
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

					<label className="mb-[18px] grid gap-2 text-[13px] font-semibold text-[#26352d]">
						<span>Descripción</span>
						<textarea
							className="min-h-[82px] w-full resize-y rounded-[9px] border border-[#dfe6e0] bg-white px-3 py-[11px] text-sm font-normal text-[#17251f] outline-none transition placeholder:text-[#9aa49c] focus:border-[#75a087] focus:ring-[3px] focus:ring-[#4c8065]/[0.12]"
							maxLength={500}
							name="description"
							placeholder="Materiales, medidas o detalles que quieras destacar"
							rows={3}
						/>
					</label>

					<label className="mb-[18px] grid gap-2 text-[13px] font-semibold text-[#26352d]">
						<span>
							Imagen <span className="text-[11px] font-normal text-[#849087]">(opcional)</span>
						</span>
						<input
							key={imageInputKey}
							accept="image/jpeg,image/png"
							className="w-full rounded-[9px] border border-[#dfe6e0] bg-white p-2.5 text-xs font-normal text-[#69766f] file:mr-3 file:rounded-md file:border-0 file:bg-[#edf4ef] file:px-3 file:py-1.5 file:font-medium file:text-[#355a45]"
							name="image"
							onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
							type="file"
						/>
						<small className="text-[11px] font-normal text-[#849087]">
							JPG o PNG, hasta 5 MB.
						</small>
					</label>

					<button
						className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[#dfe8e1] bg-[#f8faf8] px-4 text-[13px] font-semibold text-[#355a45] transition hover:-translate-y-px hover:bg-[#eff5f0]"
						type="submit"
					>
						<PlusIcon aria-hidden="true" className="size-[17px]" />
						Agregar producto
					</button>
				</section>
			</form>

			<section
				className="rounded-[18px] border border-[#e4eae5] bg-white p-7 shadow-[0_12px_40px_rgb(34_54_43_/_5%)] max-[460px]:p-[21px]"
				aria-labelledby="product-list-title"
			>
				<div className="mb-[18px] flex items-center justify-between">
					<div>
						<p className="mb-[7px] text-[11px] font-bold tracking-[0.14em] text-[#4c8065]">
							TU CATÁLOGO
						</p>
						<h2
							className="m-0 text-[17px] font-semibold tracking-[-0.02em]"
							id="product-list-title"
						>
							Productos
						</h2>
					</div>
					<span className="rounded-full bg-[#f1f5f2] px-2.5 py-[7px] text-[11px] font-semibold text-[#617168]">
						{products.length} {products.length === 1 ? 'producto' : 'productos'}
					</span>
				</div>

				{products.length === 0 ? (
					<p className="m-0 rounded-xl border border-dashed border-[#dfe6e0] px-3.5 py-[27px] text-center text-[13px] text-[#829087]">
						Los productos que agregues aparecerán aquí.
					</p>
				) : (
					<ul className="m-0 grid list-none p-0">
						{products.map((product) => (
							<li
								className="grid grid-cols-[44px_minmax(0,1fr)_32px] items-center gap-[9px] border-b border-[#edf0ed] py-[13px] min-[461px]:grid-cols-[52px_minmax(0,1fr)_auto_32px] min-[461px]:gap-3"
								key={product.id}
							>
								{product.image ? (
									<img
										alt=""
										className="size-11 rounded-[9px] bg-[#f3f5f2] object-cover min-[461px]:size-[52px]"
										src={product.image}
									/>
								) : (
									<div
										aria-hidden="true"
										className="grid size-11 place-items-center rounded-[9px] bg-[#f3f5f2] p-1 text-center text-[9px] text-[#849087] min-[461px]:size-[52px]"
									>
										Sin imagen
									</div>
								)}
								<div className="grid min-w-0 gap-1">
									<strong className="overflow-hidden text-ellipsis text-[13px] whitespace-nowrap">
										{product.name}
									</strong>
									{product.description && (
										<span className="line-clamp-2 text-[11px] leading-[1.4] text-[#7b877f]">
											{product.description}
										</span>
									)}
								</div>
								<strong className="col-start-2 row-start-2 text-xs text-[#376d50] min-[461px]:col-auto min-[461px]:row-auto min-[461px]:whitespace-nowrap">
									{priceFormatter
										? priceFormatter.format(product.price)
										: `${product.price.toFixed(2)} ${currency}`}
								</strong>
								<button
									aria-label={`Eliminar ${product.name}`}
									className="col-start-3 row-span-2 grid size-8 place-items-center rounded-lg border-0 bg-transparent text-[#869188] transition hover:bg-[#fbefed] hover:text-[#a74d3e] min-[461px]:row-span-1"
									onClick={() =>
										setProducts((current) =>
											current.filter((item) => item.id !== product.id),
										)
									}
									type="button"
								>
									<TrashIcon aria-hidden="true" className="size-[17px]" />
								</button>
							</li>
						))}
					</ul>
				)}

				{error && (
					<p
						className="mt-4 rounded-[9px] border border-[#f1d5d0] bg-[#fff8f6] px-3 py-[11px] text-xs leading-normal text-[#9c3e30]"
						role="alert"
					>
						{error}
					</p>
				)}

				<button
					className="mt-[22px] inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] border-0 bg-[#376d50] px-4 text-[13px] font-semibold text-white transition hover:-translate-y-px hover:bg-[#2d5b42] disabled:cursor-not-allowed disabled:opacity-45"
					disabled={products.length === 0 || isExporting || !priceFormatter}
					onClick={handleExport}
					type="button"
				>
					<ArrowDownTrayIcon aria-hidden="true" className="size-[17px]" />
					{isExporting ? 'Generando PDF…' : 'Descargar catálogo PDF'}
				</button>
				<p className="mt-3 mb-0 text-center text-[10px] leading-normal text-[#8a958d]">
					El PDF se genera en tu navegador; tus datos no se envían a un servidor.
				</p>
			</section>
		</div>
	);
}
