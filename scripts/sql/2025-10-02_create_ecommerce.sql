-- products
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category VARCHAR,
  status VARCHAR DEFAULT 'active',
  rating NUMERIC DEFAULT 0,
  sales INTEGER DEFAULT 0,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- orders
CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id),
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  shipping_address TEXT,
  payment_method VARCHAR,
  status VARCHAR DEFAULT 'pending',
  total NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- order items
CREATE TABLE IF NOT EXISTS public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id),
  name TEXT,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- useful indexes
CREATE INDEX IF NOT EXISTS idx_products_user ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
