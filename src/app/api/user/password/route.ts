import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import session from '@/lib/auth'

export async function PUT (request: NextRequest) {
  try {
    const { user, isAutenticated } = await session()

    if (!isAutenticated) {
      return NextResponse.json({ error: 'No tienes permisos para realizar esta acción.' }, { status: 401 })
    }

    const { oldPassword, newPassword } = await request.json()

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Por favor, revisa los campos ingresados.' }, { status: 400 })
    }

    await prisma.user.update({
      where: {
        email: user?.email as string
      },
      data: {
        password: await hash(newPassword, 10)
      }
    })

    return NextResponse.json({ message: 'Contraseña actualizada correctamente.' }, { status: 200 })
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error)
    return NextResponse.json({ error: 'Error al cambiar la contraseña' }, { status: 500 })
  }
}