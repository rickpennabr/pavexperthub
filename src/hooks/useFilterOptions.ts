import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useFilterOptions() {
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [thicknesses, setThicknesses] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch brands
        const { data: brandData } = await supabase
          .from('brands')
          .select('brand_name')
          .order('brand_name');
        
        if (brandData) {
          setBrands(brandData.map(b => b.brand_name));
        }

        // Fetch product types
        const { data: typeData } = await supabase
          .from('base_products')
          .select('product_type')
          .order('product_type');
        
        if (typeData) {
          setTypes(Array.from(new Set(typeData.map(t => t.product_type))));
        }

        // Fetch thicknesses
        const { data: thicknessData } = await supabase
          .from('thicknesses')
          .select('thickness_mm')
          .order('thickness_mm');
        
        if (thicknessData) {
          setThicknesses(thicknessData.map(t => `${t.thickness_mm}mm`));
        }

        // Fetch colors
        const { data: colorData } = await supabase
          .from('colors')
          .select('color_name')
          .order('color_name');
        
        if (colorData) {
          setColors(colorData.map(c => c.color_name));
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return {
    brands,
    types,
    thicknesses,
    colors,
    loading
  };
} 