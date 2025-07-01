'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Calendar } from 'lucide-react'

import { Button } from '@/components/ui/button'

import SelectPet from './_components/select-pet'
import PetHistory from './_components/pet-history'

export type Appointment = {
  id: number,
  date: string,
  time: string,
  service: string,
  reason: string,
  details?: string,
  status: string
}

export type Pet = {
  id: number,
  name: string,
  species: string,
  gender: string,
  age?: string,
  weight?: string,
  description?: string,
  breed: string,
  image?: string
  appointments: Appointment[]
}

export default function PetsPage () {
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<number | null>(null)

  useEffect(() => {
    const getPets = async () => {
      try {
        const response = await axios.get('/api/pets')
        console.log('response.data', response.data)
        setPets(response.data)
      } catch (error) {
        console.error('Error fetching pets:', error)
      }
    }

    getPets()
  }, [])

  const handlePetClick = (id: number) => {
    setSelectedPet(id === selectedPet ? null : id)
  }

  const selectedPetData = pets.find((pet) => pet.id === selectedPet)

  return (
    <section className='w-full min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] py-6 bg-sky-100'>
      <div className='max-w-5xl mx-auto px-4 md:px-6'>

        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-sky-400'>Mis Mascotas</h1>
          <div className="flex gap-2">
            <Link href="/appointment">
              <Button className="bg-sky-500 hover:bg-sky-600">
                <Calendar className="mr-2 h-4 w-4" /> Agendar Cita
              </Button>
            </Link>
          </div>
        </div>

        {selectedPet === null ? (
          <SelectPet
            pets={pets}
            handlePetClick={handlePetClick}
          />
        ) : (
          <PetHistory
            selectedPetData={selectedPetData}
            setSelectedPet={setSelectedPet}
          />
        )}
      </div>
    </section>
  )
}
