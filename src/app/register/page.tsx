import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import RegisterForm from './_components/register-form'

export default function RegisterPage () {
  return (
    <section className='min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] px-4 gird place-content-center bg-red-100'>
      <div className='max-w-2xl mx-auto'>
        <Card className='border-8 border-red-500/40 shadow-none'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center text-red-400'>Crear una cuenta</CardTitle>
            <CardDescription className='text-center'>Ingresa tus datos para crear una cuenta</CardDescription>
          </CardHeader>
          <RegisterForm />
        </Card>
      </div>
    </section>
  )
}