'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter } from '@/components/ui/card'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas/auth'

export default function ForgotPasswordForm () {
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setGeneralError(null)
    setSuccessMessage(null)
    try {
      const response = await axios.post('/api/auth/forgot-password', data)
      if (response.status === 200) {
        setSuccessMessage('Se ha enviado un correo con las instrucciones para restablecer tu contraseña.')
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Error al procesar la solicitud'
        setGeneralError(message)
      } else {
        setGeneralError('Error al procesar la solicitud')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <CardContent className='space-y-6'>
        {generalError && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm'>
            {generalError}
          </div>
        )}
        {successMessage && (
          <div className='p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm'>
            {successMessage}
          </div>
        )}
        <div className='space-y-2'>
          <Label htmlFor='email'>Correo Electrónico</Label>
          <Input id='email' type='email' placeholder='ejemplo@correo.com' {...register('email')} />
          {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
        </div>
      </CardContent>
      <CardFooter className='flex flex-col space-y-4'>
        <Button type='submit' className='w-full bg-teal-500 hover:bg-teal-600' disabled={isSubmitting}>
          {isSubmitting ? (<><Loader2 className='mr-2 h-4 w-4 animate-spin' />Procesando...</>) : 'Enviar correo de restablecimiento'}
        </Button>
        <div className='text-center text-sm'>
          <Link href='/login' className='text-teal-500 hover:underline'>
            Volver al inicio de sesión
          </Link>
        </div>
      </CardFooter>
    </form>
  )
}