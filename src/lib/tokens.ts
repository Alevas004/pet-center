import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { getPasswordResetTokenByEmail } from '@/queries/password-reset-token'

export async function generatePasswordResetToken (email: string) {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getPasswordResetTokenByEmail(email)

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    })
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return passwordResetToken
}