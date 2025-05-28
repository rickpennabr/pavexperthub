import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { estimateSchema } from '@/schemas/estimateSchema'
import { ZodError } from 'zod'
import sgMail from '@sendgrid/mail'
import { v4 as uuidv4 } from 'uuid'

// Debug environment variables
console.log('Environment variables status:', {
  hasSendGridKey: !!process.env.SENDGRID_API_KEY,
  hasEmailTo: !!process.env.EMAIL_TO,
  hasEmailFrom: !!process.env.EMAIL_FROM,
  sendGridKeyLength: process.env.SENDGRID_API_KEY?.length,
  emailTo: process.env.EMAIL_TO,
  emailFrom: process.env.EMAIL_FROM,
});

// Initialize SendGrid only if API key is available
if (process.env.SENDGRID_API_KEY) {
  console.log('Initializing SendGrid with API key');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.log('SendGrid API key is missing');
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    console.log('Received form data:', JSON.stringify(body, null, 2))

    // Validate the request data
    const validatedData = estimateSchema.parse(body)
    console.log('Validated data:', JSON.stringify(validatedData, null, 2))

    // Log Supabase configuration
    console.log('Supabase configuration:', {
      url: supabaseUrl,
      hasKey: !!supabaseKey,
      keyLength: supabaseKey?.length,
      urlLength: supabaseUrl?.length
    })

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      })
      throw new Error('Missing Supabase configuration. Please check your environment variables.')
    }

    // Insert the estimate into the database
    console.log('Attempting to insert into Supabase:', {
      table: 'estimates',
      data: {
        referral: validatedData.referral,
        other_referral: validatedData.other_referral,
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        zip: validatedData.zip,
        project_description: validatedData.project_description,
        images: validatedData.images,
        created_at: new Date().toISOString(),
      }
    })

    const { data, error } = await supabase
      .from('estimates')
      .insert([
        {
          referral: validatedData.referral,
          other_referral: validatedData.other_referral,
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address,
          city: validatedData.city,
          zip: validatedData.zip,
          project_description: validatedData.project_description,
          images: validatedData.images,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        stack: error.stack,
        table: 'estimates',
        operation: 'insert',
        error
      })
      
      // Return a more detailed error response
      return NextResponse.json(
        { 
          error: 'Failed to save estimate',
          details: error.message,
          code: error.code,
          hint: error.hint,
          table: 'estimates',
          operation: 'insert',
          fullError: error
        },
        { status: 500 }
      )
    }

    console.log('Successfully inserted into Supabase:', data)

    // Send email notifications only if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_TO && process.env.EMAIL_FROM) {
      console.log('Attempting to send email notifications...')
      try {
        // Send confirmation email to customer
        const customerMsg = {
          to: validatedData.email,
          from: {
            email: process.env.EMAIL_FROM,
            name: 'PavExpert Hub'
          },
          subject: 'Thank you for your estimate request - PavExpert Hub',
          text: `Dear ${validatedData.first_name},

Thank you for requesting an estimate from PavExpert Hub. We have received your request and will review it shortly.

Here's a summary of your request:
- Name: ${validatedData.first_name} ${validatedData.last_name}
- Address: ${validatedData.address}, ${validatedData.city}, ${validatedData.zip}
- Phone: ${validatedData.phone}
- Project Description: ${validatedData.project_description || 'Not provided'}

We will contact you within 24-48 hours to discuss your project in more detail.

Best regards,
PavExpert Hub Team`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <h2 style="color: #333; margin-bottom: 20px;">Thank you for your estimate request</h2>
              
              <p style="color: #666; line-height: 1.6;">Dear ${validatedData.first_name},</p>
              
              <p style="color: #666; line-height: 1.6;">Thank you for requesting an estimate from PavExpert Hub. We have received your request and will review it shortly.</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #333; margin-bottom: 10px;">Request Summary:</h3>
                <ul style="list-style: none; padding: 0; color: #666;">
                  <li style="margin-bottom: 8px;"><strong>Name:</strong> ${validatedData.first_name} ${validatedData.last_name}</li>
                  <li style="margin-bottom: 8px;"><strong>Address:</strong> ${validatedData.address}, ${validatedData.city}, ${validatedData.zip}</li>
                  <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${validatedData.phone}</li>
                  <li style="margin-bottom: 8px;"><strong>Project Description:</strong> ${validatedData.project_description || 'Not provided'}</li>
                </ul>
              </div>
              
              <p style="color: #666; line-height: 1.6;">We will contact you within 24-48 hours to discuss your project in more detail.</p>
              
              <p style="color: #666; line-height: 1.6; margin-top: 30px;">Best regards,<br>PavExpert Hub Team</p>
            </div>
          `,
          headers: {
            'X-Entity-Ref-ID': uuidv4(),
            'X-SMTPAPI': JSON.stringify({
              filters: {
                bypass_list_management: { settings: { enable: 1 } },
                clicktrack: { settings: { enable: 0 } },
                opentrack: { settings: { enable: 0 } }
              }
            })
          }
        }

        // Send notification email to admin
        const adminMsg = {
          to: process.env.EMAIL_TO,
          from: {
            email: process.env.EMAIL_FROM,
            name: 'PavExpert Hub'
          },
          subject: 'New Estimate Request - PavExpert Hub',
          text: `New estimate request received:

Name: ${validatedData.first_name} ${validatedData.last_name}
Email: ${validatedData.email}
Phone: ${validatedData.phone}
Address: ${validatedData.address}, ${validatedData.city}, ${validatedData.zip}
Project Description: ${validatedData.project_description || 'Not provided'}
Referral Source: ${validatedData.referral}${validatedData.other_referral ? ` (${validatedData.other_referral})` : ''}

Images: ${validatedData.images?.length ? validatedData.images.join('\n') : 'No images provided'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <h2 style="color: #333; margin-bottom: 20px;">New Estimate Request</h2>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #333; margin-bottom: 10px;">Customer Details:</h3>
                <ul style="list-style: none; padding: 0; color: #666;">
                  <li style="margin-bottom: 8px;"><strong>Name:</strong> ${validatedData.first_name} ${validatedData.last_name}</li>
                  <li style="margin-bottom: 8px;"><strong>Email:</strong> ${validatedData.email}</li>
                  <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${validatedData.phone}</li>
                  <li style="margin-bottom: 8px;"><strong>Address:</strong> ${validatedData.address}, ${validatedData.city}, ${validatedData.zip}</li>
                  <li style="margin-bottom: 8px;"><strong>Project Description:</strong> ${validatedData.project_description || 'Not provided'}</li>
                  <li style="margin-bottom: 8px;"><strong>Referral Source:</strong> ${validatedData.referral}${validatedData.other_referral ? ` (${validatedData.other_referral})` : ''}</li>
                </ul>
              </div>
              
              ${validatedData.images?.length ? `
                <div style="margin-top: 20px;">
                  <h3 style="color: #333; margin-bottom: 10px;">Project Images:</h3>
                  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                    ${validatedData.images.map((url: string) => `
                      <img src="${url}" alt="Project image" style="width: 100%; height: auto; border-radius: 4px; border: 1px solid #e0e0e0;">
                    `).join('')}
                  </div>
                </div>
              ` : '<p style="color: #666;">No images provided</p>'}
              
              <p style="margin-top: 30px; color: #666; font-size: 0.9em;">Sent from: ${process.env.EMAIL_FROM}</p>
            </div>
          `,
          headers: {
            'X-Entity-Ref-ID': uuidv4(),
            'X-SMTPAPI': JSON.stringify({
              filters: {
                bypass_list_management: { settings: { enable: 1 } },
                clicktrack: { settings: { enable: 0 } },
                opentrack: { settings: { enable: 0 } }
              }
            })
          }
        }

        console.log('Sending emails with configuration:', {
          customerTo: customerMsg.to,
          adminTo: adminMsg.to,
          from: process.env.EMAIL_FROM,
        })

        // Send both emails
        await Promise.all([
          sgMail.send(customerMsg),
          sgMail.send(adminMsg)
        ])

        console.log('Email notifications sent successfully')
      } catch (error) {
        console.error('Error sending email notifications:', error)
        if (error && typeof error === 'object') {
          if ('response' in error) {
            console.error('SendGrid response:', (error as { response: { body: unknown } }).response.body)
          }
          if ('message' in error) {
            console.error('Error message:', (error as { message: string }).message)
          }
          if ('code' in error) {
            console.error('Error code:', (error as { code: string | number }).code)
          }
        }
        // Don't fail the request if email fails
      }
    } else {
      console.log('Email notifications skipped - SendGrid configuration:', {
        hasApiKey: !!process.env.SENDGRID_API_KEY,
        hasEmailTo: !!process.env.EMAIL_TO,
        hasEmailFrom: !!process.env.EMAIL_FROM,
      })
    }

    return NextResponse.json(
      { message: 'Estimate submitted successfully', data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing estimate:', error)
    
    // Handle validation errors
    if (error instanceof ZodError) {
      console.error('Validation errors:', error.errors)
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Unexpected error:', { message: errorMessage, stack: errorStack })

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage,
        stack: errorStack
      },
      { status: 500 }
    )
  }
} 