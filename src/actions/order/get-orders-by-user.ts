'use server'

import { auth } from '@/auth.config'
import prisma from '@/libs/prisma'

export const getOrderByUser = async() => {
  const session = await auth()
  if (!session?.user)
      return {
          ok     : false,
          message: 'El usuario debe estar autenticado',
      }

  const orders = await prisma.order.findMany({
    where  : { userId: session.user.id },
    include: {
      OrderAddress: {
        select: {
          firstName: true,
          lastName : true,
        }
      }
    }
  })

  return {
    ok    : true,
    orders: orders,
  }


}