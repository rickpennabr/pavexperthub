import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Uploads multiple images to Supabase storage
 * @param images - Array of image files to upload
 * @param customerName - Customer's name to create a unique folder
 * @returns Promise<string[]> - Array of public URLs for the uploaded images
 * @throws Error if upload fails
 */
export const uploadImages = async (images: File[], customerName: string): Promise<string[]> => {
  const uploadedUrls: string[] = []
  
  // Create a unique folder name using customer name and timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const folderName = `${customerName.replace(/\s+/g, '-').toLowerCase()}_${timestamp}`
  
  for (const image of images) {
    const fileExt = image.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `project-images/${folderName}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('contacts')
      .upload(filePath, image)

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('contacts')
      .getPublicUrl(filePath)

    uploadedUrls.push(publicUrl)
  }

  return uploadedUrls
}

/**
 * Submits form data to the API
 * @param formData - The form data to submit
 * @returns Promise<void>
 * @throws Error if submission fails
 */
export const submitFormData = async (formData: unknown): Promise<void> => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to submit form')
  }
} 