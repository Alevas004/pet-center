import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import ForgotPasswordForm from './_components/forgot-password-form'

export default function ForgotPasswordPage () {
  return (
    <section className='min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] px-4 gird place-content-center bg-teal-100'>
      <div className='max-w-md mx-auto'>
        <Card className='border-8 border-teal-500/40 shadow-none'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center text-teal-400'>Recuperar Contraseña</CardTitle>
            <CardDescription className='text-center'>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <ForgotPasswordForm />
        </Card>
      </div>
    </section>
  )
}