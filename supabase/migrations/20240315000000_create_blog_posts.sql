-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    read_time TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT false,
    slug TEXT UNIQUE NOT NULL
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public blog posts are viewable by everyone"
    ON blog_posts FOR SELECT
    USING (published = true);

CREATE POLICY "Authors can insert their own blog posts"
    ON blog_posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own blog posts"
    ON blog_posts FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own blog posts"
    ON blog_posts FOR DELETE
    USING (auth.uid() = author_id);

-- Create function to generate slug
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'))
           || '-' || EXTRACT(EPOCH FROM NOW())::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate slug
CREATE OR REPLACE FUNCTION set_blog_post_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL THEN
        NEW.slug := generate_slug(NEW.title);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_blog_post_slug_trigger
    BEFORE INSERT ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION set_blog_post_slug(); 