const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png']);

export function readImageFile(file: File): Promise<string> {
	if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
		return Promise.reject(new Error('La imagen debe estar en formato JPG o PNG.'));
	}

	if (file.size > MAX_IMAGE_SIZE_BYTES) {
		return Promise.reject(new Error('La imagen no puede superar los 5 MB.'));
	}

	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'));
		reader.onload = () => {
			if (typeof reader.result !== 'string') {
				reject(new Error('El archivo de imagen no produjo un resultado válido.'));
				return;
			}

			resolve(reader.result);
		};

		reader.readAsDataURL(file);
	});
}
