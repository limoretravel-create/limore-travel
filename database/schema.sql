-- Limore Travel Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    duration TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    max_travelers INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    fuel_type TEXT NOT NULL,
    seats INTEGER NOT NULL DEFAULT 5,
    transmission TEXT NOT NULL DEFAULT 'Auto',
    features TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for packages (public read, authenticated write)
CREATE POLICY "Packages are viewable by everyone" ON packages
    FOR SELECT USING (true);

CREATE POLICY "Packages are insertable by authenticated users" ON packages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Packages are updatable by authenticated users" ON packages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Packages are deletable by authenticated users" ON packages
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for cars (public read, authenticated write)
CREATE POLICY "Cars are viewable by everyone" ON cars
    FOR SELECT USING (true);

CREATE POLICY "Cars are insertable by authenticated users" ON cars
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Cars are updatable by authenticated users" ON cars
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Cars are deletable by authenticated users" ON cars
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for contact_messages (anyone can insert, authenticated can read)
CREATE POLICY "Contact messages are insertable by everyone" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact messages are viewable by authenticated users" ON contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Insert sample data (optional)
INSERT INTO packages (title, destination, duration, price, image_url, description, max_travelers, status) VALUES
('Paris Dream Vacation', 'Paris, France', '7 days', 1299.00, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 'Experience the romance of Paris with our exclusive package', 4, 'published'),
('Tropical Paradise', 'Maldives', '10 days', 2499.00, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', 'Relax in luxury resorts with crystal clear waters', 2, 'published'),
('Cultural Journey', 'Istanbul, Turkey', '5 days', 899.00, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', 'Discover the rich history and culture of Istanbul', 6, 'published')
ON CONFLICT DO NOTHING;

INSERT INTO cars (name, brand, model, price_per_day, image_url, fuel_type, seats, transmission, features, status) VALUES
('Luxury Sedan', 'Mercedes', 'E-Class', 120.00, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'Diesel', 5, 'Auto', ARRAY['GPS', 'AC', 'Bluetooth', 'Leather'], 'published'),
('Compact SUV', 'BMW', 'X3', 150.00, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', 'Petrol', 5, 'Auto', ARRAY['GPS', 'AC', 'Leather', 'Sunroof'], 'published'),
('Economy', 'Toyota', 'Corolla', 50.00, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 'Hybrid', 5, 'Auto', ARRAY['AC', 'USB'], 'published')
ON CONFLICT DO NOTHING;

