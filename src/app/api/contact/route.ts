import { NextResponse } from 'next/server'
import { contactSchema } from '@/schemas/contactSchema'
import { supabaseAdmin } from '@/lib/supabaseClient'
import sgMail from '@sendgrid/mail'

// Debug environment variables
console.log('Environment variables status:', {
  hasSendGridKey: !!process.env.SENDGRID_API_KEY,
  hasEmailTo: !!process.env.EMAIL_TO,
  hasEmailFrom: !!process.env.EMAIL_FROM,
  sendGridKeyLength: process.env.SENDGRID_API_KEY?.length,
  emailTo: process.env.EMAIL_TO,
  emailFrom: process.env.EMAIL_FROM,
  nodeEnv: process.env.NODE_ENV,
});

// Initialize SendGrid only if API key is available
if (process.env.SENDGRID_API_KEY) {
  console.log('Initializing SendGrid with API key');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.error('SendGrid API key is missing. Please check your environment variables.');
}

export async function POST(request: Request) {
  console.log('API route: Contact form submission received');
  
  try {
    const body = await request.json();
    console.log('Received form data:', body);

    // Validate the request body against our schema
    const validatedData = contactSchema.parse(body);
    console.log('Validated form data:', validatedData);

    // Check if Supabase is properly configured
    const supabaseClient = supabaseAdmin.client
    if (!supabaseClient) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Database configuration is missing', details: 'Required environment variables are not set' },
        { status: 500 }
      );
    }

    // Insert the form submission into Supabase
    const { data, error } = await supabaseClient
      .from('contacts')
      .insert([
        {
          referral: validatedData.referral === 'Other' ? validatedData.other_referral : validatedData.referral,
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address,
          city: validatedData.city,
          zip: validatedData.zip,
          project_description: validatedData.project_description,
          images: validatedData.images || [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { error: 'Failed to save form submission', details: error.message },
        { status: 500 }
      );
    }

    console.log('Form submission saved to database:', data);

    // Send email notifications only if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && process.env.EMAIL_TO && process.env.EMAIL_FROM) {
      console.log('Attempting to send email notifications...');
      try {
        // Send confirmation email to customer
        const customerMsg = {
          to: validatedData.email,
          from: process.env.EMAIL_FROM,
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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Thank you for your estimate request!</h2>
              <p>Dear ${validatedData.first_name},</p>
              <p>Thank you for requesting an estimate from PavExpert Hub. We have received your request and will review it shortly.</p>
              
              <h3 style="color: #666;">Request Summary:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Name:</strong> ${validatedData.first_name} ${validatedData.last_name}</li>
                <li><strong>Address:</strong> ${validatedData.address}, ${validatedData.city}, ${validatedData.zip}</li>
                <li><strong>Phone:</strong> ${validatedData.phone}</li>
                <li><strong>Project Description:</strong> ${validatedData.project_description || 'Not provided'}</li>
              </ul>
              
              <p>We will contact you within 24-48 hours to discuss your project in more detail.</p>
              
              <p style="margin-top: 30px;">Best regards,<br>PavExpert Hub Team</p>
              <p style="color: #666; font-size: 0.9em;">Email: ${process.env.EMAIL_FROM}</p>
            </div>
          `,
        };

        // Send notification email to admin
        const adminMsg = {
          to: process.env.EMAIL_TO,
          from: process.env.EMAIL_FROM,
          subject: 'New Estimate Request - PavExpert Hub',
          text: `New estimate request received:

Name: ${validatedData.first_name} ${validatedData.last_name}
Email: ${validatedData.email}
Phone: ${validatedData.phone}
Address: ${validatedData.address}, ${validatedData.city}, ${validatedData.zip}
Project Description: ${validatedData.project_description || 'Not provided'}
Referral Source: ${validatedData.referral === 'Other' ? validatedData.other_referral : validatedData.referral}

Images: ${validatedData.images?.length ? validatedData.images.join('\n') : 'No images provided'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Estimate Request</h2>
              
              <h3 style="color: #666;">Customer Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Name:</strong> ${validatedData.first_name} ${validatedData.last_name}</li>
                <li><strong>Email:</strong> ${validatedData.email}</li>
                <li><strong>Phone:</strong> ${validatedData.phone}</li>
                <li><strong>Address:</strong> ${validatedData.address}, ${validatedData.city}, ${validatedData.zip}</li>
                <li><strong>Project Description:</strong> ${validatedData.project_description || 'Not provided'}</li>
                <li><strong>Referral Source:</strong> ${validatedData.referral === 'Other' ? validatedData.other_referral : validatedData.referral}</li>
              </ul>
              
              ${validatedData.images?.length ? `
                <h3 style="color: #666;">Project Images:</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                  ${validatedData.images.map((url: string) => `
                    <img src="${url}" alt="Project image" style="width: 100%; height: auto; border-radius: 4px;">
                  `).join('')}
                </div>
              ` : '<p>No images provided</p>'}
              
              <p style="margin-top: 30px; color: #666; font-size: 0.9em;">Sent from: ${process.env.EMAIL_FROM}</p>
            </div>
          `,
        };

        console.log('Sending emails with configuration:', {
          customerTo: customerMsg.to,
          adminTo: adminMsg.to,
          from: process.env.EMAIL_FROM,
          nodeEnv: process.env.NODE_ENV,
        });

        // Send both emails
        const [customerResponse, adminResponse] = await Promise.all([
          sgMail.send(customerMsg),
          sgMail.send(adminMsg)
        ]);

        console.log('Email notifications sent successfully:', {
          customerStatus: customerResponse[0]?.statusCode,
          adminStatus: adminResponse[0]?.statusCode,
        });
      } catch (error) {
        console.error('Error sending email notifications:', error);
        if (error && typeof error === 'object' && 'response' in error) {
          console.error('SendGrid response:', (error as { response: { body: unknown } }).response.body);
        }
        // Don't fail the request if email fails
      }
    } else {
      console.error('Email notifications skipped - Missing SendGrid configuration:', {
        hasApiKey: !!process.env.SENDGRID_API_KEY,
        hasEmailTo: !!process.env.EMAIL_TO,
        hasEmailFrom: !!process.env.EMAIL_FROM,
        nodeEnv: process.env.NODE_ENV,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 