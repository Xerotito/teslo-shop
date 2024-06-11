'use server'

/**
 * La función authenticated se conecta con next-auth mediante la fn singIn la cual viene desestructurada de NextAuth
 * en el archivo /src/auth.config envía los datos del formularios y esta se encarga de verificarlos.
 */

import { signIn } from '@/auth.config';
import { sleep } from '@/utils';
import { redirect } from 'next/navigation';


// ...

export async function authenticate(prevState: string | undefined, formData: FormData,) {
  try {
    // await sleep(2)
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    })
    return 'Success'
  } catch (error) {
    console.log(error)
    if (error as Error) return 'CredentialsSignin'
    return 'Something went wrong.';
  }
}

/** 
 * La función login se llama al realizar un registro de un nuevo usuario, si bien la función de registro del formulario puede realizar
 * directamente un signIn de next-aut, se hace de esta manera por el principio de responsabilidad única.
*/
export const login = async (email: string, password: string) => {
  try {

    await signIn('credentials', { email, password })
    return { ok: true }

  } catch (error) {
    console.log(error)
    
    return {
      ok     : false,
      message: 'No se puedo iniciar sesión'
    }
  }  
}