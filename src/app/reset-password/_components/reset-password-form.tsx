'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter } from '@/components/ui/card'
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/schemas/auth'

export default function ResetPasswordForm () {
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token }
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setGeneralError(null)
    setSuccessMessage(null)
    try {
      const response = await axios.patch('/api/auth/reset-password', data)
      if (response.status === 200) {
        setSuccessMessage('Contraseña actualizada exitosamente.')
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Error al cambiar la contraseña'
        setGeneralError(message)
      } else {
        setGeneralError('Error al cambiar la contraseña')
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
          <Label htmlFor='password'>Nueva Contraseña</Label>
          <Input id='password' type='password' {...register('password')} />
          {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Confirmar Contraseña</Label>
          <Input id='confirmPassword' type='password' {...register('confirmPassword')} />
          {errors.confirmPassword && <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword.message}</p>}
        </div>
        <input type="hidden" {...register('token')} />
      </CardContent>
      <CardFooter className='flex flex-col space-y-4'>
        <Button type='submit' className='w-full bg-cyan-500 hover:bg-cyan-600' disabled={isSubmitting}>
          {isSubmitting ? (<><Loader2 className='mr-2 h-4 w-4 animate-spin' />Procesando...</>) : 'Cambiar contraseña'}
        </Button>
        <div className='text-center text-sm'>
          <Link href='/login' className='text-cyan-500 hover:underline'>
            Volver al inicio de sesión
          </Link>
        </div>
      </CardFooter>
    </form>
  )
}