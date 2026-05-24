# Documentacion del proyecto

## 1) Formatos de imagen utilizados

En el proyecto se han utilizado los siguientes formatos:

- SVG para recursos vectoriales propios (iconografia y base de ilustraciones).
- AVIF y WebP como formatos modernos principales para entrega web responsive.
- JPG como fallback para compatibilidad amplia.
- PNG optimizado en casos concretos donde resulto mas eficiente que WebP para un recurso pequeno.

### Tabla de imagenes optimizadas

| Imagen | Formato antiguo | Formato nuevo | Peso antiguo (KB) | Peso nuevo (KB) | Mejora (%) |
|---|---|---|---:|---:|---:|
| banderaes.png | png | webp | 250.08 | 3.07 | 98.77 |
| ntpq.jpg | jpg | webp | 64.75 | 27.36 | 57.75 |
| dg.jpg | jpg | webp | 132.18 | 90.73 | 31.36 |
| s.jpg | jpg | webp | 29.81 | 21.01 | 29.53 |
| Netflix.jpg | jpg | webp | 299.97 | 253.51 | 15.49 |
| Banderain.png | png | png | 10.38 | 9.78 | 5.76 |

### Analisis de resultados

- La mejora media global ha sido del 39.78%.
- En imagenes grandes o de mayor complejidad visual, WebP ha reducido peso de forma clara.
- En recursos pequenos, no siempre WebP es mejor; por eso se mantuvo PNG optimizado en `Banderain.png`.
- Se generaron variantes responsive en AVIF/WebP/JPG para las imagenes principales con `sharp`, priorizando rendimiento sin perder compatibilidad.

## 2) Utilizacion de tecnicas de imagen responsive (Modulo 3)

Se han aplicado varias tecnicas:

- Cambio de resolucion con `srcset` + `sizes` (480w, 960w, 1440w) en tarjetas y galerias.
- Cambio de formato con `picture` + `source type` (AVIF y WebP, con fallback JPG).
- Carga diferida con `loading="lazy"` en imagenes no criticas.
- Ajuste fluido de contenido multimedia con `width: 100%`, `aspect-ratio` y `object-fit`.
- Direccion de arte en detalle con `source media` para usar recortes distintos en movil y escritorio.

## 3) Animacion de elementos en CSS

Se han incorporado animaciones y transiciones:

- Animacion de vapor en SVG de portada mediante `@keyframes`.
- Transiciones de navegacion, botones y tarjetas (`hover`, `focus-visible`).
- Elevacion suave de tarjetas para reforzar jerarquia visual.
- Soporte de accesibilidad para movimiento reducido con `@media (prefers-reduced-motion: reduce)`.

## 4) Uso de clip-path

En portada se ha aplicado `clip-path` a una imagen de tarjeta para crear un recorte poligonal integrado en el diseno. Esta tecnica aporta una composicion visual menos rigida sin romper la legibilidad ni la adaptacion responsive.

## 5) Semantica y accesibilidad

Medidas aplicadas para alinearse con WCAG 2.0 AA:

- Alternativas textuales en imagenes (`alt`) y elementos graficos con rol accesible.
- Enlaces de salto al contenido principal en todas las paginas.
- Estructura semantica coherente (`header`, `nav`, `main`, `section`, `article`, `footer`).
- Titulos de pagina especificos y jerarquia de encabezados consistente.
- Estados de foco visibles con `:focus-visible`.
- Botones de filtrado con estado accesible adicional (`aria-pressed`), evitando depender solo del color.
- Diseno responsive para movil, tableta y escritorio.

## 6) Notas de validacion y build

- Optimizacion de imagenes ejecutada con `npm run optimize:images`.
- Compilacion de proyecto ejecutada con `npm run build`.
- Se recomienda validar HTML y contraste final en una pasada de QA con validador W3C y evaluador WCAG antes de entrega definitiva.
