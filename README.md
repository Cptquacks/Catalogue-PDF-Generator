# Catalogue PDF Generator

Proyecto mínimo con Astro, React, TypeScript y Heroicons.

Astro usa Vite para el servidor de desarrollo y la compilación, por lo que no
hace falta instalar Vite aparte: sus opciones se configuran en `astro.config.mjs`.

## Estructura

```text
public/                  Recursos estáticos
src/
├── components/          Componentes React reutilizables
├── layouts/             Estructura compartida de páginas Astro
├── lib/
│   ├── images/          Lectura y validación de imágenes
│   └── pdf/             Documento y exportación PDF
├── pages/               Rutas de la aplicación
├── styles/              Estilos globales
└── types/               Modelos de catálogo y tipos de terceros
```

La pantalla permite agregar y quitar productos y descargar el catálogo como PDF
directamente en el navegador. El objeto `Catalogue` requiere `currency: string`;
cada producto requiere nombre y precio. La moneda es un código ISO 4217
obligatorio (por ejemplo, EUR o USD). La imagen (JPG/PNG de hasta 5 MB) y la
descripción son opcionales. Los datos no se envían a un servidor ni persisten al
recargar la página.

La transformación está separada de la interfaz:

- `src/types/catalogue.ts`: modelo tipado del catálogo.
- `src/lib/pdf/build-catalogue-document.ts`: transforma el modelo en la
  definición A4 de pdfmake y contiene la función de descarga.
- `src/lib/images/read-image-file.ts`: valida y convierte imágenes locales a
  Data URL para incrustarlas en el PDF.

Los iconos se importan individualmente desde `@heroicons/react/24/outline` o
`@heroicons/react/24/solid`.

## Desarrollo

```sh
npm run dev
npm run build
npm run preview
```

Para priorizar la caché y ver las solicitudes de red detalladas al instalar
dependencias, usa `npm install --prefer-offline --verbose`.

## Documentación

- [Instalar Astro](https://docs.astro.build/en/install-and-setup/)
- [Integración React de Astro](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Heroicons para React](https://github.com/tailwindlabs/heroicons#react)
- [pdfmake: uso en el navegador](https://pdfmake.github.io/docs/0.3/getting-started/client-side/)
- [pdfmake: definición del documento](https://pdfmake.github.io/docs/0.3/document-definition-object/)
