import { z } from 'zod'
import { getBrowserSupabase } from '@/lib/customer-auth'

export const BOOKING_SERVICES = [
  'Free estimate visit',
  'Paver installation',
  'Paver repair',
  'Sealing',
] as const

export const BOOKING_TIMES = [
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
] as const

export type CustomerType = 'individual' | 'business'
export type BookingStatus = 'requested' | 'confirmed' | 'done' | 'cancelled'

export interface CrmCustomer {
  id: string
  customer_type: CustomerType
  first_name: string
  last_name: string
  company_name: string
  display_name: string
  email: string
  phone: string
  address_line1: string
  city: string
  state: string
  zip_code: string
  notes: string
}

export interface BookingRow {
  id: string
  customer_id: string | null
  installer_id: string | null
  crm_customer_id: string | null
  customer_name: string
  service: string
  appointment_date: string
  appointment_time: string
  address_line1: string
  city: string
  state: string
  zip_code: string
  notes: string
  status: BookingStatus
}

export const crmCustomerSchema = z
  .object({
    customer_type: z.enum(['individual', 'business']),
    first_name: z.string().trim(),
    last_name: z.string().trim(),
    company_name: z.string().trim(),
    email: z.string().trim(),
    phone: z.string().trim().min(7, 'Enter a phone number.'),
    address_line1: z.string().trim(),
    city: z.string().trim(),
    state: z.string().trim(),
    zip_code: z.string().trim(),
    notes: z.string().trim(),
  })
  .superRefine((value, context) => {
    if (value.customer_type === 'business' && !value.company_name) {
      context.addIssue({ code: 'custom', message: 'Enter the company name.', path: ['company_name'] })
    }
    if (value.customer_type === 'individual' && !value.first_name) {
      context.addIssue({ code: 'custom', message: 'Enter a first name.', path: ['first_name'] })
    }
    if (value.email && !/^\S+@\S+\.\S+$/.test(value.email)) {
      context.addIssue({ code: 'custom', message: 'Enter a valid email.', path: ['email'] })
    }
  })

export type CrmCustomerInput = z.infer<typeof crmCustomerSchema>

export const bookingSchema = z.object({
  service: z.enum(BOOKING_SERVICES),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date.'),
  appointment_time: z.enum(BOOKING_TIMES),
  address_line1: z.string().trim().min(1, 'Enter the job address.'),
  city: z.string().trim().min(1, 'Enter the city.'),
  state: z.string().trim().min(1, 'Enter the state.'),
  zip_code: z.string().trim().min(1, 'Enter the ZIP code.'),
  notes: z.string().trim(),
})

export type BookingInput = z.infer<typeof bookingSchema>

export function customerDisplayName(input: Pick<CrmCustomerInput, 'customer_type' | 'first_name' | 'last_name' | 'company_name'>) {
  if (input.customer_type === 'business' && input.company_name) return input.company_name
  return `${input.first_name} ${input.last_name}`.replace(/\s+/g, ' ').trim()
}

export function emptyCustomer(): CrmCustomerInput {
  return {
    customer_type: 'individual',
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    phone: '',
    address_line1: '',
    city: '',
    state: '',
    zip_code: '',
    notes: '',
  }
}

function schemaHint(message: string) {
  if (/crm_customers|bookings|account_role/i.test(message)) {
    return 'ProCRM and ProBooking are not in the database yet. Run database/migrations/booking-crm.sql in Supabase, then try again.'
  }
  return message
}

export async function listCrmCustomers(): Promise<CrmCustomer[]> {
  const { data, error } = await getBrowserSupabase()
    .from('crm_customers')
    .select('id, customer_type, first_name, last_name, company_name, display_name, email, phone, address_line1, city, state, zip_code, notes')
    .order('created_at', { ascending: false })
  if (error) throw new Error(schemaHint(error.message))
  return (data ?? []) as CrmCustomer[]
}

export async function saveCrmCustomer(input: CrmCustomerInput, id?: string) {
  const parsed = crmCustomerSchema.parse(input)
  const row = {
    ...parsed,
    display_name: customerDisplayName(parsed),
    updated_at: new Date().toISOString(),
  }
  const supabase = getBrowserSupabase()
  if (id) {
    const { error } = await supabase.from('crm_customers').update(row).eq('id', id)
    if (error) throw new Error(schemaHint(error.message))
    return
  }
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error('Sign in to save a customer.')
  const { error } = await supabase.from('crm_customers').insert({ ...row, installer_id: userData.user.id })
  if (error) throw new Error(schemaHint(error.message))
}

export async function deleteCrmCustomer(id: string) {
  const { error } = await getBrowserSupabase().from('crm_customers').delete().eq('id', id)
  if (error) throw new Error(schemaHint(error.message))
}

export async function listBookings(): Promise<BookingRow[]> {
  const { data, error } = await getBrowserSupabase()
    .from('bookings')
    .select('id, customer_id, installer_id, crm_customer_id, customer_name, service, appointment_date, appointment_time, address_line1, city, state, zip_code, notes, status')
    .order('appointment_date', { ascending: true })
  if (error) throw new Error(schemaHint(error.message))
  return (data ?? []) as BookingRow[]
}

export async function createCustomerBooking(input: BookingInput, customerName: string) {
  const parsed = bookingSchema.parse(input)
  const supabase = getBrowserSupabase()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error('Sign in to request a booking.')
  const { error } = await supabase.from('bookings').insert({
    ...parsed,
    customer_id: userData.user.id,
    customer_name: customerName,
    status: 'requested',
  })
  if (error) throw new Error(schemaHint(error.message))
}

export async function updateBookingStatus(id: string, status: BookingStatus, installerId?: string) {
  const patch: { status: BookingStatus; installer_id?: string } = { status }
  if (installerId && status === 'confirmed') patch.installer_id = installerId
  const { error } = await getBrowserSupabase().from('bookings').update(patch).eq('id', id)
  if (error) throw new Error(schemaHint(error.message))
}
