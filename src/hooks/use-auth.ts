import { useSession } from 'next-auth/react'

export default function useAuth () {
  const session = useSession()

  return {
    user: session.data?.user
  }
}