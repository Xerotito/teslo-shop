'use server'

import prisma from '@/libs/prisma'

export const setTransactionId = async (orderId: string, transactionId: string) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data : { transactionId }
    })
    if (!order) {
      console.log(order)
      return {
          ok: false,
          message: `No se encontró una orden con el id: ${orderId}`,
      }
    }


      return { ok: true }
  } catch (error) {
    console.log(error)
    return {
      ok     : false,
      message: 'Error al intentar actualizar el id de la transacción en la base de datos'
    }
  }
}