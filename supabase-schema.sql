-- شغّلي هاد الملف كامل داخل Supabase: SQL Editor > New query > الصقيه ودوسي RUN

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  video_url text,
  created_at timestamp default now()
);

create table product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  size text not null,        -- 40,42,44,46,48,50
  sold_out boolean default false
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  phone text,
  delivery_area text,
  delivery_fee numeric,
  payment_method text,       -- 'cod' or 'card'
  items jsonb not null,      -- [{product_id, name, size, price, qty}]
  total numeric,
  status text default 'جديد',
  created_at timestamp default now()
);

-- تفعيل الوصول العام للقراءة (المنتجات تظهر بالموقع للجميع)
alter table products enable row level security;
alter table product_sizes enable row level security;
create policy "public read products" on products for select using (true);
create policy "public read sizes" on product_sizes for select using (true);

-- السماح بإدخال طلبات من الموقع
alter table orders enable row level security;
create policy "public insert orders" on orders for insert with check (true);
