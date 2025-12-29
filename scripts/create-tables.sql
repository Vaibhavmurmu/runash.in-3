-- Create users table (if not exists from NextAuth)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create streams table
CREATE TABLE IF NOT EXISTS streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'live', 'ended')),
  platform TEXT NOT NULL,
  stream_key TEXT UNIQUE NOT NULL,
  viewer_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

-- Create recordings table
CREATE TABLE IF NOT EXISTS recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER NOT NULL, -- in seconds
  file_size BIGINT NOT NULL, -- in bytes
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('chat', 'donation', 'follow', 'subscription')),
  platform TEXT NOT NULL,
  metadata JSONB, -- for storing additional data like donation amount
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create grocery_products table
CREATE TABLE IF NOT EXISTS grocery_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  price_inr DECIMAL(10,2),
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT,
  images TEXT[],
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  unit TEXT NOT NULL,
  min_order_quantity INTEGER DEFAULT 1,
  max_order_quantity INTEGER DEFAULT 10,
  is_organic BOOLEAN DEFAULT false,
  is_fresh_produce BOOLEAN DEFAULT false,
  expiry_date TIMESTAMP,
  harvest_date TIMESTAMP,
  origin TEXT,
  certifications TEXT[],
  sustainability_score DECIMAL(3,1),
  carbon_footprint DECIMAL(5,2),
  farm_info JSONB,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  tags TEXT[],
  is_on_sale BOOLEAN DEFAULT false,
  sale_price DECIMAL(10,2),
  sale_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create grocery_orders table
CREATE TABLE IF NOT EXISTS grocery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'INR')),
  delivery_address JSONB NOT NULL,
  delivery_date TIMESTAMP,
  delivery_time_slot TEXT,
  payment_method TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  tracking_number TEXT,
  estimated_delivery TIMESTAMP,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create grocery_order_items table
CREATE TABLE IF NOT EXISTS grocery_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES grocery_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES grocery_products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'INR'))
);

-- Create live_shopping_sessions table
CREATE TABLE IF NOT EXISTS live_shopping_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES streams(id) ON DELETE CASCADE,
  featured_products UUID[] DEFAULT '{}',
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  session_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_streams_user_id ON streams(user_id);
CREATE INDEX IF NOT EXISTS idx_streams_status ON streams(status);
CREATE INDEX IF NOT EXISTS idx_recordings_stream_id ON recordings(stream_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_stream_id ON chat_messages(stream_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_grocery_products_category ON grocery_products(category);
CREATE INDEX IF NOT EXISTS idx_grocery_products_in_stock ON grocery_products(in_stock);
CREATE INDEX IF NOT EXISTS idx_grocery_orders_user_id ON grocery_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_grocery_orders_status ON grocery_orders(status);
CREATE INDEX IF NOT EXISTS idx_grocery_order_items_order_id ON grocery_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_live_shopping_sessions_stream_id ON live_shopping_sessions(stream_id);
