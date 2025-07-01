import { z } from 'zod'

export const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50).optional(),
  email: z.string().email('Ingresa un correo electrónico válido').optional(),
  phone_number: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos').max(15).optional(),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres').max(100).optional(),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'El género es requerido' }),
  image: z
    .any()
    .refine((v) => {
      if (!v || (v instanceof FileList && v.length === 0)) return true
      const file = v instanceof FileList ? v.item(0) : v
      if (!file || typeof file.type !== 'string') return false
      const isImage = file.type.startsWith('image/')
      const isSmallEnough = file.size < 2 * 1024 * 1024 // < 2MB
      return isImage && isSmallEnough
    }, {
      message: 'Debe ser una imagen de menos de 2MB',
    })
    .optional()
})

export const updateRouteUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50).optional(),
  email: z.string().email('Ingresa un correo electrónico válido').optional(),
  phone_number: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos').max(15).optional(),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres').max(100).optional(),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'El género es requerido' }),
  image: z.string().url().optional(),
})

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
export type UpdateRouteUserFormValues = z.infer<typeof updateRouteUserSchema>