begin;

-- Evita que una escritura concurrente quede fuera de la importación.
set local lock_timeout = '5s';
lock table public.productos in access exclusive mode;

create table public.categorias (
  id bigint generated always as identity primary key,
  nombre text not null unique check (nombre <> '' and nombre = btrim(nombre))
);

create unique index categorias_nombre_unico
  on public.categorias (lower(nombre));

alter table public.productos alter column categoria drop not null;

-- Conserva una grafía por categoría e importa las asignaciones existentes.
insert into public.categorias (nombre)
select distinct on (lower(btrim(categoria))) btrim(categoria)
from public.productos
where btrim(categoria) <> ''
order by lower(btrim(categoria)), btrim(categoria);

update public.productos as producto
set categoria = categoria.nombre
from public.categorias as categoria
where lower(btrim(producto.categoria)) = lower(categoria.nombre)
  and producto.categoria is distinct from categoria.nombre;

update public.productos set categoria = null where btrim(categoria) = '';

alter table public.productos
  add constraint productos_categoria_fk foreign key (categoria)
  references public.categorias (nombre) on update cascade on delete set null;

create index if not exists productos_categoria_fk_idx on public.productos (categoria);

alter table public.categorias enable row level security;
revoke all on public.categorias from anon, authenticated;
grant select, insert, update, delete on public.categorias to authenticated;
grant usage on sequence public.categorias_id_seq to authenticated;

create policy categorias_gestion_admin
  on public.categorias for all to authenticated
  using (true) with check (true);

-- Mantiene las políticas actuales y oculta los productos sin categoría al rol público.
alter table public.productos enable row level security;
create policy productos_publicos_con_categoria
  on public.productos as restrictive for select to anon
  using (categoria is not null);

commit;
