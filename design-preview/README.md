# ShadowEZ — Spec de implementación: Glass minimalista

Este documento acompaña a **`design-preview/boceto.html`** (el mockup aprobable).
Describe exactamente qué tocar para llevar el boceto al código real. **No** es código a
copiar/pegar ciegamente: es el contrato de tokens, clases y comportamiento.

> Regla de oro del rediseño: **mismos datos, mismo DOM, misma lógica**. Solo cambia
> presentación (color, radio, sombra, transición). Nada que obligue a reestructurar
> formularios, tablas ni el carrusel.

---

## 0. Dirección de diseño

- **Glassmorphism sobrio**: superficies blancas translúcidas + `backdrop-filter: blur()` +
  borde de 1px claro + sombra suave. Sin exceso de capas: máximo 1 nivel de cristal por
  contenedor.
- **Esquinas redondeadas** con escala consistente (nada de `rounded` a ojo).
- **Transiciones suaves** en botones, enlaces de nav, tarjetas y campos.
- **Se conserva la marca**: acento `#2f6fed`, modo claro, Space Grotesk (display) + Inter
  (body). **JetBrains Mono** queda reservado a etiquetas pequeñas/badges
  (`[ Patrocinado ]`, `[ Admin ]`, `[ Último video ]`, `[ todos ]`, categorías) para no
  perder la identidad de terminal, ahora "domesticada".
- **Mobile-first**: el cristal se apoya en un fondo con degradados suaves para que lea
  bien; se evita abusar de `backdrop-filter` en elementos que se repiten mucho (ver §6).

---

## 1. Tokens — cambios exactos en `src/app/globals.css`

El archivo tiene 28 líneas. Se amplía el bloque `:root` y se añaden utilidades mínimas.
Se **mantienen los nombres de variable existentes** (`--color-*`) para no romper
`@theme inline` ni las clases `bg-background`, `text-ink`, `border-hairline`, etc.

### 1.1 Paleta y superficies (reemplaza el `:root` actual)

```css
:root {
  /* --- Color base (mismos nombres, valores ajustados) --- */
  --color-background: #f4f6fb;              /* antes #fafaf9; frío con tinte azul para que el cristal lea */
  --color-surface: #ffffff;                 /* sigue siendo el sólido (fallback sin backdrop-filter) */
  --color-ink: #14161a;
  --color-muted: #6b7280;
  --color-accent: #2f6fed;
  --color-accent-ink: #1f4fbd;              /* hover del acento */
  --color-hairline: rgba(20, 22, 26, 0.08); /* antes #e5e7eb; ahora translúcido para cristal */
  --color-danger: #dc2626;

  /* --- Cristal --- */
  --glass-bg: rgba(255, 255, 255, 0.62);
  --glass-bg-strong: rgba(255, 255, 255, 0.80);
  --glass-bg-soft: rgba(255, 255, 255, 0.42);
  --glass-border: rgba(255, 255, 255, 0.65);
  --hairline-strong: rgba(20, 22, 26, 0.16);
  --glass-blur: 16px;
  --glass-sat: 145%;

  /* --- Radios --- */
  --radius-xs: 8px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-2xl: 30px;
  --radius-pill: 999px;

  /* --- Sombras --- */
  --shadow-xs: 0 1px 2px rgba(20, 22, 26, 0.05);
  --shadow-sm: 0 2px 8px rgba(20, 22, 26, 0.06), 0 1px 2px rgba(20, 22, 26, 0.04);
  --shadow-md: 0 8px 24px rgba(20, 22, 26, 0.08), 0 2px 6px rgba(20, 22, 26, 0.05);
  --shadow-lg: 0 18px 48px rgba(20, 22, 26, 0.12), 0 4px 12px rgba(20, 22, 26, 0.06);
  --shadow-accent: 0 8px 24px rgba(47, 111, 237, 0.28);

  /* --- Movimiento --- */
  --dur-fast: 140ms;
  --dur-base: 200ms;
  --dur-slow: 320ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.4, 0.5, 1);

  /* Anillo de foco accesible (siempre visible sobre cristal claro) */
  --ring: 0 0 0 2px var(--color-background), 0 0 0 4px rgba(47, 111, 237, 0.55);
}
```

> **Nota sobre `@theme inline`**: los valores nuevos de `--color-*` se siguen mapeando
> igual. Para exponer radios/sombras como utilidades de Tailwind v4, añadir dentro de
> `@theme inline`:
> ```css
> @theme inline {
>   /* ...lo existente... */
>   --radius-md: var(--radius-md);
>   --radius-lg: var(--radius-lg);
>   --radius-xl: var(--radius-xl);
>   --radius-2xl: var(--radius-2xl);
>   --shadow-sm: var(--shadow-sm);
>   --shadow-md: var(--shadow-md);
>   --shadow-lg: var(--shadow-lg);
> }
> ```
> Esto habilita `rounded-xl`, `shadow-md`, etc. Si prefieres no tocar `@theme`, las
> clases se pueden escribir con `rounded-[var(--radius-xl)]`.

### 1.2 Fondo con atmósfera (reemplaza el `body` actual)

Necesario para que el cristal "tenga algo que traslucir". Sin esto, el blur sobre un
fondo plano se ve gris y sucio.

```css
body {
  color: var(--color-ink);
  min-height: 100vh;
  background:
    radial-gradient(58rem 40rem at 8% -10%, rgba(47, 111, 237, 0.16), transparent 60%),
    radial-gradient(46rem 32rem at 112% 4%, rgba(124, 92, 240, 0.14), transparent 55%),
    radial-gradient(50rem 46rem at 50% 118%, rgba(47, 111, 237, 0.10), transparent 60%),
    var(--color-background);
  background-attachment: fixed;
  background-repeat: no-repeat;
}
```

Grano opcional (muy sutil, `pointer-events:none`, sin bloquear clics) — ver boceto §CSS
`body::before`. Se puede omitir si se quiere aún más minimalismo.

### 1.3 Utilidades nuevas (sugeridas, ~40 líneas al final de globals.css)

Se pueden dejar como CSS plano con `@layer utilities` / clases sueltas:

```css
.glass { background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
         -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
         border: 1px solid var(--glass-border); box-shadow: var(--shadow-sm); }
.glass-strong { background: var(--glass-bg-strong); backdrop-filter: blur(22px) saturate(var(--glass-sat));
                -webkit-backdrop-filter: blur(22px) saturate(var(--glass-sat));
                border: 1px solid var(--glass-border); box-shadow: var(--shadow-md); }
.focus-ring:focus-visible { outline: none; box-shadow: var(--ring); }
```

---

## 2. Cambios componente por componente

Todas las rutas son relativas a `src/`. **Dónde dice `rounded-*` significa la clase
Tailwind generada por los tokens de §1.1.**

### 2.1 `components/Hero.tsx`
- Avatar: quitar `border-2 border-gray-200`; envolver en anillo con degradado
  (`p-[3px] rounded-full bg-gradient-to-br from-accent/50 to-[#7c5cf0]/50`) + `shadow-md`.
- `<h1>`: sin cambios de copy; opcional `tracking-tight`.
- Correo (`mailto`): ya tiene hover; añadir `focus-visible` con `--ring`.
- Botones sociales: de `rounded-full bg-gray-100 hover:bg-gray-200` a
  `glass card-interactive` (fondo translúcido, borde `--glass-border`), `transition` con
  `--ease-spring` y `hover:-translate-y-0.5`. Mantener `w-10 h-10` (móvil) y `aria-label`.

### 2.2 `components/SponsorBanner.tsx`
- Contenedor `<a>`: de `border border-hairline` a `glass rounded-lg overflow-hidden
  card-interactive` + `hover:-translate-y-0.5 hover:shadow-lg`. Mantener la franja
  izquierda de acento (`w-1 bg-accent` → `bg-gradient-to-b from-accent to-[#7c5cf0]`).
- Logo: de cuadrado con borde a `rounded-md thumb` (borde `hairline`, fondo sólido blanco
  para que el logo lea sobre cristal).
- `[ Patrocinado ]`: **se conserva** el mono entre corchetes (identidad) → `text-accent`.
- Estado de carga (Skeleton): añadir `rounded-lg glass` al contenedor para no "saltar" al
  cargar.

### 2.3 `components/ProductCard.tsx`
- El bloque de imagen: de `aspect-square border border-hairline` a
  `aspect-square rounded-lg overflow-hidden border border-hairline bg-surface`.
- Badge de categoría: de cuadrado a `badge` (pill mono). Mantener `absolute top-2 left-2`.
- Título/subtítulo: sin cambios; opcional 2 líneas con `line-clamp-2` (ya existe).
- Envolver en `card-interactive group`: `hover:-translate-y-1 hover:shadow-lg` sobre el
  `<a>`. Importante: **el `<a>` ya tiene `aria-label`/`title`** — no tocar.

### 2.4 `components/CategoryFilter.tsx`
- Cada botón: de borde cuadrado a `pill`. Activo = `bg-ink text-background border-ink
  shadow-sm`; inactivo = `bg-glass-soft text-muted border-hairline hover:text-ink
  hover:border-hairline-strong hover:-translate-y-px`.
- **Se conserva** el texto `[ {label} ]` (identidad) y el scroll horizontal con su
  scrollbar custom. Añadir `focus-visible` con `--ring`.
- `transition-colors` → `transition-[color,background-color,border-color,transform]` con
  `--dur-base var(--ease-out)`.

### 2.5 `components/ProductGrid.tsx`
- Contenedor del carrusel: sin cambios estructurales (Embla intacto).
- `fade-right`: ya usa `from-background`; al tener el body degradado, **ajustar** a un
  degradado translúcido para que no corte el cristal, p. ej.
  `bg-gradient-to-l from-background via-background/70 to-transparent`.
- Skeletons: añadir `rounded-lg` en `ProductCardSkeleton`.

### 2.6 `components/MoreProduct.tsx`
- Contenedor: de `border border-hairline bg-surface` a `card card-interactive
  rounded-lg`. Mantener el apilado de avatares con `blur-[1px]`.
- Texto `+N más`: mono → `label-mono text-ink`.

### 2.7 `components/LatestVideo.tsx`
- `[ Último video ]`: se conserva mono.
- Caja 16/9: de `border border-hairline` a `rounded-lg overflow-hidden shadow-md
  border border-glass-border`.
- Botón play: círculo `bg-white/90` → mantener, añadir `hover:scale-105` con
  `--ease-spring` y `focus-visible` con `--ring`. **No tocar** el `onClick`
  (`setReproduciendo`) ni el `<iframe>`.

### 2.8 `components/Pagination.tsx`
- Botones: quitar `hover:underline`; usar color a `text-accent` en hover + `focus-visible`
  `--ring` + `rounded-sm`. Mantener `disabled` (con `opacity-55 cursor-not-allowed`).
- Contador `x / y`: mono, sin cambios.

### 2.9 `app/productos/page.tsx`
- Link `Volver`: añadir `focus-visible --ring`, `hover:-translate-x-0.5`.
- `<h1>` `Todos los productos`: `font-display`, sin cambios de copy.
- Input de búsqueda: `rounded-md field` (ver §3). Mantener `placeholder`, `value` y
  `onChange` intactos.
- Grilla: `gap-4` → `gap-5`; columnas siguen `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`.
- Estado vacío y "Cargando...": mono, sin cambios.

### 2.10 `components/admin/FormField.tsx`
- Label: mono (se conserva), quizá `text-muted` un poco más tenue.
- `<input>`: `rounded-md field` con estados de §3 (`hover`, `focus`, `is-error`).
- Mensaje de error: `font-mono text-[11px] text-danger mt-1.5`.

### 2.11 `components/admin/ProductoForm.tsx` / `SponsorForm.tsx`
- No tocar lógica (RHF + zod, `subirImagen`, `router.push`).
- Preview de imagen/logo: `rounded-md border border-hairline bg-surface`.
- `<input type="file">`: estilizar `::file-selector-button` como botón pill `glass`
  (ver §3).
- Botón submit: `btn btn-primary`, estado `disabled` (`opacity-45`), texto
  `Guardando... / Guardar cambios / Crear producto`. **Conservar** los textos exactos.
- Mensaje de error: `font-mono text-[11px] text-danger`.

### 2.12 `app/admin/(dashboard)/layout.tsx`
- Header: de `border-b border-hairline` a `glass` sticky opcional
  (`sticky top-0 z-20`, con `backdrop-filter`).
- `[ Panel Admin ]`: se conserva mono.
- Nav (`Productos / Sponsors / Video`): usar `nav-link`. **Estado activo**: requiere
  conocer la ruta actual → convertir los `<Link>` a un pequeño client component
  (o usar `usePathname()`), o pasar la clase activa desde un client wrapper. Alternativa
  sin JS: dejarlo como está y solo estilar `hover`. **Recomendado**: extraer
  `<AdminNav />` client con `usePathname()` y `aria-current="page"` en el activo.
- `LogoutButton`: `pg-btn`/texto, conservar `Salir` y el `signOut`.

### 2.13 `app/admin/login/page.tsx`
- Contenedor: `min-h-screen flex items-center justify-center` (ya está) → tarjeta
  `glass-strong rounded-xl p-6 max-w-sm` + `shadow-lg`.
- Inputs: `rounded-md field` (ojo: el login usa `bg-background`; cambiar a `glass-soft`).
- Botón `Ingresar` / `Ingresando...`: `btn btn-primary w-full`. Conservar `required`,
  estado `disabled={loading}`, mensaje `Correo o contraseña incorrectos`.

### 2.14 `app/admin/(dashboard)/page.tsx` y `sponsors/page.tsx`
- Filas: de `border border-hairline p-3` a `arow glass rounded-lg shadow-xs
  hover:-translate-y-0.5 hover:shadow-md`.
- Thumb: `rounded-md`.
- Botones `Nuevo`: `btn btn-primary`.
- Iconos editar/borrar: `icon-btn` (`rounded-md`, hover fondo glass; borrar con variante
  `danger` a rojo). Mantener `aria-label="Editar"` / `"Eliminar"` y el `confirm()`.
- Badge Activo/Inactivo: `badge badge-accent` / `badge badge-muted`.

---

## 3. Estilos de estados de control (usar por componente)

| Elemento | Base | Hover | Active | Focus-visible |
|---|---|---|---|---|
| `.btn-primary` | `bg-ink text-white rounded-pill shadow-xs` | `bg-ink/90 -translate-y-px shadow-md` | `translate-y-0 scale-[0.98]` | `--ring` |
| `.btn-ghost` | `glass-soft border-hairline rounded-pill` | `glass border-hairline-strong -translate-y-px` | `scale-[0.98]` | `--ring` |
| `.btn-accent` | `bg-accent text-white rounded-pill shadow-accent` | `bg-accent-ink -translate-y-px` | `scale-[0.98]` | `--ring` |
| `.pill` | `glass-soft border-hairline rounded-pill text-muted` | `text-ink border-hairline-strong -translate-y-px` | `scale-[0.97]` | `--ring` |
| `.pill.active` | `bg-ink text-white border-ink shadow-sm` | — | — | `--ring` |
| `.field` | `glass-soft border-hairline rounded-md` | `border-hairline-strong bg-glass` | — | `border-accent + 0 0 0 4px accent/14` |
| `.field.is-error` | `border-danger/55 + 0 0 0 4px danger/10` | igual | — | igual |
| `.icon-btn` | `text-muted rounded-md` | `text-ink bg-glass border-hairline -translate-y-px` | `scale-[0.94]` | `--ring` |
| `.icon-btn.danger` | `text-muted` | `text-danger bg-danger/8 border-danger/20` | `scale-[0.94]` | `--ring` |
| `.nav-link` | `text-muted rounded-pill` | `text-ink bg-glass -translate-y-px` | — | `--ring` |
| `.nav-link.active` | `bg-ink text-white shadow-sm` | — | — | `--ring` |
| `.card-interactive` | `card` | `-translate-y-1 shadow-lg border-white/90` | `scale-[0.995]` | `--ring` |
| Deshabilitado | `opacity-45 cursor-not-allowed` | — | — | — |

Timings: hover/color `--dur-base` (200ms); transform de "press" `--dur-fast` (140ms);
entradas más grandes `--dur-slow` (320ms). Easing estándar `--ease-out`; rebote corto en
botones sociales/círculo de play: `--ease-spring`.

---

## 4. Accesibilidad

- **Nunca** quitar el foco: reemplazar `outline` por `--ring` (visible sobre cristal
  claro y sobre acento).
- Mantener `aria-label`/`title` en botones de icono y enlaces sociales.
- `aria-current="page"` en el nav activo del admin.
- Contraste: `--color-muted (#6b7280)` sobre `#f4f6fb` cumple AA para texto ≥12px
  subrayado/no crítico; el texto de cuerpo y títulos usan `--color-ink` (AAA). Los
  `label-mono` de 10–11px son decorativos/etiqueta; si se quiere AA estricto, subir a
  `#5b6472` o `12px`.
- No comunicar estado **solo** por color (Activo/Inactivo ya lleva texto, correcto).

---

## 5. `prefers-reduced-motion`

Añadir al final de `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
  .card-interactive:hover,
  .arow:hover,
  .social:hover,
  .sponsor:hover { transform: none; }
}
```

---

## 6. Plan de optimización móvil (coste de `backdrop-filter`)

`backdrop-filter` es caro en GPU cuando se aplica a **muchos** elementos que se mueven o
repintan. Reglas para que no arrastre el scroll en móvil:

1. **Cristal solo en contenedores estáticos**: header del admin, tarjeta de login, banner
   de sponsor, filas de tabla. **NO** aplicar `blur` a las tarjetas de producto del
   carrusel ni a los ítems de la grilla (se repiten mucho). Para esas usar fondo sólido
   translúcido sin blur:
   `background: rgba(255,255,255,0.7)` + borde `--glass-border` (sin `backdrop-filter`).
2. **`will-change` puntual**: aplicarlo solo durante interacción, no en reposo. Preferible
   delegar la animación a `transform`/`opacity` (compuestas por GPU) y no a `box-shadow`
   cuando haya muchos ítems. El `hover` con sombra es aceptable porque ocurre en 1
   elemento a la vez.
3. **`translateZ(0)` / `transform: translate3d`** en el contenedor con blur estático una
   sola vez para promoverlo a su propia capa (evita repaints al hacer scroll).
4. **`@media (max-width: 640px)`**: opcionalmente bajar `--glass-blur` a `10px` y subir la
   opacidad del fondo (`--glass-bg: rgba(255,255,255,0.72)`) para compensar y reducir
   coste.
5. **Fallback `@supports not (backdrop-filter: blur(1px))`**: usar
   `background: rgba(255,255,255,0.92)` (casi opaco) para que siga leyendo en navegadores
   sin soporte.
6. Mantener `background-attachment: fixed` **solo** si no genera jank; si el scroll en iOS
   se siente pesado, mover los degradados a un `::before` fijo con `will-change: transform`.
7. La grilla de `/productos` ya cambia a 3 columnas en `sm`; en móvil (2 columnas) reducir
   `gap` a `gap-3` y evitar sombras grandes por tarjeta (una sombra `--shadow-xs` basta).

---

## 7. Checklist de interacciones que NO deben romperse

- [ ] **RHF + zod** (ProductoForm, SponsorForm, AdminVideo): `register`, `handleSubmit`,
      `formState.errors` y `reset` funcionando; los `label` siguen asociados (usar `htmlFor`
     / `id` si se separan visualmente).
- [ ] **`subirImagen`** y previews (imagen/logo) sin cambios de flujo.
- [ ] **Embla carousel** (`ProductGrid`): `emblaRef` en el mismo contenedor
      `overflow-hidden`; no moverlo ni ponerle `backdrop-filter` (rompe el drag en algunos
      navegadores). Mantener `dragFree`, `pointer` events.
- [ ] **`CategoryFilter.onChange`** y reset de página en `/productos` (`handleCategoriaChange`,
      `handleBusquedaChange`).
- [ ] **`Pagination.onChange`** + `disabled` en extremos.
- [ ] **Búsqueda**: `onChange` actualiza `busqueda` y pagina a 1.
- [ ] **Delete con `confirm()`** en productos y sponsors (no sustituir por modal sin pedir
      aprobación; el mock solo estiliza el botón).
- [ ] **`alert()`** de error al eliminar (productos/sponsors).
- [ ] **Login**: `required`, `disabled={loading}`, mensaje de error, `router.push("/admin")`.
- [ ] **LogoutButton**: `supabase.auth.signOut()` → `/admin/login`.
- [ ] **LatestVideo**: `reproduciendo` alterna `iframe` con `autoplay=1`; el botón play
      mantiene su `aria-label="Reproducir video"`.
- [ ] **Links externos**: `target="_blank" rel="noopener noreferrer"` intactos.
- [ ] **Nav admin activo** (nuevo): `aria-current="page"` en la ruta actual.
- [ ] **`next/image`**: no quitar `sizes`/`fill`; el redondeo va en el contenedor con
      `overflow-hidden`, no en el `Image` (para no romper el layout de `fill`).
- [ ] **Estados de carga** (Skeleton, "Cargando...") siguen apareciendo.

---

## 8. Trade-offs y decisiones abiertas

1. **Fondo tintado (`#f4f6fb`) en vez de `#fafaf9`**: mejora mucho la legibilidad del
   cristal, pero cambia ligeramente el "blanco cálido" actual. Si se prefiere conservar el
   blanco original, el glass leerá más gris → subir la opacidad de `--glass-bg`.
2. **`backdrop-filter` limitado**: por rendimiento, las tarjetas de producto (muchas,
   repetidas) usan translucidez **sin** blur. Visualmente casi idéntico, mucho más barato
   en móvil.
3. **Corchetes `[ ]` conservados**: mantiene identidad de terminal dentro de la estética
   minimalista. Si se decide quitarlos, el reemplazo es directo (`{label}` sin corchetes).
   No se cambió ningún copy en el mock.
4. **Nav activo requiere JS mínimo**: hoy el layout es server component; para el estado
   activo óptimo hace falta un `<AdminNav />` cliente con `usePathname()`. Alternativa sin
   JS: solo hover (pierde la señal de "dónde estoy").
5. **Fuentes**: el mock usa stacks con fallback (Space Grotesk/Inter/JetBrains Mono
   primero) porque es **offline sin CDN**. En la app real se siguen cargando con
   `next/font/google` (ya configurado en `layout.tsx`); no hay cambio ahí.
6. **Grano de fondo**: incluido en el mock como opción; añade textura pero también un
   pequeño coste de pintado. Se puede omitir sin afectar al resto.

---

## 9. Cómo validar el boceto

Abre `design-preview/boceto.html` directamente en el navegador (doble clic) — es un único
archivo autocontenido, sin CDN, sin build. Secciones: (a) Home, (b) /productos, (c) Admin
dashboard, (d) formulario + login, (e) móvil. Los estados `:hover` se ven al pasar el
cursor; en (c) además hay una fila con estados forzados (hover / focus / disabled).
