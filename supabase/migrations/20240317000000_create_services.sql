-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    link TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS services_name_idx ON services (name);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access only
CREATE POLICY "Allow public read access to services"
    ON services FOR SELECT
    USING (true); 