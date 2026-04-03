import nodemailer from 'nodemailer'

// Email types for different notifications
export type EmailType = 
  | 'password-reset'
  | 'user-invite'
  | 'article-rejection'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Get SMTP configuration from environment variables
function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'News Portal <noreply@example.com>',
  }
}

// Create nodemailer transporter
async function createTransporter() {
  const config = getSmtpConfig()

  // If no SMTP settings configured, return null
  if (!config.host || !config.user || !config.password) {
    return null
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.user,
      pass: config.password,
    },
  })
}

// Send email
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = await createTransporter()
    
    if (!transporter) {
      console.warn('SMTP not configured. Email not sent.')
      return { 
        success: false, 
        message: 'Email service not configured. Please configure SMTP settings in .env file.' 
      }
    }

    const config = getSmtpConfig()

    await transporter.sendMail({
      from: config.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
    })

    return { success: true, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Email send error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

// Get email content based on type
export function getEmailContent(type: EmailType, data: Record<string, string>): { subject: string; html: string } {
  const appName = process.env.APP_NAME || 'News Portal'
  const appUrl = process.env.APP_URL || 'http://localhost:3000'

  switch (type) {
    case 'password-reset':
      return getPasswordResetEmail(data, appName, appUrl)
    case 'user-invite':
      return getUserInviteEmail(data, appName, appUrl)
    case 'article-rejection':
      return getArticleRejectionEmail(data, appName, appUrl)
    default:
      return { subject: appName, html: data.html || '' }
  }
}

// Password reset email template
function getPasswordResetEmail(data: Record<string, string>, appName: string, appUrl: string): { subject: string; html: string } {
  const resetUrl = `${appUrl}/reset-password?token=${data.token}`
  
  return {
    subject: `Reset Your Password - ${appName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626;">${appName}</h1>
        </div>
        
        <h2>Reset Your Password</h2>
        
        <p>Hello ${data.name || 'User'},</p>
        
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        
        <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px;">If you didn't request a password reset, please ignore this email.</p>
      </body>
      </html>
    `
  }
}

// User invite email template
function getUserInviteEmail(data: Record<string, string>, appName: string, appUrl: string): { subject: string; html: string } {
  const tempPassword = data.tempPassword || ''
  const role = data.role || 'Staff'
  const loginUrl = `${appUrl}/login`
  
  return {
    subject: `You've Been Invited to ${appName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626;">${appName}</h1>
        </div>
        
        <h2>You've Been Invited!</h2>
        
        <p>Hello,</p>
        
        <p>You have been invited to join ${appName} as a <strong>${role}</strong>.</p>
        
        <p>Your temporary login credentials are:</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 6px;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email || 'your email'}</p>
          <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        
        <p>Please login and change your password immediately.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Login Now</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px;">If you have any questions, please contact the administrator.</p>
      </body>
      </html>
    `
  }
}

// Article rejection email template
function getArticleRejectionEmail(data: Record<string, string>, appName: string, appUrl: string): { subject: string; html: string } {
  const articleTitle = data.title || 'Your Article'
  const reason = data.reason || 'Please contact us for more information.'
  
  return {
    subject: `Article Status Update - ${appName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626;">${appName}</h1>
        </div>
        
        <h2>Article Status Update</h2>
        
        <p>Hello ${data.authorName || 'Author'},</p>
        
        <p>We regret to inform you that your article "<strong>${articleTitle}</strong>" has not been approved for publication.</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #dc2626;">Reason:</h3>
          <p style="margin: 0;">${reason}</p>
        </div>
        
        <p>Please revise your article according to the guidelines and resubmit.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px;">Thank you for your contribution to ${appName}.</p>
      </body>
      </html>
    `
  }
}

// Check if SMTP is configured
export function isEmailConfigured(): boolean {
  const config = getSmtpConfig()
  return !!(config.host && config.user && config.password)
}