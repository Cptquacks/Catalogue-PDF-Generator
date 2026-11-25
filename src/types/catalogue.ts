export interface CatalogueProduct {
	id: string;
	name: string;
	description?: string;
	price: number;
	image?: string;
}

export interface Catalogue {
	currency: string;
	products: CatalogueProduct[];
}
