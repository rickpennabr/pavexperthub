-- Drop existing table if it exists
DROP TABLE IF EXISTS suppliers CASCADE;

-- Create suppliers table
CREATE TABLE suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on supplier_name for faster searches
CREATE INDEX IF NOT EXISTS suppliers_name_idx ON suppliers (supplier_name);

-- Enable Row Level Security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to suppliers"
    ON suppliers FOR SELECT
    USING (true);

-- Insert some test data
INSERT INTO suppliers (supplier_name) VALUES
    ('Test Supplier 1'),
    ('Test Supplier 2'),
    ('Test Supplier 3'); 