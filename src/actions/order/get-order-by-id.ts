'use server'

import { auth } from '@/auth.config'
import prisma from '@/libs/prisma'

export const getOrderById = async (id: string) => {
  //Verifica usuario en sesión
  const session = await auth()
  if (!session?.user)
    return {
      ok: false,
      message: 'El usuario no se encuentra autenticado',
    }
  
  try {
    //Trae de la base de datos todos los datos que necesitamos para plasmar en el front.
    const order = await prisma.order.findUnique({
      where  : { id },
      include: {
        OrderAddress: true,
        OrderItem   : {
          select: {
            price   : true,
            quantity: true,
            size    : true,

            product: {
              select: {
                title: true,
                slug : true,

                ProductImage: {
                  select: { url: true }, take: 1
                }
              }
            }
          }
        }
      }
    })

    //Verificaciones
    if (!order) throw `${id} no se encuentra orden con el id`
    if(session.user.role === 'user') {
      if (session.user.id !== order.userId) throw `${id} no pertenece al usuario en session`
    }

    return {
      ok   : true,
      order: order,
    }

    
  } catch (error) {
    return {
      ok     : false,
      message: 'Orden no encontrada'
    }
  }
}