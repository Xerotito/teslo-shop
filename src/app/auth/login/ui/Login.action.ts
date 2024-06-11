'use server'

/**
 * La función authenticated se conecta con next-auth mediante la fn singIn la cual viene desestructurada de NextAuth
 * en el archivo /src/auth.config envía los datos del formularios y esta se encarga de verificarlos.
 */

import { signIn } from '@/auth.config';
import { sleep } from '@/utils';


// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {

  try {
    await sleep(2)
    await signIn('credentials',{
      ...Object.fromEntries(formData),
      redirect: false,
    });
    return 'Success'
  }catch(error) {
    console.log('Problemas!!!', error)
    return 'Invalid credentials'
  }

}