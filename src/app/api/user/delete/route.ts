import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import session from '@/lib/auth'

export async function DELETE () {
  try {
    const { user, isAutenticated } = await session()

    if (!isAutenticated) {
      return NextResponse.json({ error: 'No tienes permisos para realizar esta acción.' }, { status: 401 })
    }

    await prisma.user.delete({
      where: { email: user?.email as string },
    })

    return NextResponse.json({ message: 'Cuenta eliminada correctamente.' }, { status: 200 })
  } catch (error) {
    console.error('Error al eliminar la cuenta:', error)
    return NextResponse.json({ error: 'Error al eliminar la cuenta' }, { status: 500 })
  }
}