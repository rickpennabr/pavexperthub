// Brand color mapping
export const brandColors: Record<string, string> = {
  belgard: '#1A3057',
  keystone: '#005596',
  'las vegas paver': '#842B38',
  lvp: '#842B38',
  default: '#000000'
};

// Function to get brand color based on brand name
export const getBrandColor = (brandName: string): string => {
  const normalized = brandName.toLowerCase();
  if (normalized.includes('belgard')) return brandColors.belgard;
  if (normalized.includes('keystone')) return brandColors.keystone;
  if (normalized.includes('las vegas') || normalized.includes('lvp')) return brandColors['las vegas paver'];
  return brandColors.default;
}; 