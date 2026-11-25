import { useState, type FormEvent } from 'react';
import { BanknotesIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { isSupportedCurrency } from '../../lib/currency';
import { readImageFile } from '../../lib/images/read-image-file';
import type { CatalogueProduct } from '../../types/catalogue';
import Button from '../ui/Button';
import ImageField from '../ui/ImageField';
import InputField from '../ui/InputField';
import TextAreaField from '../ui/TextAreaField';

type NewProduct = Omit<CatalogueProduct, 'id'>;

interface ProductFormProps {
	currency: string;
	onCurrencyChange: (currency: string) => void;
	onAddProduct: (product: NewProduct) => void;
}

export default function ProductForm({
	currency,
	onCurrencyChange,
	onAddProduct,
}: ProductFormProps) {
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imageInputKey, setImageInputKey] = useState(0);
	const [error, setError] = useState('');
	const currencyIsValid = isSupportedCurrency(currency);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError('');

		if (!currencyIsValid) {
			setError('Introduce un código de moneda ISO 4217 válido.');
			return;
		}

		if (!name.trim()) {
			setError('El nombre del producto es obligatorio.');
			return;
		}

		const numericPrice = Number(price);
		if (!Number.isFinite(numericPrice) || numericPrice < 0) {
			setError('Introduce un precio válido, igual o mayor que cero.');
			return;
		}

		try {
			const image = imageFile ? await readImageFile(imageFile) : undefined;

			onAddProduct({
				name: name.trim(),
				price: numericPrice,
				description: description.trim() || undefined,
				image,
			});
			setName('');
			setPrice('');
			setDescription('');
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

	return (
		<form
			className="overflow-hidden rounded-[18px] border border-[#e4eae5] bg-white shadow-[0_12px_40px_rgb(34_54_43_/_5%)]"
			onSubmit={handleSubmit}
		>
			<section className="p-7 max-[460px]:p-5.25" aria-labelledby="catalogue-settings-title">
				<div className="mb-6 flex items-center gap-3.5">
					<span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#edf4ef] text-[11px] font-bold text-[#4c8065]">
						<BanknotesIcon aria-hidden="true" className="size-6.25" />
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
				<InputField
					autoComplete="off"
					error={currency && !currencyIsValid ? 'Código ISO 4217 no válido.' : undefined}
					hint="Usa un código de tres letras, por ejemplo EUR o USD."
					label="Moneda"
					maxLength={3}
					name="currency"
					onChange={(value) => {
						onCurrencyChange(value.toUpperCase());
						setError('');
					}}
					pattern="[A-Za-z]{3}"
					placeholder="Ej. CUP"
					required
					title="Escribe un código de moneda de tres letras, por ejemplo EUR o USD."
					value={currency}
				/>
			</section>

			<section
				className="border-t border-[#edf0ed] p-7 max-[460px]:p-5.25"
				aria-labelledby="product-details-title"
			>
				<div className="mb-6 flex items-center gap-3.5">
					<span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#edf4ef] text-[11px] font-bold text-[#4c8065]">
						<ShoppingBagIcon aria-hidden="true" className="size-6.25" />
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
					<InputField
						autoComplete="off"
						label="Nombre"
						maxLength={120}
						name="name"
						onChange={setName}
						placeholder="Ej. Jarrón de cerámica"
						required
						value={name}
					/>
					<InputField
						inputMode="decimal"
						label="Precio"
						min={0}
						name="price"
						onChange={setPrice}
						placeholder="0,00"
						required
						step={0.01}
						type="number"
						value={price}
					/>
				</div>

				<TextAreaField
					label="Descripción"
					maxLength={500}
					name="description"
					onChange={setDescription}
					placeholder="Materiales, medidas o detalles que quieras destacar"
					value={description}
				/>

				<ImageField
					onChange={setImageFile}
					resetKey={imageInputKey}
				/>

				{error && (
					<p
						className="mb-4 rounded-[9px] border border-[#f1d5d0] bg-[#fff8f6] px-3 py-[11px] text-xs leading-normal text-[#9c3e30]"
						role="alert"
					>
						{error}
					</p>
				)}
	
				<div className='flex flex-row items-center w-full justify-end'>
				<Button variant="secondary" type="submit">
					<PlusIcon aria-hidden="true" className="size-[17px]" />
					Agregar producto
				</Button>
				</div>
			</section>
		</form>
	);
}
