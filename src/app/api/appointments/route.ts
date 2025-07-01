import { NextRequest, NextResponse } from 'next/server'
import session from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET () {
  try {
    const { user, isAutenticated } = await session()

    if (!isAutenticated) {
      return NextResponse.json({ error: 'No tienes permisos para realizar esta acción.' }, { status: 401 })
    }

    const appointments = await prisma.appointment.findMany({
      where: { userId: user?.id },
      include: {
        pet: { select: { name: true } },
        doctor: { select: { name: true } }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(appointments, { status: 200 })
  } catch (error) {
    console.error('Error al obtener las citas:', error)
    return NextResponse.json({ error: 'Error al obtener las citas.' }, { status: 500 })
  }
}

export async function POST (request: NextRequest) {
  try {
    const { user, isAutenticated } = await session()

    if (!isAutenticated) {
      return NextResponse.json({ error: 'No tienes permisos para realizar esta acción.' }, { status: 401 })
    }

    const data = await request.json()

    // Validar si la mascota ya existe antes de crear una nueva
    const existingPet = await prisma.pet.findUnique({ where: { id: data.selectedPetId } })

    let pet
    if (existingPet) {
      pet = existingPet
    } else {
      pet = await prisma.pet.create({
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
        }
      })
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(data.appointmentDate),
        time: data.appointmentTime,
        service: data.serviceType,
        reason: data.visitReason,
        details: data.visitDetails,
        status: 'PENDING',
        userId: user?.id ?? '',
        petId: pet.id,
        doctorId: data.doctorId !== 'cualquier profesional' ? data.doctorId : null,
      }
    })

    return NextResponse.json({ pet, appointment }, { status: 201 })
  } catch (error) {
    console.error('Error al crear la cita:', error)
    return NextResponse.json({ error: 'Error al crear la cita.' }, { status: 500 })
  }
}