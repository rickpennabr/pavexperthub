// ============================================================================
// Utility Functions for Product Detail Image Components
// These functions are used across multiple components in the product detail image section
// to handle image paths, placeholders, and type checking.
// ============================================================================

/**
 * Determines if an image is a placeholder and what type it is
 * Used by DiamondImage and MainDiamondImage components to render appropriate content
 * @param src - The image source string
 * @returns 'PI' for project image placeholder, 'PC' for color image placeholder, or null for real images
 */
export function getPlaceholderType(src: string) {
  if (src.includes('PI-')) return 'PI';
  if (src.includes('PC-')) return 'PC';
  return null;
}

/**
 * Checks if the given path is a real image file
 * Used by all image components to determine if they should render a real image or placeholder
 * @param src - The image source string
 * @returns boolean indicating if the path is a real image file
 */
export function isRealImagePath(src: string) {
  return src.includes('/images/') || src.includes('.jpg') || src.includes('.png') || src.includes('.jpeg');
}

/**
 * Formats the image path for Next.js Image component
 * Ensures all image paths have a leading slash for proper Next.js Image handling
 * @param src - The image source string
 * @returns properly formatted path for Next.js Image component
 */
export function getImagePath(src: string) {
  if (src.startsWith('/')) {
    return src; // Path is already correct for Next.js Image component
  }
  return `/${src}`; // Add leading slash if missing
}

/**
 * Generates placeholder image identifiers
 * Used by ProductDetailImageSection to fill empty slots in image galleries
 * @param count - Number of placeholders to generate
 * @param type - Type of placeholder ('PI' for project, 'PC' for color)
 * @returns Array of placeholder identifiers
 */
export function generatePlaceholders(count: number, type: 'PI' | 'PC'): string[] {
  return Array.from({ length: count }, (_, i) => `${type}-${i + 1}`);
} 