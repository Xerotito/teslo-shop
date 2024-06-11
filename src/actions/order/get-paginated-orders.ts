'use server'

import { auth } from '@/auth.config'
import prisma from '@/libs/prisma'
import { create } from 'zustand';

export const getPaginatedOrders = async() => {

  const session = await auth()

  if (session?.user.role !== 'admin')
      return {
          ok     : false,
          message: 'El usuario no es administrador',
      }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
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