import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { resetPasswordSchema } from '@/schemas/auth'
import { getUserByEmail } from '@/queries/user'
import { getPasswordResetTokenByToken } from '@/queries/password-reset-token'
import { prisma } from '@/lib/prisma'

export async function PATCH (request: Request) {
  try {
    const body = await request.json()
    const validatedFields = resetPasswordSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Por favor, revisa los campos ingresados.' }, { status: 422 })
    }

    const { password, token } = validatedFields.data

    const existingToken = await getPasswordResetTokenByToken(token)

    if (!existingToken) {
      return NextResponse.json({ error: 'No se encontró un token.' }, { status: 404 })
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
      return NextResponse.json({ error: 'El token ha expirado.' }, { status: 410 })
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) {
      return NextResponse.json({ error: 'El usuario no existe.' }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    })

    return NextResponse.json({ message: '¡Contraseña actualizada con éxito!' }, { status: 200 })
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error)
    return NextResponse.json({ error: 'Error al cambiar la contraseña.' }, { status: 500 })
  }
}