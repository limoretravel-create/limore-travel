-- Update RLS policies to allow unauthenticated access for CMS
-- Run this SQL in your Supabase SQL Editor if you've removed authentication from the CMS

-- Drop existing policies for packages
DROP POLICY IF EXISTS "Packages are insertable by authenticated users" ON packages;
DROP POLICY IF EXISTS "Packages are updatable by authenticated users" ON packages;
DROP POLICY IF EXISTS "Packages are deletable by authenticated users" ON packages;

-- Create new policies that allow unauthenticated access
CREATE POLICY "Packages are insertable by everyone" ON packages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Packages are updatable by everyone" ON packages
    FOR UPDATE USING (true);

CREATE POLICY "Packages are deletable by everyone" ON packages
    FOR DELETE USING (true);

-- Drop existing policies for cars
DROP POLICY IF EXISTS "Cars are insertable by authenticated users" ON cars;
DROP POLICY IF EXISTS "Cars are updatable by authenticated users" ON cars;
DROP POLICY IF EXISTS "Cars are deletable by authenticated users" ON cars;

-- Create new policies that allow unauthenticated access
CREATE POLICY "Cars are insertable by everyone" ON cars
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Cars are updatable by everyone" ON cars
    FOR UPDATE USING (true);

CREATE POLICY "Cars are deletable by everyone" ON cars
    FOR DELETE USING (true);

