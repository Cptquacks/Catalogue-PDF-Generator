import type { TCreatedPdf } from 'pdfmake';
import type { TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
import { createCurrencyFormatter } from '../currency';
import type { Catalogue } from '../../types/catalogue';

const COLORS = {
	ink: '#17251F',
	muted: '#69766F',
	accent: '#4C8065',
	rule: '#E4EAE5',
};

export function buildCatalogueDocument(catalogue: Catalogue): TDocumentDefinitions {
	if (catalogue.products.length === 0) {
		throw new Error('Agrega al menos un producto antes de exportar el catálogo.');
	}

	const currencyFormatter = createCurrencyFormatter(catalogue.currency);
	const rows: TableCell[][] = catalogue.products.map((product) => {
		const details: TableCell = {
			stack: [
				{ text: product.name, style: 'productName' },
				...(product.description
					? [{ text: product.description, style: 'productDescription' }]
					: []),
			],
			border: [false, false, false, false],
			margin: [0, 10, 8, 10],
		};
		const image: TableCell = product.image
			? {
					image: product.image,
					fit: [64, 64],
					width: 64,
					height: 64,
					border: [false, false, false, false],
					margin: [0, 5, 8, 5],
				}
			: {
					text: 'Sin imagen',
					color: COLORS.muted,
					fontSize: 8,
					alignment: 'center',
					border: [false, false, false, false],
					margin: [0, 26, 8, 26],
				};
		const price: TableCell = {
			text: currencyFormatter.format(product.price),
			style: 'price',
			alignment: 'right',
			verticalAlignment: 'middle',
			border: [false, false, false, false],
			margin: [0, 10, 0, 10],
		};

		return [image, details, price];
	});

	return {
		info: {
			title: 'Catálogo de productos',
			subject: 'Catálogo de productos',
		},
		pageSize: 'A4',
		pageMargins: [40, 68, 40, 48],
		defaultStyle: {
			font: 'Roboto',
			fontSize: 10,
			color: COLORS.ink,
		},
		header: (currentPage, pageCount) => ({
			columns: [
				{ text: 'CATÁLOGO', color: COLORS.accent, bold: true, fontSize: 9 },
				{
					text: `${catalogue.products.length} productos`,
					color: COLORS.muted,
					fontSize: 9,
					alignment: 'right',
				},
			],
			margin: [40, 24, 40, 0],
		}),
		footer: (currentPage, pageCount) => ({
			columns: [
				{
					text: `Precios en ${catalogue.currency.trim().toUpperCase()}`,
					color: COLORS.muted,
					fontSize: 8,
				},
				{
					text: `${currentPage} / ${pageCount}`,
					color: COLORS.muted,
					fontSize: 8,
					alignment: 'right',
				},
			],
			margin: [40, 0, 40, 18],
		}),
		content: [
			{ text: 'Productos seleccionados', style: 'title' },
			{
				text: `Creado el ${new Intl.DateTimeFormat('es').format(new Date())}`,
				style: 'subtitle',
				margin: [0, 3, 0, 24],
			},
			{
				table: {
					widths: [72, '*', 92],
					dontBreakRows: true,
					body: rows,
				},
				layout: {
					hLineWidth: (index) => (index === 0 ? 0 : 0.7),
					hLineColor: () => COLORS.rule,
					vLineWidth: () => 0,
					paddingLeft: () => 0,
					paddingRight: () => 0,
					paddingTop: () => 10,
					paddingBottom: () => 10,
				},
			},
		],
		styles: {
			title: {
				fontSize: 25,
				bold: true,
				color: COLORS.ink,
			},
			subtitle: {
				fontSize: 9,
				color: COLORS.muted,
			},
			productName: {
				fontSize: 11,
				bold: true,
				color: COLORS.ink,
			},
			productDescription: {
				fontSize: 9,
				color: COLORS.muted,
				margin: [0, 5, 0, 0],
			},
			price: {
				fontSize: 11,
				bold: true,
				color: COLORS.accent,
			},
		},
	};
}

export async function createCataloguePdf(catalogue: Catalogue): Promise<TCreatedPdf> {
	const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([
		import('pdfmake/build/pdfmake'),
		import('pdfmake/build/vfs_fonts'),
	]);

	pdfMake.addVirtualFileSystem(pdfFonts);
	return pdfMake.createPdf(buildCatalogueDocument(catalogue));
}

export async function exportCataloguePdf(catalogue: Catalogue, fileName: string): Promise<void> {
	await (await createCataloguePdf(catalogue)).download(fileName);
}
