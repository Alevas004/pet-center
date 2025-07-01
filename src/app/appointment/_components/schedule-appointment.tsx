'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useFormContext, useWatch, Controller } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const doctors = [
  { id: "cualquier profesional", nombre: "Cualquier profesional", foto: "https://avatar.iran.liara.run/public" },
  { id: "dr. garcía", nombre: "Dr. García", foto: "https://avatar.iran.liara.run/public/boy?username=garcia" },
  { id: "dra. rodríguez", nombre: "Dra. Rodríguez", foto: "https://avatar.iran.liara.run/public/girl?username=rodriguez" },
  { id: "dr. lópez", nombre: "Dr. López", foto: "https://avatar.iran.liara.run/public/boy?username=lopez" },
  { id: "dra. martínez", nombre: "Dra. Martínez", foto: "https://avatar.iran.liara.run/public/girl?username=martinez" },
]

const availableTimes = ['9:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00']

export default function ScheduleAppointment () {
  const { setValue, register, control, formState: { errors } } = useFormContext()
  const doctor = useWatch({ name: 'doctor', control }) || 'cualquier profesional'
  const appointmentTime = useWatch({ name: 'appointmentTime', control })
  const termsAccepted = useWatch({ name: 'termsAccepted', control })
  const today = new Date().toISOString().split('T')[0]
  const selectedDoctor = doctors.find((doc) => doc.id === doctor) || doctors[0]

  // Mantengo solo el efecto para mantener el valor de doctor sincronizado
  useEffect(() => {
    setValue('doctor', doctor)
  }, [doctor, setValue])

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='doctor'>Selecciona un profesional</Label>
        <Controller
          control={control}
          name='doctor'
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un profesional" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>{doctor.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.doctor && <p className='text-red-500 text-xs mt-1'>{errors.doctor.message as string}</p>}
      </div>
      {selectedDoctor.foto && (
        <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-lg border-2 border-violet-500">
          <div className="relative h-16 w-16 rounded-full overflow-hidden">
            <Image src={selectedDoctor.foto} alt={selectedDoctor.nombre} fill className="object-cover" />
          </div>
          <div>
            <p className="font-medium">{selectedDoctor.nombre}</p>
            <p className="text-sm text-muted-foreground">Profesional seleccionado</p>
          </div>
        </div>
      )}
      <div className='space-y-2'>
        <Label htmlFor='appointmentDate'>Fecha de la cita<span className='text-red-500'>*</span></Label>
        <Input id='appointmentDate' type='date' min={today} {...register('appointmentDate')} />
        {errors.appointmentDate && <p className='text-red-500 text-xs mt-1'>{errors.appointmentDate.message as string}</p>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='appointmentTime'>Horario disponible<span className='text-red-500'>*</span></Label>
        <Controller
          control={control}
          name='appointmentTime'
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder='Selecciona un horario' />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.appointmentTime && <p className='text-red-500 text-xs mt-1'>{errors.appointmentTime.message as string}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="termsAccepted" checked={termsAccepted} onCheckedChange={(checked) => setValue('termsAccepted', Boolean(checked))} />
        <label htmlFor="termsAccepted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Acepto los términos y condiciones*</label>
      </div>
      {errors.termsAccepted && <p className='text-red-500 text-xs mt-1'>{errors.termsAccepted.message as string}</p>}
    </div>
  )
}