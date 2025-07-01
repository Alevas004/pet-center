import { NextResponse } from 'next/server'
import session from '@/lib/auth'
import { getUserByEmail } from '@/queries/user'

export async function GET () {
  try {
    const { user, isAutenticated } = await session()

    if (!isAutenticated) {
      return NextResponse.json({ error: 'No tienes permisos para realizar esta acción.' }, { status: 401 })
    }

    const existingUser = await getUserByEmail(user?.email as string)

    if (!existingUser) {
      return NextResponse.json({ error: 'El usuario no existe.' }, { status: 404 })
    }

    return NextResponse.json(existingUser, { status: 200 })
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error)
    return NextResponse.json({ error: 'Error al obtener el perfil del usuario.' }, { status: 500 })
  }
}