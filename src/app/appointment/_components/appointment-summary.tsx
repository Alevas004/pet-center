'use client'

import Image from 'next/image'
import { useFormContext } from 'react-hook-form'
import { Edit, Calendar, PawPrint, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AppointmentSummaryProps {
  goToStep: (step: number) => void
  user: User
  pets: Pet[]
}

const doctors = [
  { id: "cualquier profesional", nombre: "Cualquier profesional", foto: "https://avatar.iran.liara.run/public" },
  { id: "dr. garcía", nombre: "Dr. García", foto: "https://avatar.iran.liara.run/public/boy?username=garcia" },
  { id: "dra. rodríguez", nombre: "Dra. Rodríguez", foto: "https://avatar.iran.liara.run/public/girl?username=rodriguez" },
  { id: "dr. lópez", nombre: "Dr. López", foto: "https://avatar.iran.liara.run/public/boy?username=lopez" },
  { id: "dra. martínez", nombre: "Dra. Martínez", foto: "https://avatar.iran.liara.run/public/girl?username=martinez" },
]

interface FormData {
  petSelection?: string
  selectedPetId?: string
  petType?: string
  petName?: string
  petBreed?: string
  petDescription?: string
  petAge?: string
  petWeight?: string
  petImage?: File | string
  serviceType?: string
  visitReason?: string
  visitDetails?: string
  doctor?: string
  appointmentDate?: string
  appointmentTime?: string
}

export default function AppointmentSummary ({
  goToStep,
  user,
  pets
}: AppointmentSummaryProps) {
  const { watch } = useFormContext<FormData>()
  const formData = watch()
  const doctor = watch('doctor') || 'cualquier profesional'

  const selectedPet = pets.find((pet) => pet.id.toString() === formData.selectedPetId)
  const selectedDoctor = doctors.find((doc) => doc.id === doctor) || doctors[0]

  return (
    <div className='space-y-6'>
      <ResumenSeccion
        icon={<PawPrint className='h-4 w-4 mr-2 text-violet-500' />}
        titulo='Información de la mascota'
        onEdit={() => goToStep(0)}>
        <div className='flex items-center gap-4 text-muted-foreground'>
          {formData.petSelection === 'existing' && selectedPet ? (
            <>
              <ImagePreview src={selectedPet.image} alt={selectedPet.name} />
              <div>
                <p><strong>Nombre:</strong> {selectedPet.name}</p>
                <p><strong>Tipo:</strong> {selectedPet.species === 'DOG' ? 'Perro' : 'Gato'}</p>
                <p><strong>Raza:</strong> {selectedPet.breed}</p>
              </div>
            </>
          ) : (
            <>
              {formData.petImage && (
                <ImagePreview
                  src={typeof formData.petImage === 'string'
                    ? formData.petImage
                    : URL.createObjectURL(formData.petImage)}
                  alt='Mascota nueva' />
              )}
              <div>
                <p><strong>Tipo:</strong> {formData.petType === 'DOG' ? 'Perro' : formData.petType === 'CAT' ? 'Gato' : 'Otro'}</p>
                <p><strong>Nombre:</strong> {formData.petName}</p>
                {formData.petType !== 'OTHER' ? (
                  <p><strong>Raza:</strong> {formData.petBreed}</p>
                ) : (
                  <p><strong>Descripción:</strong> {formData.petDescription}</p>
                )}
                {formData.petAge && <p><strong>Edad:</strong> {formData.petAge}</p>}
                {formData.petWeight && <p><strong>Peso:</strong> {formData.petWeight}</p>}
              </div>
            </>
          )}
        </div>
      </ResumenSeccion>
      <ResumenSeccion
        icon={<PawPrint className='h-4 w-4 mr-2 text-violet-500' />}
        titulo='Servicio seleccionado'
        onEdit={() => goToStep(1)}>
        <div className='text-sm space-y-1 text-muted-foreground'>
          <p><strong>Servicio:</strong> {
            formData.serviceType === 'baño' ? 'Baño' :
              formData.serviceType === 'corteBaño' ? 'Corte de pelo y baño' :
                'Visita médica'
          }</p>
          {formData.serviceType === 'visitaMedica' && (
            <>
              <p><strong>Razón:</strong> {formData.visitReason}</p>
              {formData.visitDetails && <p><strong>Detalles:</strong> {formData.visitDetails}</p>}
            </>
          )}
        </div>
      </ResumenSeccion>
      <ResumenSeccion
        icon={<Calendar className='h-4 w-4 mr-2 text-violet-500' />}
        titulo='Detalles de la cita'
        onEdit={() => goToStep(2)}>
        <div className='flex items-center gap-4 text-muted-foreground'>
          <ImagePreview src={selectedDoctor.foto} alt={selectedDoctor.nombre} />
          <div>
            <p><strong>Profesional:</strong> {formData.doctor}</p>
            <p><strong>Fecha:</strong> {formData.appointmentDate}</p>
            <p><strong>Hora:</strong> {formData.appointmentTime}</p>
          </div>
        </div>
      </ResumenSeccion>
      <ResumenSeccion
        icon={<User className='h-4 w-4 mr-2 text-violet-500' />}
        titulo='Tus datos'>
        <div className='flex items-center gap-4 text-muted-foreground'>
          <ImagePreview src={user.image} alt={user.name} />
          <div className='text-sm space-y-1'>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>Teléfono:</strong> {user.phone_number}</p>
          </div>
        </div>
      </ResumenSeccion>
    </div>
  )
}

interface ResumenSeccionProps {
  icon: React.ReactNode
  titulo: string
  onEdit?: () => void
  children: React.ReactNode
}

function ResumenSeccion ({
  icon,
  titulo,
  onEdit,
  children,
}: ResumenSeccionProps) {
  return (
    <div className='rounded-lg border p-4'>
      <div className='flex justify-between items-center mb-2'>
        <h4 className='font-medium flex items-center'>{icon} {titulo}</h4>
        {onEdit && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={onEdit}
            className='h-8 text-violet-500 hover:text-violet-600'>
            <Edit className='h-4 w-4 mr-1' /> Modificar
          </Button>
        )}
      </div>
      <div className='text-sm space-y-1'>{children}</div>
    </div>
  )
}

interface ImagePreviewProps { src?: string; alt: string }

function ImagePreview ({ src, alt }: ImagePreviewProps) {
  return (
    <div className='relative h-16 w-16 rounded-full overflow-hidden'>
      <Image
        src={src || '/placeholder.svg'}
        alt={alt}
        fill
        className='object-cover'
      />
    </div>
  )
}