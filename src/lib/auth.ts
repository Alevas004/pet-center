import { auth } from '@/auth'

export default async function session () {
  const session = await auth()

  return {
    user: session?.user,
    isAutenticated: !!session?.user,
    expires: session?.expires
  }
}