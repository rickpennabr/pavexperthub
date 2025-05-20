-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    types TEXT[] NOT NULL,
    category TEXT,
    subcategory TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS suppliers_name_idx ON suppliers (name);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO suppliers (name, address, lat, lng, types, category, description)
VALUES 
    ('Vegas Stone Brokers', '8801 S Las Vegas Blvd, Las Vegas, NV 89123', 36.1699, -115.1398, 
     ARRAY['Travertine', 'Porcelain', 'Pavers'], 'Stone Supplier', 'Premium stone and paver supplier'),
    ('SiteOne Landscape Supply', '6480 Cameron St, Las Vegas, NV 89118', 36.0712, -115.2248,
     ARRAY['Pavers', 'Retaining Walls', 'Landscaping Materials'], 'Landscape Supply', 'Full-service landscape supply company'),
    ('SiteOne Landscape Supply', '4175 W Sunset Rd, Las Vegas, NV 89118', 36.0726, -115.1804,
     ARRAY['Pavers', 'Retaining Walls', 'Landscaping Materials', 'Irrigation'], 'Landscape Supply', 'Full-service landscape supply company'),
    ('SiteOne Landscape Supply', '8125 W Sahara Ave #110, Las Vegas, NV 89117', 36.1433, -115.2643,
     ARRAY['Pavers', 'Retaining Walls', 'Landscaping Materials', 'Lighting'], 'Landscape Supply', 'Full-service landscape supply company'),
    ('Star Nursery - North Las Vegas', '3758 E Craig Rd, North Las Vegas, NV 89030', 36.2397, -115.1035,
     ARRAY['Plants', 'Trees', 'Garden Supplies'], 'Nursery', 'Local nursery and garden center'),
    ('Star Nursery - Rainbow', '8725 S Rainbow Blvd, Las Vegas, NV 89139', 36.0314, -115.2425,
     ARRAY['Plants', 'Trees', 'Garden Supplies'], 'Nursery', 'Local nursery and garden center'),
    ('Star Nursery - Eastern', '9270 S Eastern Ave, Las Vegas, NV 89123', 36.0167, -115.1191,
     ARRAY['Plants', 'Trees', 'Garden Supplies'], 'Nursery', 'Local nursery and garden center'),
    ('Star Nursery - Henderson', '10000 S Eastern Ave, Henderson, NV 89052', 35.9984, -115.1191,
     ARRAY['Plants', 'Trees', 'Garden Supplies'], 'Nursery', 'Local nursery and garden center'),
    ('Star Nursery - Blue Diamond', '5151 Blue Diamond Rd, Las Vegas, NV 89118', 36.0156, -115.2013,
     ARRAY['Plants', 'Trees', 'Garden Supplies'], 'Nursery', 'Local nursery and garden center'); 