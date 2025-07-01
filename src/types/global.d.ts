export { }

declare global {
  interface User {
    image: string
    name: string
    email: string
    phone_number: string
  }

  interface Pet {
    id: number
    name: string
    type: string
    gender: string
    breed?: string
    description?: string
    species?: string
    image?: string
  }
}