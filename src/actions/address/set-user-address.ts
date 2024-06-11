'use server'

import prisma from '@/libs/prisma'
import type { Address } from '@/interfaces'

export const setUserAddress = async (address: Address, userId:string) => {
  try {

    const newAddress = await createOrReplaceAddress(address, userId)

    return {
      ok     : true,
      address: address,
    }


  } catch (error) {
    console.log(error)
    return {
      ok     : false,
      message: 'No se pudo guardar la dirección'
    }
  }
}

/* Fn interna crear o remplaza la dirección del usuario en la bd */
const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storeAddress = await prisma.userAddress.findUnique({ where: { userId } })

    const addressToSave = {
      userId    : userId,
      address   : address.address,
      address2  : address.address2 || '',
      countryId : address.country,
      city      : address.city,
      firstName : address.firstName,
      lastName  : address.lastName,
      phone     : address.phone,
      postalCode: address.postalCode
    }

    //Crea la dirección si no existe en la bd
    if (!storeAddress) {
      const newAddress = await prisma.userAddress.create({ data: addressToSave })
      return newAddress
    }

    //Actualiza la dirección si existe en la bd
    const updateAddress = await prisma.userAddress.update({ 
      where: { userId },
      data : addressToSave,
    })
    return updateAddress

  } catch (error) {
    console.log(error)
    throw new Error ('No se pudo grabar la dirección')
  }
}