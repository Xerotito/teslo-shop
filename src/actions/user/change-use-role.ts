'use server'

import { auth } from '@/auth.config'
import prisma from '@/libs/prisma'
import { revalidatePath } from 'next/cache'

export const changeUserRole = async (userId: string, role: string) => {

  const session = await auth()

  if(session?.user.role !== 'admin') return {
    ok     : false,
    message: 'El usuario debe ser administrador'
  }

  try {

    const newRole = (role === 'admin') ? 'admin' : 'user'

    await prisma.user.update({
      where: { id: userId },
      data : { role: newRole}
    })

    revalidatePath('/admin/users')

    return { ok: true }
    
  } catch (error) {
    console.log(error)
    return {
      ok     : false,
      message: 'No se pudo actualizar el role'
    }
  }


}