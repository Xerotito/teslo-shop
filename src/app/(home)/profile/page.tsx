import { redirect } from 'next/navigation';

import { auth } from '@/auth.config';
import { Title } from '@/components';

export default async function Profile() {

    //Evalúa la sesión creada por next-auth, esto lo toma desde las cookies que vienen con su jwt generado por la biblioteca.
    const session = await auth()

    //Si no hay usuario en sesión
    if (!session?.user) { redirect('/') }

    return (
        <div>
            <Title title='Perfil' />
            <pre>
                { JSON.stringify(session?.user, null, 2) }
                <h3 className='text-5xl'>{session.user.role}</h3>
            </pre>
        </div>
    )
}