'use server'

import prisma from '@/libs/prisma'

export const deleteUserAddress = async (userId: string) => {
    try {

      await prisma.userAddress.delete({ where: { userId } })
      return {
        ok     : true,
        message: 'Dirección eliminada'
      }
      
    } catch (error) {
        console.log(error)
        return {
          oK     : false,
          message: 'Hubo un error al eliminar la dirección'
        }
    }
}