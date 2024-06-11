//Aquí se agrega el tipado para los datos extras que se agregan en la session de usuario desde el token.

import NextAuth, { DefaultSession } from 'next-auth';


declare module 'next-auth' {
  interface Session {
    user: {
      id            : 'string',
      name          : 'string',
      email         : 'string',
      emailVerified?: boolean,
      role          : string,
      image?        : string,
    } & DefaultSession['user']
  }
}