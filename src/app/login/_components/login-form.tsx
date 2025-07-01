'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter } from '@/components/ui/card'
import login from '@/actions/login'
import { loginSchema, type LoginFormValues } from '@/schemas/auth'

export default function LoginForm () {
  const [generalError, setGeneralError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormValues) => {
    setGeneralError(null)
    try {
      const result = await login(data)

      if (result?.status === 'error') {
        setGeneralError(result?.message as string)
      } else {
        window.location.reload()
      }
    } catch {
      setGeneralError('Login error. Please try again.')
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
        <div className='space-y-2'>
          <Label htmlFor='email'>Email Address</Label>
          <Input id='email' type='email' placeholder='example@email.com' {...register('email')} />
          {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
        </div>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='password'>Password</Label>
            <Link href='/forgot-password' className='text-sm text-green-500 hover:underline'>
              Forgot your password?
            </Link>
          </div>
          <Input id='password' type='password' {...register('password')} />
          {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
        </div>
      </CardContent>
      <CardFooter className='flex flex-col space-y-4'>
        <Button type='submit' className='bg-green-600 hover:bg-green-700 py-7 px-8! text-lg font-bold capitalize rounded-3xl hover:scale-105' disabled={isSubmitting}>
          {isSubmitting ? (<>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Logging in...
          </>) : (
            'Login'
          )}
        </Button>
        <div className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='text-green-500 hover:underline'>
            Sign up
          </Link>
        </div>
      </CardFooter>
    </form>
  )
}