//Objeto que contiene las opciones de configuración para NextAuth.js, en este caso con credenciales, (email, y password propios)

import NextAuth, {  type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { AdapterUser } from 'next-auth/adapters'
import { z } from 'zod'
import bcryptjs from 'bcryptjs'

import prisma from './libs/prisma'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn : '/auth/login',
    newUser: '/auth/new-account'
  },
  callbacks: {
    /**
     * El token por default solo contiene {name, email, picture y sub => (id)},
     * se le pueden añadir mas propiedades que vienen en user, el cual es el retorno rest de las credentials.
     */
    async jwt({ token, user }) {
      if ( user ) token.data = user
      return token
    },
    /**
     * De la misma manera si queremos cargar esos datos en sesión, es mediante el token.data que cargamos anteriormente
     * Pero deben hacerse unos agregados en el archivo nextauth.d.ts, para agregar esto al tipado de ts y no tener problemas en el build final.
     */
    async session({ session, token, user }) {
      session.user = token.data as any
      return session
    },
  },
  providers: [    
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        //Si la información del formulario se logra parciar 
        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data
  
        //Busca en bd si el correo existe
        const user = await prisma.user.findUnique({ where: { email: email.toLocaleLowerCase() } })
        if (!user) return null

        //Existe usuario contraseñas no coinciden
        if ( !bcryptjs.compareSync(password, user.password) ) return null
        
        //Retorna usuarios sin contraseña si todo es correcto
        const { password: _ ,...rest } = user

        //El rest va a parar al jwt (en callbacks) y se desestructura como user
        return rest
      },
    })
  ]
}


export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)

//auth esta en beta no funciona muy bien