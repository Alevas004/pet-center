import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import LoginForm from './_components/login-form'

export default function LoginPage () {
  return (
    <section className='min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] px-4 gird place-content-center bg-green-100'>
      <div className='max-w-md mx-auto'>
        <Card className='border-8 border-green-500/40 shadow-none'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center text-green-700'>Iniciar Sesión</CardTitle>
            <CardDescription className='text-center'>
              Ingresa tu correo y contraseña para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <LoginForm />
        </Card>
      </div>
    </section>
  )
}