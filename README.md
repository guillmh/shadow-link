# ShadowEZ

ShadowEZ es un sitio de catálogo de productos de tecnología con:
- Catálogo de productos y cards con información básica
- Banner de sponsor destacado
- Último video de YouTube mostrado en la home
- Panel de administración (productos, sponsors, video, etc.)

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4 (CSS-first)
- Supabase

## Setup

```bash
npm install
cp .env.example .env.local
```

Configura las variables en `.env.local` (ver `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key de Supabase

## Scripts

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run start` - Iniciar servidor de producción
- `npm run lint` - Ejecutar linter
- `npm run typecheck` - Comprobar tipos con TypeScript

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Home (catálogo, banner sponsor, último video) |
| `/productos` | Catálogo de productos |
| `/admin/login` | Login de administración |
| `/admin` | Dashboard |
| `/admin/video` | Gestionar último video |
| `/admin/sponsors` | Listado de sponsors |
| `/admin/sponsors/nuevo` | Crear sponsor |
| `/admin/sponsors/[id]/editar` | Editar sponsor |
| `/admin/productos/nuevo` | Crear producto |
| `/admin/productos/[id]/editar` | Editar producto |

## Notas

En Next.js 16, la convención del archivo `middleware` fue renombrada a `proxy`. Tenlo en cuenta si estás siguiendo documentación de versiones anteriores.
