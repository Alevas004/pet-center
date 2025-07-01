'use client'

import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SettingsCard () {

  const handleDeleteAccount = () => {
    // Aquí normalmente enviarías la solicitud de eliminación al backend
    alert('Cuenta eliminada con éxito')
    // Redirigir a la página de inicio o login
  }

  return (
    <CardContent className='space-y-4'>
      <div>
        <h3 className='font-medium mb-2'>Cambiar contraseña</h3>
        <p className='text-sm text-muted-foreground mb-4'>
          Actualiza tu contraseña regularmente para mantener tu cuenta segura.
        </p>
        <Button variant='outline'>Cambiar contraseña</Button>
      </div>

      <div className='pt-4 border-t'>
        <h3 className='font-medium mb-2 text-red-600'>Eliminar cuenta</h3>
        <p className='text-sm text-muted-foreground mb-4'>
          Al eliminar tu cuenta, todos tus datos serán borrados permanentemente.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>
              <Trash2 className='mr-2 h-4 w-4' /> Eliminar cuenta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos los datos
                asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className='bg-red-500 hover:bg-red-600'>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardContent>
  )
}