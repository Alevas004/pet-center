import { z } from 'zod'

export const step1Schema = z.object({
  petSelection: z.string(),
  selectedPetId: z.string().optional(),
  petType: z.string().optional(),
  petName: z.string().optional(),
  petGender: z.string().optional(),
  petBreed: z.string().optional(),
  petDescription: z.string().optional(),
  petImage: z.union([z.string(), z.instanceof(File)]).optional(),
  petAge: z.string().optional(),
  petWeight: z.string().optional(),
  petsCount: z.number().optional(),
}).superRefine((data, ctx) => {
  if (data.petsCount === 0 || data.petSelection === 'new') {
    if (!data.petType) ctx.addIssue({ path: ['petType'], code: z.ZodIssueCode.custom, message: 'Selecciona la especie' })
    if (!data.petName) ctx.addIssue({ path: ['petName'], code: z.ZodIssueCode.custom, message: 'El nombre es obligatorio' })
    if (!data.petGender) ctx.addIssue({ path: ['petGender'], code: z.ZodIssueCode.custom, message: 'El género es obligatorio' })
    if (data.petType === 'OTHER' && !data.petDescription) ctx.addIssue({ path: ['petDescription'], code: z.ZodIssueCode.custom, message: 'Describe tu mascota' })
    if (data.petType !== 'OTHER' && !data.petBreed) ctx.addIssue({ path: ['petBreed'], code: z.ZodIssueCode.custom, message: 'Selecciona la raza' })
  } else if (data.petSelection === 'existing') {
    if (!data.selectedPetId) ctx.addIssue({ path: ['selectedPetId'], code: z.ZodIssueCode.custom, message: 'Selecciona una mascota' })
  }
})

export const step2Schema = z.object({
  serviceType: z.string(),
  visitReason: z.string().optional(),
  visitDetails: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.serviceType) ctx.addIssue({ path: ['serviceType'], code: z.ZodIssueCode.custom, message: 'Selecciona un servicio' })
  if (data.serviceType === 'visitaMedica' && !data.visitReason) ctx.addIssue({ path: ['visitReason'], code: z.ZodIssueCode.custom, message: 'Selecciona la razón de la visita' })
})

export const step3Schema = z.object({
  doctor: z.string(),
  appointmentDate: z.string(),
  appointmentTime: z.string(),
  termsAccepted: z.boolean().refine(v => v, { message: 'Debes aceptar los términos' }),
}).superRefine((data, ctx) => {
  if (!data.appointmentDate) ctx.addIssue({ path: ['appointmentDate'], code: z.ZodIssueCode.custom, message: 'Selecciona la fecha' })
  if (!data.appointmentTime) ctx.addIssue({ path: ['appointmentTime'], code: z.ZodIssueCode.custom, message: 'Selecciona el horario' })
})

export const step4Schema = z.object({})