# PEC 3 - Rendimiento, optimizacion y publicacion web

**Nombre:** [TU NOMBRE]

**Asignatura:** [NOMBRE ASIGNATURA]

**Repositorio Git:** [PEGA AQUI LA URL]

**Web publicada:** [PEGA AQUI LA URL]

---

## 1) Tabla y analisis del tiempo de carga

### 1.1 Metodologia de medicion

- Herramienta: DevTools del navegador (pestana Network).
- Perfil de red: Regular 3G.
- Cache: Disabled cache activado.
- Numero de pasadas por URL: 5 recargas por pagina.
- Formula de promedio: suma de tiempos / 5.
- Variables recogidas por pasada: Load (s), Size total, Transferred, numero de requests.

### 1.2 Resultados comparativos (analisis 1, 2 y 3)

| Titulo pagina | URL | Tiempo carga inicial (s) | Tiempo tras lazy/async (s) | Tiempo final tras PSI (s) | Peso total inicial | Peso total intermedio | Peso total final | Transferido inicial | Transferido intermedio | Transferido final | Recursos inicial | Recursos intermedio | Recursos final |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Portada | [URL] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Categoria | [URL] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Detalle 1 | [URL] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Detalle 2 | [URL] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Enlaces | [URL] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### 1.3 Analisis de resultados

- [Describe diferencias porcentuales por pagina]
- [Indica que pagina fue mas beneficiada y por que]
- [Relaciona la mejora con lazy loading, async y optimizaciones PSI]

---

## 2) Primeros cambios (lazy loading + carga asyncrona)

### 2.1 Cambios aplicados en HTML

1. Se anadieron atributos `loading="lazy"` y `decoding="async"` en imagenes no criticas.
2. Se marco una imagen principal por pagina como critica (`loading="eager"` y `fetchpriority="high"`) para no penalizar LCP.
3. Se anadio `loading="lazy"` a iframes de YouTube.
4. Se incluyeron atributos `width` y `height` en imagenes para reducir CLS.
5. Se anadio `defer` al script modulo en todas las paginas.

### 2.2 Cambios aplicados en JavaScript

1. Se reorganizo la inicializacion para ejecutar logica tras `DOMContentLoaded`.
2. Se paso la carga de AOS a importacion dinamica (`import()`) para carga asyncrona diferida.
3. Se retrasa la carga de AOS usando `requestIdleCallback` (con fallback a `setTimeout`).
4. Se anadio soporte para `prefers-reduced-motion`.

### 2.3 Cambios aplicados en estilos

1. Se reforzo estabilidad visual de medios con reglas para `img` e `iframe`.
2. Se garantiza `height: auto` en imagenes de galeria para evitar saltos de layout.

---

## 3) Informe de mejoras (Google PageSpeed Insights)

### 3.1 Tabla de puntuaciones antes/despues

| URL | Movil antes | Movil despues | Escritorio antes | Escritorio despues |
|---|---:|---:|---:|---:|
| [Portada] | [ ] | [ ] | [ ] | [ ] |
| [Categoria] | [ ] | [ ] | [ ] | [ ] |
| [Detalle 1] | [ ] | [ ] | [ ] | [ ] |
| [Detalle 2] | [ ] | [ ] | [ ] | [ ] |
| [Enlaces] | [ ] | [ ] | [ ] | [ ] |

### 3.2 Mejoras sugeridas por PSI y aplicacion tecnica

| Sugerencia PSI | Pagina(s) afectada(s) | Evidencia inicial | Cambio realizado | Evidencia final |
|---|---|---|---|---|
| Properly size images / Reduce image payload | [ ] | [ ] | [ ] | [ ] |
| Defer offscreen images | [ ] | [ ] | Lazy loading aplicado | [ ] |
| Eliminate render-blocking resources | [ ] | [ ] | Carga diferida de JS + import dinamico AOS | [ ] |
| Avoid large layout shifts | [ ] | [ ] | width/height en imagenes y ajustes CSS | [ ] |
| Reduce unused JavaScript | [ ] | [ ] | AOS diferido bajo demanda | [ ] |

### 3.3 Analisis de resultados PSI

- [Explica el cambio en puntuaciones moviles y escritorio]
- [Menciona metricas clave: LCP, CLS, TBT/INP]
- [Indica si quedan recomendaciones y su impacto]

---

## 4) Respuestas tecnicas

### 4.1 Que cambios detectas al aplicar lazy loading a imagenes y como afecta al rendimiento?

Al aplicar lazy loading, en DevTools se observa que muchas imagenes dejan de descargarse en el arranque y pasan a solicitarse mas tarde (cuando entran en viewport). Esto reduce peticiones iniciales, peso transferido inicial y tiempo hasta render util, mejorando especialmente en redes lentas. Como efecto secundario, conviene mantener en carga eager la imagen LCP para no empeorar First/Largest Contentful Paint.

### 4.2 Que sucede al aplicar carga asyncrona a scripts? Que problemas podrian surgir?

La carga asyncrona (defer, async o import dinamico) evita bloquear el parseo del HTML y mejora el inicio de renderizado. El riesgo principal es el orden de ejecucion:

- `async`: ejecuta en cuanto descarga, sin respetar orden, puede romper dependencias.
- `defer`: respeta orden entre scripts defer y ejecuta al final del parseo.
- `import()` dinamico: carga bajo demanda, pero si no se controla el momento de uso puede haber condiciones de carrera.

Para mitigarlo, se inicializa tras `DOMContentLoaded` y se encapsula la logica en funciones idempotentes.

### 4.3 Se podria hacer carga asyncrona de estilos? Que problemas podria haber?

Si, se puede (por ejemplo preload + onload, media hacks o CSS critico inline), pero tiene riesgos:

- FOUC (Flash of Unstyled Content) si el CSS llega tarde.
- Cambios de layout visibles si faltan estilos estructurales al primer render.
- Mayor complejidad de mantenimiento y riesgo de errores de cascada.

En una practica academica multi-pagina suele ser preferible mantener CSS principal sincronico y optimizar tamaño/minificacion antes de introducir estrategias agresivas.

---

## 5) Publicacion en internet

### 5.1 Procedimiento usado

1. Build del proyecto: `npm run build`.
2. Publicacion en el mismo repositorio/dominio de PEC anteriores.
3. Verificacion externa en modo incognito y en movil.

### 5.2 Evidencias

- URL publica: [PEGA AQUI]
- Commit o tag de entrega: [PEGA HASH]
- Fecha y hora de despliegue: [PEGA DATOS]

---

## 6) Conclusiones

- [Resumen cuantitativo de mejora en carga]
- [Resumen de mejora en PSI]
- [Riesgos remanentes y trabajo futuro]

---

## Anexo (opcional)

Incluye capturas de:

- Network con 3G + cache desactivada
- PSI antes y despues por pagina
- Cascada de peticiones (waterfall)
- Metricas clave (LCP, CLS, INP/TBT)
