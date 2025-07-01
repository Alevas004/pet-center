import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const domain = process.env.NEXT_PUBLIC_APP_URL

export async function sendPasswordResetEmail (email: string, token: string) {
  try {
    const resetLink = `${domain}/reset-password?token=${token}`

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset Password',
      html: `<p>Click the following link to reset your password: <a href="${resetLink}" target="_blank">Reset Password</a>.</p>`
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}