-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on supplier_name for faster searches
CREATE INDEX IF NOT EXISTS suppliers_name_idx ON suppliers (supplier_name);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to suppliers"
    ON suppliers FOR SELECT
    USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Allow authenticated users to insert suppliers"
    ON suppliers FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy for authenticated users to update
CREATE POLICY "Allow authenticated users to update suppliers"
    ON suppliers FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy for authenticated users to delete
CREATE POLICY "Allow authenticated users to delete suppliers"
    ON suppliers FOR DELETE
    TO authenticated
    USING (true); 