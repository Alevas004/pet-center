import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pet } from '../page'
import AppointmentCard from './appointment-card'

interface PetHistoryProps {
  selectedPetData: Pet | undefined
  setSelectedPet: (petId: number | null) => void
}

export default function PetHistory ({ selectedPetData, setSelectedPet }: PetHistoryProps) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' onClick={() => setSelectedPet(null)}>
          Volver
        </Button>
        <h2 className='text-xl font-bold text-sky-400'>Historial de {selectedPetData?.name}</h2>
      </div>

      <div className='flex items-center gap-6 p-4 bg-white rounded-lg shadow-sm border'>
        <div className='relative h-24 w-24 rounded-full overflow-hidden border-2 border-sky-200'>
          <Image
            src={selectedPetData?.image || '/placeholder.svg?height=200&width=200'}
            alt={selectedPetData?.name || 'Mascota'}
            fill
            className='object-cover'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <h3 className='text-xl font-bold text-sky-600'>{selectedPetData?.name}</h3>
          <div className='flex flex-wrap gap-2 items-center'>
            <span className='px-2 py-1 rounded bg-violet-100 text-violet-700 text-xs font-semibold'>
              {selectedPetData?.species === 'DOG' ? 'Perro' : selectedPetData?.species === 'CAT' ? 'Gato' : selectedPetData?.species}
            </span>
            {selectedPetData?.breed && (
              <span className='px-2 py-1 rounded bg-sky-100 text-sky-700 text-xs font-semibold'>Raza: {selectedPetData.breed}</span>
            )}
            {'age' in (selectedPetData || {}) && selectedPetData?.age && (
              <span className='px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-semibold'>Edad: {selectedPetData.age}</span>
            )}
            {'weight' in (selectedPetData || {}) && selectedPetData?.weight && (
              <span className='px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold'>Peso: {selectedPetData.weight}</span>
            )}
            {'gender' in (selectedPetData || {}) && selectedPetData?.gender && (
              <span className='px-2 py-1 rounded bg-pink-100 text-pink-700 text-xs font-semibold'>Sexo: {selectedPetData.gender === 'MALE' ? 'Macho' : selectedPetData.gender === 'FEMALE' ? 'Hembra' : selectedPetData.gender}</span>
            )}
          </div>
          {'description' in (selectedPetData || {}) && selectedPetData?.description && (
            <p className='text-xs text-gray-600 mt-1'>Descripción: {selectedPetData.description}</p>
          )}
        </div>
      </div>

      <Tabs defaultValue='todas'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='todas'>Todas</TabsTrigger>
          <TabsTrigger value='pendientes'>Pendientes</TabsTrigger>
          <TabsTrigger value='completadas'>Completadas</TabsTrigger>
          <TabsTrigger value='canceladas'>Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value='todas' className='mt-4'>
          <div className='space-y-6'>
            {selectedPetData?.appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value='pendientes' className='mt-4'>
          <div className='space-y-6'>
            {selectedPetData?.appointments
              .filter((appointment) => appointment.status === 'PENDING')
              .map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value='completadas' className='mt-4'>
          <div className='space-y-6'>
            {selectedPetData?.appointments
              .filter((appointment) => appointment.status === 'COMPLETED')
              .map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value='canceladas' className='mt-4'>
          <div className='space-y-6'>
            {selectedPetData?.appointments
              .filter((appointment) => appointment.status === 'CANCELLED')
              .map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}