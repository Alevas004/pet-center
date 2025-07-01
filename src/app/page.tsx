import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home () {
  return (
    <>
      <section className='min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] py-20 md:py-24 bg-orange-100'>
        <div className='relative max-w-7xl mx-auto px-4 md:px-6'>
          <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
            <div className='space-y-6'>
              <h1 className='max-md:text-center text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-amber-900'>
                We care for your <span className='text-amber-500 font-bold text-4xl sm:text-6xl md:text-7xl'>Furry Friends</span> like family with lots of <span className="text-red-400">♥</span>
              </h1>
              <p className='max-w-[600px] md:text-md'>
                Our veterinary clinic offers compassionate and professional care for all your companions, whether
                furry, feathered or scaly.
              </p>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Link href='/appointment' className='block'>
                  <Button className='max-md:w-full bg-amber-800 hover:bg-amber-900 py-7 px-4! text-lg font-bold capitalize rounded-3xl cursor-pointer group'>
                    <Calendar className="h-5 w-5" />
                    Book Appointment
                    <ArrowRight className='size-5 group-hover:translate-x-1 transition-transform duration-200 ease-linear' />
                  </Button>
                </Link>
              </div>
            </div>
            <div className='relative rounded-xl'>
              <Image
                src='/dog.webp'
                alt='Dog smiling with a vet'
                width={1000}
                height={1000}
                className='object-contain px-9'
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}