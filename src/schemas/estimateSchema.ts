/**
 * Estimate Form Schema
 * 
 * This schema defines the structure and validation rules for the estimate form.
 * It is used by both the estimate form component and the API route to ensure data consistency.
 * 
 * Key Features:
 * - Validates referral source with predefined options
 * - Handles custom referral input when "Other" is selected
 * - Validates all required fields with appropriate error messages
 * 
 * Used by:
 * - estimate/page.tsx: For form validation and type safety
 * - api/estimate/route.ts: For API request validation
 */

import { z } from 'zod'

export const estimateSchema = z.object({
  // Referral source with predefined options
  referral: z.enum(['Facebook', 'Google', 'Instagram', 'Friend', 'Previous Customer', 'Other'], {
    required_error: 'Please select how you heard about us',
  }),
  // Optional field that becomes required when "Other" is selected
  other_referral: z.string().optional(),
  // Required personal information fields
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .min(1, 'Phone is required')
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX'),
  // Address fields
  address: z.string().min(1, 'Street address is required'),
  city: z.enum(['Las Vegas', 'Henderson', 'North Las Vegas', 'Other'], {
    required_error: 'Please select your city',
  }),
  zip: z.string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  // Optional project description field
  project_description: z.string().optional(),
  // Optional images field
  images: z.array(z.string()).optional(),
  // Optional manual address flag
  isManualAddress: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.referral === 'Other') {
      return data.other_referral && data.other_referral.length > 0;
    }
    return true;
  },
  {
    message: 'Please specify how you heard about us',
    path: ['other_referral'],
  }
);

// TypeScript type derived from the schema for type safety
export type EstimateFormData = z.infer<typeof estimateSchema> 