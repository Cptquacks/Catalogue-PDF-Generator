import { TrashIcon } from '@heroicons/react/24/outline';
import type { CatalogueProduct } from '../../types/catalogue';
import Button from '../ui/Button';

interface ProductListItemProps {
	product: CatalogueProduct;
	formattedPrice: string;
	onRemove: (id: string) => void;
}

export default function ProductListItem({
	product,
	formattedPrice,
	onRemove,
}: ProductListItemProps) {
	return (
		<li className="grid grid-cols-[44px_minmax(0,1fr)_32px] items-center gap-[9px] border-b border-[#edf0ed] py-[13px] min-[461px]:grid-cols-[52px_minmax(0,1fr)_auto_32px] min-[461px]:gap-3">
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
				{formattedPrice}
			</strong>
			<Button
				aria-label={`Eliminar ${product.name}`}
				onClick={() => onRemove(product.id)}
				variant="danger"
			>
				<TrashIcon aria-hidden="true" className="size-[17px]" />
			</Button>
		</li>
	);
}
