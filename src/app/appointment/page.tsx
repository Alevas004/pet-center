import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import AppointmentForm from './_components/appointment-form'

export default function AppointmentPage () {
  return (
    <section className="min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] px-4 gird place-content-center bg-violet-100">
      <div className='max-w-2xl mx-auto py-12'>
        <Card className="border-8 border-violet-500/40 shadow-none gap-3">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-violet-500">Agendar Cita</CardTitle>
            <CardDescription className="text-center">
              Completa el formulario a continuación para programar una cita para tu mascota
            </CardDescription>
          </CardHeader>
          <AppointmentForm />
        </Card>
      </div>
    </section>
  )
}