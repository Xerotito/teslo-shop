'use server'

import prisma from '@/libs/prisma'

export const getUserAddress = async (userId: string) => {
  try {
    
    const address = await prisma.userAddress.findUnique({ where: { userId } })

    if (!address) return null

    const { countryId, address2, ...restAddress } = address 

    return {
        ...restAddress,
        country : countryId,
        address2: address2 ? address2 : '',
        city    : 'Hola mundo',
    }
  } catch (error) {
    console.log(error)
    return null
  }
}