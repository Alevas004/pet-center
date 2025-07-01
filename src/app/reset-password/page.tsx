import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import ResetPasswordForm from './_components/reset-password-form'

export default function ResetPasswordPage () {
  return (
    <section className='min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] px-4 gird place-content-center bg-cyan-100'>
      <div className='max-w-md mx-auto'>
        <Card className='border-8 border-cyan-500/40 shadow-none'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center text-cyan-400'>Cambiar Contraseña</CardTitle>
            <CardDescription className='text-center'>
              Ingresa la nueva contraseña para tu cuenta.
            </CardDescription>
          </CardHeader>
          <ResetPasswordForm />
        </Card>
      </div>
    </section>
  )
}