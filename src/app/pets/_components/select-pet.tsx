'use client'

import Link from 'next/link'
import Image from 'next/image'

import { PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Pet } from '../page'

interface SelectPetProps {
  pets: Pet[]
  handlePetClick: (id: number) => void
}

export default function SelectPet ({ pets, handlePetClick }: SelectPetProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <Link href='/appointment' className='block'>
        <Card className='cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center border-0'>
          <CardContent className='flex flex-col items-center justify-center py-8'>
            <div className='rounded-full bg-sky-100 p-4 mb-4'>
              <PawPrint className='h-8 w-8 text-sky-500' />
            </div>
            <CardTitle className='text-xl text-sky-400 mb-2'>Agregar Mascota</CardTitle>
            <CardDescription className='text-center'>
              Registra una nueva mascota para agendar citas
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
      {pets.map((pet) => (
        <Card
          key={pet.id}
          className='cursor-pointer hover:shadow-md transition-shadow border-0'
          onClick={() => handlePetClick(pet.id)}
        >
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl text-sky-400'>{pet.name}</CardTitle>
            <CardDescription>
              {pet.species === 'DOG' ? 'Perro' : 'Gato'} - {pet.breed}
            </CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center pb-2'>
            <div className='relative h-40 w-40 rounded-full overflow-hidden'>
              <Image
                src={pet.image || '/placeholder.svg'}
                alt={pet.name}
                fill
                className='object-cover'
              />
            </div>
          </CardContent>
          <CardFooter className='flex justify-center'>
            <Button variant='outline' className='w-full bg-sky-500 hover:bg-sky-600 text-white hover:text-white'>
              Ver historial
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}