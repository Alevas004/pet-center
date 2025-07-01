import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Appointment } from '../page'

interface AppointmentProps {
  appointment: Appointment
}

const serviceLabels: Record<string, string> = {
  visitaMedica: 'Visita médica',
  baño: 'Baño',
  corteBaño: 'Corte de pelo y baño'
}

const visitReasonLabels: Record<string, string> = {
  'consulta general': 'Consulta general',
  'vacunación': 'Vacunación',
  'enfermedad': 'Enfermedad',
  'lesión': 'Lesión',
  'control': 'Control',
  'emergencia': 'Emergencia',
  'laboratorio y exámenes': 'Laboratorio y exámenes',
  'otro': 'Otro'
}

export default function AppointmentCard ({ appointment }: AppointmentProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }

  // Acceso seguro a campos opcionales
  const anyAppointment = appointment as any
  const doctorName = typeof anyAppointment.doctorName === 'string' ? anyAppointment.doctorName : undefined
  const reason = typeof anyAppointment.reason === 'string' ? anyAppointment.reason : undefined
  const details = typeof anyAppointment.details === 'string' ? anyAppointment.details : undefined
  const notes = typeof anyAppointment.notes === 'string' ? anyAppointment.notes : undefined

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
          <div className='flex items-start gap-4 w-full'>
            <div
              className={`p-2 rounded-full mt-1 ${appointment.status === 'COMPLETED'
                ? 'bg-green-100'
                : appointment.status === 'PENDING'
                  ? 'bg-blue-100'
                  : 'bg-red-100'
                }`}
            >
              {appointment.status === 'COMPLETED' ? (
                <CheckCircle className='h-5 w-5 text-green-500' />
              ) : appointment.status === 'PENDING' ? (
                <Clock className='h-5 w-5 text-blue-500' />
              ) : (
                <XCircle className='h-5 w-5 text-red-500' />
              )}
            </div>
            <div className='flex-1'>
              <div className='flex flex-wrap items-center gap-2 mb-1'>
                <span className='px-2 py-1 rounded bg-violet-100 text-violet-700 text-xs font-semibold'>{serviceLabels[appointment.service] || appointment.service}</span>
                {appointment.service === 'visitaMedica' && reason && (
                  <span className='px-2 py-1 rounded bg-sky-100 text-sky-700 text-xs font-semibold'>{visitReasonLabels[reason.toLowerCase()] || reason}</span>
                )}
              </div>
              {doctorName && (
                <div className='text-xs text-gray-600 mb-1'><span className='font-semibold'>Médico:</span> {doctorName}</div>
              )}
              <div className='flex items-center gap-2 text-sm text-muted-foreground mb-1'>
                <Calendar className='h-4 w-4' />
                <span>{formatDate(appointment.date)}</span>
                <Clock className='h-4 w-4 ml-2' />
                <span>{appointment.time}</span>
              </div>
              {details && (
                <div className='flex items-center gap-2 text-xs text-gray-700 mt-1'>
                  <span className='inline-block px-2 py-1 rounded bg-amber-100 text-amber-800 font-medium'>Detalles</span>
                  <span>{details}</span>
                </div>
              )}
              {notes && (
                <div className='flex items-center gap-2 text-xs text-gray-700 mt-1'>
                  <span className='inline-block px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-medium'>Notas</span>
                  <span>{notes}</span>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col items-end min-w-[110px]'>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium mb-1 ${appointment.status === 'COMPLETED'
                ? 'bg-green-100 text-green-800'
                : appointment.status === 'PENDING'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
                }`}
            >
              {appointment.status === 'COMPLETED' ? 'Completada' : appointment.status === 'PENDING' ? 'Pendiente' : 'Cancelada'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}