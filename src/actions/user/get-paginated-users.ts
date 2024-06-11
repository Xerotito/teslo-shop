'use server'

import { auth } from '@/auth.config'
import prisma from '@/libs/prisma'

export const getPaginatedUser = async () => {
  const session = await auth()
  
  if(session?.user.role !== 'admin') return {
    ok     : false,
    message: 'El usuario debe ser administrador'
  }

  const users = await prisma.user.findMany({ orderBy: { name: 'desc' } })

  return {
    ok   : true,
    users: users
  }

}