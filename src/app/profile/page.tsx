import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ProfileCard from './_components/profile-card'

export default function ProfilePage () {
  return (
    <section className='w-full min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] py-6 bg-indigo-100'>
      <div className='w-full max-w-md mx-auto'>
        <h1 className='text-3xl font-bold text-indigo-400 mb-6'>Mi Perfil</h1>
        <Card className='w-full border-8 border-indigo-500/40'>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Gestiona tu información personal</CardDescription>
          </CardHeader>
          <ProfileCard />
        </Card>
      </div>
    </section>
  )
}