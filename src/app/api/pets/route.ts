import { NextRequest, NextResponse } from 'next/server'
import session from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET () {
  try {
    const { user, isAutenticated } = await session()

    if (!isAutenticated) {
      return NextResponse.json({ error: 'No tienes permisos para realizar esta acción.' }, { status: 401 })
    }

    const pets = await prisma.pet.findMany({
      where: { userId: user?.id },
      include: {
        appointments: {
          orderBy: { date: 'desc' }
        }
      }
    })

    return NextResponse.json(pets, { status: 200 })
  } catch (error) {
    console.error('Error al obtener las mascotas:', error)
    return NextResponse.json({ error: 'Error al obtener las mascotas.' }, { status: 500 })
  }
}

export async function POST (request: NextRequest) {
  try {
    const { user, isAutenticated } = await session()

    if (!isAutenticated) {
      return NextResponse.json({ error: 'No tienes permisos para realizar esta acción.' }, { status: 401 })
    }

    const data = await request.json()

    // Agregar validación para evitar duplicados
    const existingPet = await prisma.pet.findFirst({
      where: {
        name: data.name,
        species: data.species,
        userId: user?.id
      }
    })

    if (existingPet) {
      return NextResponse.json({ error: 'Ya tienes una mascota con este nombre y especie.' }, { status: 400 })
    }

    const pet = await prisma.pet.create({
      data: {
        name: data.petName,
        species: data.petType,
        breed: data.petBreed,
        description: data.petDescription,
        age: data.petAge,
        weight: data.petWeight,
        gender: data.petGender,
        image: data.petImage,
        userId: user?.id ?? ''
      },
    })

    return NextResponse.json(pet, { status: 201 })
  } catch (error) {
    console.error('Error al crear la mascota:', error)
    return NextResponse.json({ error: 'Error al crear la mascota.' }, { status: 500 })
  }
}