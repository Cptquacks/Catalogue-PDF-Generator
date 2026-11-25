declare module 'pdfmake/build/pdfmake' {
	import type { TCreatedPdf } from 'pdfmake';
	import type { TDocumentDefinitions } from 'pdfmake/interfaces';

	const pdfMake: {
		createPdf(definition: TDocumentDefinitions): TCreatedPdf;
		addVirtualFileSystem(files: Record<string, string>): void;
	};

	export default pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
	const pdfFonts: Record<string, string>;

	export default pdfFonts;
}
