'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/schemas/contactSchema'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { User, Mail, Phone, MessageSquare, Image as ImageIcon, ArrowRight, ArrowLeft, MapPin, Map, Hash, Link } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FaRocket } from 'react-icons/fa'
import Image from 'next/image'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Remove the manual FormValues type and use the schema inference
type FormValues = ContactFormData

export default function EstimatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [submissionStatus, setSubmissionStatus] = useState<'submitting' | 'success' | 'error'>('submitting')
  const [error, setError] = useState<string | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      referral: undefined,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: undefined,
      zip: '',
      other_referral: '',
      project_description: '',
      images: [],
    },
    mode: 'onChange',
  })

  const referral = watch('referral')
  
  useEffect(() => {
    setShowOtherInput(referral === 'Other')
    if (referral === 'Other') {
      // Add a small delay to ensure the input is rendered
      setTimeout(() => {
        const otherInput = document.getElementById('other_referral')
        if (otherInput) {
          otherInput.focus()
        }
      }, 100)
    }
  }, [referral])

  // Add loading state management
  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      setSubmissionStatus('error')
      setError('You can only upload up to 5 images')
      return
    }
    setImages(prev => [...prev, ...files])
    // Clear error message if the upload is valid
    setSubmissionStatus('submitting')
    setError(null)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (images: File[], customerName: string): Promise<string[]> => {
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

  // Phone number formatting function
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '')
    
    // Format based on length
    if (numbers.length === 0) return ''
    if (numbers.length <= 3) return `(${numbers}`
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  // Handle phone number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    e.target.value = formatted
    setValue('phone', formatted)
  }

  const validateStep1 = async () => {
    const isStep1Valid = await trigger([
      'referral',
      'other_referral',
      'first_name',
      'last_name',
      'email',
      'phone',
      'address',
      'city',
      'zip'
    ])
    
    if (isStep1Valid) {
      setCurrentStep(2)
    }
  }

  const validateStep2 = async () => {
    // No required fields in step 2, so we can proceed with submission
    return true
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (currentStep === 1) {
      await validateStep1()
      return
    }

    if (currentStep === 2) {
      const isStep2Valid = await validateStep2()
      if (!isStep2Valid) {
        return
      }
    }

    setIsSubmitting(true)
    setSubmissionStatus('submitting')

    try {
      // Upload images if any
      const imageUrls: string[] = []
      if (images.length > 0) {
        try {
          const customerName = `${data.first_name}-${data.last_name}`
          const uploadedUrls = await uploadImages(images, customerName)
          imageUrls.push(...uploadedUrls)
        } catch (error) {
          console.error('Error uploading images:', error)
          throw new Error(error instanceof Error ? error.message : 'Failed to upload images. Please try again.')
        }
      }

      // Prepare form data
      const formData = {
        ...data,
        images: imageUrls,
      }

      // Send form data to API
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

      setSubmissionStatus('success')
      setShowSuccessMessage(true)
      reset()
      setImages([])

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmissionStatus('error')
      setError(error instanceof Error ? error.message : 'Failed to submit form')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle manual city selection
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value
    setValue('city', city as 'Las Vegas' | 'Henderson' | 'North Las Vegas' | 'Other')
    
    if (city === 'Other') {
      setError('We currently only service Las Vegas, Henderson, and North Las Vegas areas.')
    } else {
      setError(null)
    }
  }

  if (isPageLoading) {
    return (
      <div className="w-full bg-white rounded-lg p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (showSuccessMessage) {
    return (
      <div className="w-full bg-white rounded-lg p-8 text-center">
        <div className="bg-green-100 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Thank you for your message! We will get back to you soon. 😊</h2>
          <p className="text-gray-600">Redirecting you to the homepage...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg py-2 px-1 sm:px-30 sm:py-5">
      <h2 className="text-3xl font-bold text-black mb-4 sm:mb-8 text-center">Get a Free Estimate 😊</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 sm:space-y-6">
        {currentStep === 1 ? (
          <>
            {/* Step 1: Contact Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Referral Source */}
              <div className="w-full">
                <div className="flex items-center gap-2 mb-1">
                  <Link className="h-5 w-5 text-red-500" />
                  <label htmlFor="referral" className="text-base font-medium text-black">
                    How did you hear about us? *
                  </label>
                </div>
                <div className="relative">
                  <select
                    id="referral"
                    {...register('referral')}
                    className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 px-4 py-2.5 cursor-pointer bg-black text-white hover:bg-gray-800 focus:bg-black focus:text-white transition-colors duration-200 peer text-sm appearance-none"
                  >
                    <option value="" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5">Pick a Referral</option>
                    <option value="Facebook" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5 hover:bg-white hover:text-black">Facebook</option>
                    <option value="Google" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5 hover:bg-white hover:text-black">Google</option>
                    <option value="Instagram" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5 hover:bg-white hover:text-black">Instagram</option>
                    <option value="Friend" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5 hover:bg-white hover:text-black">Friend</option>
                    <option value="Previous Customer" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5 hover:bg-white hover:text-black">Previous Customer</option>
                    <option value="Other" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5 hover:bg-white hover:text-black">Other</option>
                  </select>
                </div>
                {errors.referral && (
                  <p className="mt-1 text-sm text-red-600">{errors.referral.message}</p>
                )}
              </div>

              {/* Other Referral Input */}
              {showOtherInput && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-5 w-5 text-red-500" />
                    <label htmlFor="other_referral" className="text-base font-medium text-black">
                      Please specify *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="other_referral"
                      {...register('other_referral')}
                      className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer bg-black text-white hover:bg-gray-800 focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
                    />
                  </div>
                  {errors.other_referral && (
                    <p className="mt-1 text-sm text-red-600">{errors.other_referral.message}</p>
                  )}
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
                    <label htmlFor="first_name" className="text-base font-medium text-black">
                      First Name *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="first_name"
                      {...register('first_name')}
                      className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
                    />
                  </div>
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
                    <label htmlFor="last_name" className="text-base font-medium text-black">
                      Last Name *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="last_name"
                      {...register('last_name')}
                      className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
                    />
                  </div>
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
                    <label htmlFor="email" className="text-base font-medium text-black">
                      Email *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      autoComplete="email"
                      className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
                    <label htmlFor="phone" className="text-base font-medium text-black">
                      Phone *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      onChange={handlePhoneChange}
                      placeholder="(702) 555-1234"
                      maxLength={14}
                      className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
                    <label htmlFor="address" className="text-base font-medium text-black">
                      Street Address *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="address"
                      {...register('address')}
                      placeholder="Enter your street address"
                      autoComplete="street-address"
                      className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Map className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
                      <label htmlFor="city" className="text-base font-medium text-black">
                        City *
                      </label>
                    </div>
                    <div className="relative">
                      <select
                        id="city"
                        {...register('city')}
                        onChange={handleCityChange}
                        className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 px-4 py-2.5 cursor-pointer bg-black text-white hover:bg-gray-800 focus:bg-black focus:text-white transition-colors duration-200 peer text-sm appearance-none"
                      >
                        <option value="" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5">Pick a City</option>
                        <option value="Las Vegas" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5 hover:bg-white hover:text-black">Las Vegas</option>
                        <option value="Henderson" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5 hover:bg-white hover:text-black">Henderson</option>
                        <option value="North Las Vegas" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5 hover:bg-white hover:text-black">North Las Vegas</option>
                        <option value="Other" className="bg-black text-white cursor-pointer text-sm px-4 py-2.5 hover:bg-white hover:text-black">Other</option>
                      </select>
                    </div>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="h-5 w-5 text-red-500 transition-transform duration-200 peer-focus:scale-125" />
                      <label htmlFor="zip" className="text-base font-medium text-black">
                        ZIP Code *
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="zip"
                        {...register('zip')}
                        placeholder="89XXX"
                        className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2.5 cursor-pointer focus:bg-black focus:text-white transition-colors duration-200 peer text-sm"
                      />
                    </div>
                    {errors.zip && (
                      <p className="mt-1 text-sm text-red-600">{errors.zip.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={validateStep1}
                  className="relative w-full bg-black text-white px-4 py-3 rounded-md group cursor-pointer"
                >
                  {/* Background animation */}
                  <span className="absolute inset-0 w-0 bg-white group-hover:w-full transition-all duration-300 ease-out z-0 rounded-md"></span>

                  {/* Button content */}
                  <span className="flex items-center justify-center gap-1.5 relative z-10 group-hover:text-black transition-colors duration-300">
                    <span>Next</span>
                    <span className="transition-transform duration-300 group-hover:scale-125">
                      <ArrowRight className="h-5 w-5 transition-transform duration-300" />
                    </span>
                  </span>

                  {/* Border effect */}
                  <span className="absolute inset-0 border-0 group-hover:border-2 group-hover:border-red-500 rounded-md transition-all duration-300 z-20"></span>
                </button>
              </div>

              {/* Show step 1 errors summary if any */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-md">
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>
                        {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Project Details */}
            <div className="space-y-6">
              {/* Project Description */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-5 w-5 text-red-500" />
                  <label htmlFor="project_description" className="text-sm font-medium text-black">
                    Project Description (Optional)
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    id="project_description"
                    rows={4}
                    {...register('project_description')}
                    placeholder="If you provide a good project description with measurements and good pictures we can provide a rough estimate without visiting the job site. If you have any notes about your address, add them here."
                    className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-red-500 focus:ring-red-500 pl-4 pr-4 py-2 cursor-pointer"
                  />
                </div>
                {errors.project_description && (
                  <p className="mt-1 text-sm text-red-600">{errors.project_description.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ImageIcon className="h-5 w-5 text-red-500" />
                  <label className="text-sm font-medium text-black">
                    Project Images (Optional, up to 5)
                  </label>
                </div>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-black border-dashed rounded-md cursor-pointer">
                  <label htmlFor="file-upload" className="w-full h-full cursor-pointer">
                    <div className="space-y-1 text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-red-500" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <span className="relative bg-white rounded-md font-medium text-red-500 hover:text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                          Upload files
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Back and Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="relative w-full bg-black text-white px-4 py-3 rounded-md group cursor-pointer"
                >
                  {/* Background animation */}
                  <span className="absolute inset-0 w-0 bg-white group-hover:w-full transition-all duration-300 ease-out z-0 rounded-md"></span>

                  {/* Button content */}
                  <span className="flex items-center justify-center gap-1.5 relative z-10 group-hover:text-black transition-colors duration-300">
                    <span className="transition-transform duration-300 group-hover:scale-125">
                      <ArrowLeft className="h-5 w-5 transition-transform duration-300" />
                    </span>
                    <span>Back</span>
                  </span>

                  {/* Border effect */}
                  <span className="absolute inset-0 border-0 group-hover:border-2 group-hover:border-red-500 rounded-md transition-all duration-300 z-20"></span>
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full bg-black text-white px-4 py-3 rounded-md group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Background animation */}
                  <span className="absolute inset-0 w-0 bg-white group-hover:w-full transition-all duration-300 ease-out z-0 rounded-md"></span>

                  {/* Button content */}
                  <span className="flex items-center justify-center gap-1.5 relative z-10 group-hover:text-black transition-colors duration-300">
                    <span>{isSubmitting ? 'Submitting...' : 'Get Free Estimate'}</span>
                    <span className="transition-transform duration-300 group-hover:scale-125">
                      <FaRocket className="h-5 w-5 transition-transform duration-300" />
                    </span>
                  </span>

                  {/* Border effect */}
                  <span className="absolute inset-0 border-0 group-hover:border-2 group-hover:border-red-500 rounded-md transition-all duration-300 z-20"></span>
                </button>
              </div>
            </div>
          </>
        )}

        {submissionStatus === 'error' && (
          <div className="rounded-md p-4 bg-red-50 text-red-800">
            <p>{error}</p>
          </div>
        )}
      </form>
    </div>
  )
} 