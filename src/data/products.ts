export interface Product {
  product_id: string;
  brand: string;
  product_name: string;
  slug: string;
  product_type: string;
  color: string;
  size: string;
  thickness: string;
  thickness_in: number;
  sqft_pallet: number;
  sqft_layer: number;
  lnft_pallet: number;
  layer_pallet: number;
  pcs_pallet: number;
  product_note: string;
  colors_available: string[];
  thicknesses_available: string[];
  product_color_images: string[];
  product_project_images: string[];
  product_image_thumbnail: string;
}

export const products: Product[] = [
  {
    product_id: '13',
    brand: 'Las Vegas Paver',
    product_name: 'Holland Stardust',
    slug: 'holland-stardust',
    product_type: 'Paver',
    color: 'Star Dust',
    size: '10x20',
    thickness: '2.5',
    thickness_in: 2.5,
    sqft_pallet: 130,
    sqft_layer: 20,
    lnft_pallet: 65,
    layer_pallet: 7,
    pcs_pallet: 280,
    product_note: 'Premium Holland pavers in elegant Star Dust finish. Perfect for driveways, walkways, and patios with a classic, timeless appearance.',
    colors_available: ['Star Dust', 'Charcoal', 'Red', 'Tan'],
    thicknesses_available: ['2.5', '3.0'],
    product_color_images: [
      '/images/brands/lasvegaspaver/holland/holland-colors/holland-stardust.png'
    ],
    product_project_images: [
      '/images/brands/lasvegaspaver/holland/holland-projects/holland-stardust-project-1.jpg',
      '/images/brands/lasvegaspaver/holland/holland-projects/holland-stardust-project-2.jpg',
      '/images/brands/lasvegaspaver/holland/holland-projects/holland-stardust-project-3.jpg',
      '/images/brands/lasvegaspaver/holland/holland-projects/holland-stardust-project-4.jpg',
      '/images/brands/lasvegaspaver/holland/holland-projects/holland-stardust-project-5.jpg',
      '/images/brands/lasvegaspaver/holland/holland-projects/holland-stardust-project-6.jpg',
      '/images/brands/lasvegaspaver/holland/holland-projects/holland-stardust-project-7.jpg',
      '/images/brands/lasvegaspaver/holland/holland-projects/holland-stardust-project-8.jpg',
      '/images/brands/lasvegaspaver/holland/holland-projects/holland-stardust-project-9.jpg',
      '/images/brands/lasvegaspaver/holland/holland-projects/holland-stardust-project-10.jpg'
    ],
    product_image_thumbnail: '/images/brands/lasvegaspaver/holland/holland-colors/holland-stardust.png',
  },
  {
    product_id: '14',
    brand: 'Keystone',
    product_name: 'Plaza',
    slug: 'plaza-sierra-blend',
    product_type: 'Paver',
    color: 'Sierra Blend',
    size: '12x12',
    thickness: '2.5',
    thickness_in: 2.5,
    sqft_pallet: 120,
    sqft_layer: 20,
    lnft_pallet: 60,
    layer_pallet: 6,
    pcs_pallet: 240,
    product_note: 'Versatile paver in Sierra Blend color, ideal for patios and walkways.',
    colors_available: ['Sierra Blend', 'Sand Brown Charcoal', 'Tan Brown', 'Sand Brown', 'Antique Pewter', 'Old Town Blend'],
    thicknesses_available: ['2.5'],
    product_color_images: [
      '/images/brands/keystone/plaza/plaza-colors/plaza-sierra-blend.png',
      '/images/brands/keystone/plaza/plaza-colors/plaza-sand-brown-charcoal.png',
      '/images/brands/keystone/plaza/plaza-colors/plaza-tan-brown.png',
      '/images/brands/keystone/plaza/plaza-colors/plaza-sand-brown.png',
      '/images/brands/keystone/plaza/plaza-colors/plaza-antique-pewter.png',
      '/images/brands/keystone/plaza/plaza-colors/plaza-old-town-blend.png'
    ],
    product_project_images: [
      '/images/brands/keystone/plaza/plaza-projects/sierra-blend/plaza-sierra-blend-project-1.jpg',
      '/images/brands/keystone/plaza/plaza-projects/sierra-blend/plaza-sierra-blend-project-2.jpg',
      '/images/brands/keystone/plaza/plaza-projects/sierra-blend/plaza-sierra-blend-project-3.jpg',
      '/images/brands/keystone/plaza/plaza-projects/sierra-blend/plaza-sierra-blend-project-4.JPEG'
    ],
    product_image_thumbnail: '/images/brands/keystone/plaza/plaza-colors/plaza-sierra-blend.png',
  },
  {
    product_id: '1',
    brand: 'Belgard',
    product_name: 'Classic Paver',
    slug: 'classic-paver',
    product_type: 'Paver',
    color: 'Gray',
    size: '12x12',
    thickness: '2.5',
    thickness_in: 2.5,
    sqft_pallet: 120,
    sqft_layer: 20,
    lnft_pallet: 60,
    layer_pallet: 6,
    pcs_pallet: 240,
    product_note: 'Best for patios and walkways.',
    colors_available: ['Gray', 'Tan', 'Red'],
    thicknesses_available: ['2.5', '3'],
    product_color_images: [
      'PC-Gray',
      'PC-Tan',
      'PC-Red'
    ],
    product_project_images: [
      'PI-Project1',
      'PI-Project2'
    ],
    product_image_thumbnail: 'Classic Paver',
  },
  {
    product_id: '2',
    brand: 'Keystone',
    product_name: 'Modern Slab',
    slug: 'modern-slab',
    product_type: 'Slab',
    color: 'Charcoal',
    size: '24x24',
    thickness: '3',
    thickness_in: 3,
    sqft_pallet: 80,
    sqft_layer: 16,
    lnft_pallet: 40,
    layer_pallet: 5,
    pcs_pallet: 100,
    product_note: 'Perfect for driveways.',
    colors_available: ['Charcoal', 'Ivory'],
    thicknesses_available: ['3'],
    product_color_images: [
      'PC-Charcoal',
      'PC-Ivory'
    ],
    product_project_images: [
      'PI-ProjectA',
      'PI-ProjectB'
    ],
    product_image_thumbnail: 'Modern Slab',
  },
  {
    product_id: '3',
    brand: 'Las Vegas Paver',
    product_name: 'Rustic Cobble',
    slug: 'rustic-cobble',
    product_type: 'Cobblestone',
    color: 'Sandstone',
    size: '8x8',
    thickness: '2',
    thickness_in: 2,
    sqft_pallet: 100,
    sqft_layer: 15,
    lnft_pallet: 50,
    layer_pallet: 7,
    pcs_pallet: 300,
    product_note: 'Great for garden paths.',
    colors_available: ['Sandstone', 'Brown', 'Slate'],
    thicknesses_available: ['2'],
    product_color_images: [
      'PC-Sandstone',
      'PC-Brown',
      'PC-Slate'
    ],
    product_project_images: [
      'PI-Garden1',
      'PI-Garden2'
    ],
    product_image_thumbnail: 'Rustic Cobble',
  },
  {
    product_id: '4',
    brand: 'Belgard',
    product_name: 'City Tile',
    slug: 'city-tile',
    product_type: 'Tile',
    color: 'Graphite',
    size: '18x18',
    thickness: '1.5',
    thickness_in: 1.5,
    sqft_pallet: 90,
    sqft_layer: 18,
    lnft_pallet: 30,
    layer_pallet: 5,
    pcs_pallet: 180,
    product_note: 'Ideal for rooftops and balconies.',
    colors_available: ['Graphite', 'White'],
    thicknesses_available: ['1.5'],
    product_color_images: [
      'PC-Graphite',
      'PC-White'
    ],
    product_project_images: [
      'PI-Roof1',
      'PI-Balcony1'
    ],
    product_image_thumbnail: 'City Tile',
  },
  {
    product_id: '5',
    brand: 'Keystone',
    product_name: 'Green Path',
    slug: 'green-path',
    product_type: 'Eco Paver',
    color: 'Olive',
    size: '10x20',
    thickness: '2.25',
    thickness_in: 2.25,
    sqft_pallet: 110,
    sqft_layer: 22,
    lnft_pallet: 55,
    layer_pallet: 6,
    pcs_pallet: 210,
    product_note: 'Eco-friendly and permeable.',
    colors_available: ['Olive', 'Earth'],
    thicknesses_available: ['2.25'],
    product_color_images: [
      'PC-Olive',
      'PC-Earth'
    ],
    product_project_images: [
      'PI-Eco1',
      'PI-Eco2'
    ],
    product_image_thumbnail: 'Green Path',
  },
  {
    product_id: '6',
    brand: 'Las Vegas Paver',
    product_name: 'Desert Stone',
    slug: 'desert-stone',
    product_type: 'Paver',
    color: 'Sand',
    size: '16x16',
    thickness: '2.75',
    thickness_in: 2.75,
    sqft_pallet: 130,
    sqft_layer: 26,
    lnft_pallet: 65,
    layer_pallet: 5,
    pcs_pallet: 260,
    product_note: 'Designed for harsh desert environments.',
    colors_available: ['Sand', 'Terra Cotta', 'Adobe'],
    thicknesses_available: ['2.75'],
    product_color_images: [
      'PC-Sand',
      'PC-TerraCotta',
      'PC-Adobe'
    ],
    product_project_images: [
      'PI-Desert1',
      'PI-Desert2'
    ],
    product_image_thumbnail: 'Desert Stone',
  },
  {
    product_id: '7',
    brand: 'Belgard',
    product_name: 'Heritage Brick',
    slug: 'heritage-brick',
    product_type: 'Brick',
    color: 'Clay Red',
    size: '4x8',
    thickness: '2.25',
    thickness_in: 2.25,
    sqft_pallet: 95,
    sqft_layer: 19,
    lnft_pallet: 285,
    layer_pallet: 5,
    pcs_pallet: 570,
    product_note: 'Classic brick appearance with modern durability.',
    colors_available: ['Clay Red', 'Auburn', 'Burgundy'],
    thicknesses_available: ['2.25'],
    product_color_images: [
      'PC-ClayRed',
      'PC-Auburn',
      'PC-Burgundy'
    ],
    product_project_images: [
      'PI-BrickPath1',
      'PI-BrickWall1'
    ],
    product_image_thumbnail: 'Heritage Brick',
  },
  {
    product_id: '8',
    brand: 'Keystone',
    product_name: 'Boulder Wall',
    slug: 'boulder-wall',
    product_type: 'Retaining Wall',
    color: 'Mountain Gray',
    size: '18x12x9',
    thickness: '9',
    thickness_in: 9,
    sqft_pallet: 40,
    sqft_layer: 8,
    lnft_pallet: 27,
    layer_pallet: 5,
    pcs_pallet: 45,
    product_note: 'Heavy-duty retaining wall for significant elevation changes.',
    colors_available: ['Mountain Gray', 'Sandstone', 'Fieldstone'],
    thicknesses_available: ['9'],
    product_color_images: [
      'PC-MountainGray',
      'PC-RetainingSandstone',
      'PC-Fieldstone'
    ],
    product_project_images: [
      'PI-RetainingWall1',
      'PI-RetainingWall2'
    ],
    product_image_thumbnail: 'Boulder Wall',
  },
  {
    product_id: '9',
    brand: 'Las Vegas Paver',
    product_name: 'Pool Deck Plus',
    slug: 'pool-deck-plus',
    product_type: 'Paver',
    color: 'Cool White',
    size: '12x24',
    thickness: '1.75',
    thickness_in: 1.75,
    sqft_pallet: 144,
    sqft_layer: 24,
    lnft_pallet: 72,
    layer_pallet: 6,
    pcs_pallet: 72,
    product_note: 'Heat-resistant surface ideal for pool surroundings.',
    colors_available: ['Cool White', 'Azure', 'Sandbar'],
    thicknesses_available: ['1.75', '2'],
    product_color_images: [
      'PC-CoolWhite',
      'PC-Azure',
      'PC-Sandbar'
    ],
    product_project_images: [
      'PI-Pool1',
      'PI-Pool2'
    ],
    product_image_thumbnail: 'Pool Deck Plus',
  },
  {
    product_id: '10',
    brand: 'Belgard',
    product_name: 'Euro Cobble',
    slug: 'euro-cobble',
    product_type: 'Cobblestone',
    color: 'Ash Gray',
    size: 'Mixed Sizes',
    thickness: '2.75',
    thickness_in: 2.75,
    sqft_pallet: 105,
    sqft_layer: 21,
    lnft_pallet: 52,
    layer_pallet: 5,
    pcs_pallet: 315,
    product_note: 'European-style cobblestone with multiple shape patterns.',
    colors_available: ['Ash Gray', 'Rustic Brown', 'Midnight Black'],
    thicknesses_available: ['2.75'],
    product_color_images: [
      'PC-AshGray',
      'PC-RusticBrown',
      'PC-MidnightBlack'
    ],
    product_project_images: [
      'PI-EuroCobble1',
      'PI-EuroCobble2'
    ],
    product_image_thumbnail: 'Euro Cobble',
  },
  {
    product_id: '11',
    brand: 'Keystone',
    product_name: 'Garden Edge',
    slug: 'garden-edge',
    product_type: 'Edging',
    color: 'Natural Stone',
    size: '6x12',
    thickness: '2',
    thickness_in: 2,
    sqft_pallet: 70,
    sqft_layer: 14,
    lnft_pallet: 140,
    layer_pallet: 5,
    pcs_pallet: 140,
    product_note: 'Decorative garden edging with natural stone appearance.',
    colors_available: ['Natural Stone', 'Terracotta', 'Charcoal'],
    thicknesses_available: ['2'],
    product_color_images: [
      'PC-NaturalStone',
      'PC-EdgeTerracotta',
      'PC-EdgeCharcoal'
    ],
    product_project_images: [
      'PI-GardenEdge1',
      'PI-GardenEdge2'
    ],
    product_image_thumbnail: 'Garden Edge',
  },
  {
    product_id: '12',
    brand: 'Las Vegas Paver',
    product_name: 'Step Stone Elite',
    slug: 'step-stone-elite',
    product_type: 'Steps',
    color: 'Desert Beige',
    size: '48x16',
    thickness: '6',
    thickness_in: 6,
    sqft_pallet: 64,
    sqft_layer: 16,
    lnft_pallet: 48,
    layer_pallet: 4,
    pcs_pallet: 16,
    product_note: 'Pre-formed step stones for elegant outdoor staircases.',
    colors_available: ['Desert Beige', 'Granite Gray', 'Slate Black'],
    thicknesses_available: ['6'],
    product_color_images: [
      'PC-DesertBeige',
      'PC-GraniteGray',
      'PC-SlateBlack'
    ],
    product_project_images: [
      'PI-Steps1',
      'PI-Steps2'
    ],
    product_image_thumbnail: 'Step Stone Elite',
  },
]; 