export interface ThicknessValue {
  thickness_mm?: string | null
  thickness_in?: string | null
}

export interface VariantFilterFields {
  color?: { color_name?: string | null } | null
  thickness?: ThicknessValue | null
}

export function thicknessLabel(thickness?: ThicknessValue | null) {
  if (!thickness?.thickness_mm && !thickness?.thickness_in) return ''
  return `${thickness.thickness_mm ?? ''}mm (${thickness.thickness_in ?? ''}")`
}

export function variantMatchesFilters(
  variant: VariantFilterFields,
  filters: { color: string; thickness: string },
) {
  if (filters.color) {
    const color = variant.color?.color_name || ''
    if (color.toLowerCase() !== filters.color.toLowerCase()) return false
  }
  if (filters.thickness) {
    if (thicknessLabel(variant.thickness).toLowerCase() !== filters.thickness.toLowerCase()) return false
  }
  return true
}
