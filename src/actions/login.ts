'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { loginSchema } from '@/schemas/auth'
import { prisma } from '@/lib/prisma'
import { signIn } from '@/auth'

export default async function login (data: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.format()
    }
  }

  const { email, password } = validatedFields.data

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (!existingUser || !existingUser.email) {
    return {
      status: 'error',
      message: 'El usuario no existe'
    }
  }

  const passwordsMatch = await bcrypt.compare(password, existingUser.password)

  if (!passwordsMatch) {
    return {
      status: 'error',
      message: 'La contraseña es incorrecta'
    }
  }

  await signIn('credentials', {
    email: existingUser.email,
    password: existingUser.password,
    redirect: false
  })

  return {
    status: 'success',
    message: 'Inicio de sesión exitoso'
  }
}