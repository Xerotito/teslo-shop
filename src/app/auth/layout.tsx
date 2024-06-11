import { redirect } from 'next/navigation'

import { auth } from '@/auth.config'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {

    //Evalúa la sesión creada por next-auth, esto lo toma desde las cookies que vienen con su jwt generado por la biblioteca.
    const session = await auth()

    //Si no hay usuario en sesión
    if (session?.user) { redirect('/')   }

    return (
        <main className='flex justify-center'>
            <div className='w-full sm:w-[350px] px-10'>
                {children}
            </div>
        </main>
    )
}