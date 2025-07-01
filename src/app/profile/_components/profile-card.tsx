'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Phone, Edit, Save, Upload, Venus, MapPin, Mars, Loader2 } from 'lucide-react'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateUserSchema, type UpdateUserFormValues } from '@/schemas/user'
import { uploadImageToCloudinary } from '@/lib/upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProfileCard () {
  const [userData, setUserData] = useState<UpdateUserFormValues | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: userData as UpdateUserFormValues
  })

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get('/api/user/me')
        console.log('Respuesta del servidor:', response.data)
        setUserData(response.data)
        setUserImagePreview(response.data.image || null)
        reset(response.data as UpdateUserFormValues)
      } catch (error) {
        console.error('Error al obtener el usuario:', error)
      }
    }
    getCurrentUser()
  }, [reset, refresh]) // Agregar 'refresh' como dependencia

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setUserImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
    register('image').onChange(e)
  }

  const onSubmit = async (data: UpdateUserFormValues) => {
    try {
      setGeneralError(null)
      setSuccessMessage(null)
      let imageUrl = ''
      if (data.image instanceof FileList && data.image.length > 0) {
        const file = data.image.item(0)
        if (file) {
          imageUrl = await uploadImageToCloudinary(file)
        }
      }
      const response = await axios.patch('/api/user/update', { ...data, image: imageUrl || userData?.image })
      if (response.status === 200) {
        setSuccessMessage('Perfil actualizado exitosamente.')
        setTimeout(() => {
          setIsEditing(false)
          reset(data)
          setRefresh((prev) => !prev)
        }, 2000)
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || 'Error al actualizar el perfil'
        setGeneralError(message)
      } else {
        setGeneralError('Error al actualizar el perfil')
      }
    } finally {
      setGeneralError(null)
      setSuccessMessage(null)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset(userData as UpdateUserFormValues)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CardContent className="space-y-6">
        {isEditing ? (
          <>
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
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Teléfono</Label>
              <Input id="phone_number" {...register('phone_number')} />
              {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" {...register('address')} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <SelectTrigger id="gender" className="w-full border rounded-md p-2">
                      <SelectValue placeholder="Selecciona tu género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Masculino</SelectItem>
                      <SelectItem value="FEMALE">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Foto de perfil</Label>
              <div className="flex flex-col items-center gap-4">
                {userImagePreview ? (
                  <div className="relative size-40 rounded-lg overflow-hidden">
                    <Image
                      src={userImagePreview || ''}
                      alt="Vista previa de usuario"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Sube una foto de perfil</p>
                  </div>
                )}
                <Input
                  id='userImage'
                  type="file"
                  accept="image/*"
                  {...register('image')}
                  onChange={handleImageUpload}
                  className="max-w-xs"
                />
                {errors.image && (<p className="text-red-500 text-xs mt-1">{errors.image.message as string}</p>)}
              </div>
            </div>
          </>
        ) : (
          <>
            {userData?.image && (
              <div className="relative size-40 mx-auto rounded-lg overflow-hidden">
                <Image
                  src={userImagePreview || ''}
                  alt="Foto de perfil"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{userData?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-muted-foreground">Correo electrónico</p>
                <p className="font-medium">{userData?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{userData?.phone_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-medium">{userData?.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {userData?.gender === 'MALE' ? (
                <Mars className="h-5 w-5 text-indigo-500" />
              ) : (
                <Venus className="h-5 w-5 text-indigo-500" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Género</p>
                <p className="font-medium">{userData?.gender === 'MALE' ? 'Masculino' : 'Femenino'}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button type='button' variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type='submit' className="bg-indigo-500 hover:bg-indigo-600" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className='mr-2 h-4 w-4 animate-spin' />Procesando...</>) : <><Save className="mr-2 h-4 w-4" /> Guardar cambios</>}
            </Button>
          </>
        ) : (
          <Button type='button' className="bg-indigo-500 hover:bg-indigo-600" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Editar información
          </Button>
        )}
      </CardFooter>
    </form>
  )
}