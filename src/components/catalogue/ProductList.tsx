import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import type { CatalogueProduct } from '../../types/catalogue';
import Button from '../ui/Button';
import ProductListItem from './ProductListItem';

interface ProductListProps {
	products: CatalogueProduct[];
	currency: string;
	priceFormatter: Intl.NumberFormat | null;
	error: string;
	isExporting: boolean;
	onRemove: (id: string) => void;
	onExport: () => void;
}

export default function ProductList({
	products,
	currency,
	priceFormatter,
	error,
	isExporting,
	onRemove,
	onExport,
}: ProductListProps) {
	const canExport = products.length > 0 && priceFormatter !== null && !isExporting;

	return (
		<section
			className="flex flex-col items-center gap-3 rounded-[18px] border border-[#e4eae5] bg-white p-7 shadow-[0_12px_40px_rgb(34_54_43_/_5%)] max-[460px]:p-5.25"
			aria-labelledby="product-list-title"
		>
			<div className="w-full flex items-center justify-between">
				<div>
					<h2
						className="text-[17px] font-semibold tracking-[-0.02em]"
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
				<p className="w-full m-0 rounded-xl border border-dashed border-[#dfe6e0] px-3.5 py-[27px] text-center text-[13px] text-[#829087]">
					Los productos que agregues aparecerán aquí.
				</p>
			) : (
				<ul className="w-full m-0 grid list-none p-0" aria-label="Productos agregados">
					{products.map((product) => (
						<ProductListItem
							formattedPrice={
								priceFormatter?.format(product.price) ??
								`${product.price.toFixed(2)} ${currency}`
							}
							key={product.id}
							onRemove={onRemove}
							product={product}
						/>
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

			<Button
				disabled={!canExport}
				fullWidth
				onClick={onExport}
				variant="primary"
			>
				<ArrowDownTrayIcon aria-hidden="true" className="size-[17px]" />
				{isExporting ? 'Generando PDF…' : 'Descargar catálogo PDF'}
			</Button>
			<p className="text-center text-[10px] leading-normal text-[#8a958d]">
				El PDF se genera en tu navegador, tus datos no se envían a un servidor.
			</p>
		</section>
	);
}
