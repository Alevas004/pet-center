'use client'

import { useFormContext, useWatch, Controller } from 'react-hook-form'
import { PawPrint } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const visitReasons = ['Consulta general', 'Vacunación', 'Enfermedad', 'Lesión', 'Control', 'Emergencia', 'Laboratorio y exámenes', 'Otro']

export default function SelectService () {
  const { setValue, getValues, register, control, formState: { errors } } = useFormContext()
  const [expandVisitMedica, setExpandVisitMedica] = useState(false)
  const serviceType = useWatch({ name: 'serviceType', control })
  const visitReason = useWatch({ name: 'visitReason', control })

  // Solo efecto para expandir/cerrar sección de visita médica
  useEffect(() => {
    if (serviceType === 'visitaMedica') {
      if (!expandVisitMedica) setExpandVisitMedica(true)
    } else {
      if (expandVisitMedica) {
        if (getValues('visitReason') !== '') setValue('visitReason', '')
        if (getValues('visitDetails') !== '') setValue('visitDetails', '')
        setExpandVisitMedica(false)
      }
    }
  }, [serviceType, expandVisitMedica, getValues, setValue])

  return (
    <div className='space-y-6'>
      {/* <h3 className='text-center text-xl font-semibold text-violet-400'>Escoge un servicio</h3> */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Controller
          control={control}
          name='serviceType'
          render={({ field }) => (
            <>
              {[
                { value: 'baño', label: 'Baño' },
                { value: 'corteBaño', label: 'Corte de pelo y baño' },
                { value: 'visitaMedica', label: 'Visita médica' }
              ].map(option => (
                <div
                  key={option.value}
                  className={cn('relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-violet-400', field.value === option.value && 'border-violet-500 bg-violet-50')}
                  onClick={() => field.onChange(option.value)}>
                  <div className='flex flex-col items-center text-center'>
                    <div className='rounded-full bg-violet-200 p-4 mb-2'>
                      <PawPrint className='h-6 w-6 text-violet-600' />
                    </div>
                    <span className='font-medium'>{option.label}</span>
                  </div>
                  {field.value === option.value && <div className='absolute top-2 right-2 h-4 w-4 rounded-full bg-violet-500'></div>}
                </div>
              ))}
            </>
          )}
        />
      </div>
      {errors.serviceType && <p className='text-red-500 text-xs mt-1'>{errors.serviceType.message as string}</p>}
      {expandVisitMedica && (
        <div className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='visitReason'>Razón de tu visita<span className='text-red-500'>*</span></Label>
            <Controller
              control={control}
              name='visitReason'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecciona la razón' />
                  </SelectTrigger>
                  <SelectContent>
                    {visitReasons.map((reason) => (
                      <SelectItem key={reason} value={reason.toLowerCase()}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.visitReason && <p className='text-red-500 text-xs mt-1'>{errors.visitReason.message as string}</p>}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='visitDetails'>Platícanos sobre la consulta (opcional)</Label>
            <Textarea id='visitDetails' placeholder='Describe los síntomas o la razón de la consulta' className='min-h-[100px]' {...register('visitDetails')} />
          </div>
        </div>
      )}
    </div>
  )
}