'use server'

import { auth } from '@/auth.config'
import prisma from '@/libs/prisma'
import type { UserAddress, Size, Address } from '@/interfaces'

interface ProductToOrder {
  productId: string,
  quantity : number,
  size     : Size,
}

export const placeOrder = async (productIds: ProductToOrder[], address: UserAddress) => {

  const session = await auth()
  const userSessionId = session?.user.id



  /* Verificar sesión de usuario */
  if(!userSessionId) return { ok: false, message: 'No hay usuario en sesión' }
  // console.log({ productIds, address })

  /* Obtener la información de los productos */
  //Nota: se puede tener dos o mas productos con el mismo id
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map (p => p.productId) //Busca los productos que hagan match por ID en la BD
      }
    }
  })

  /* Calcular los montos (Se usara en HEAD) */
  const itemsInOrder = productIds.reduce((count, prod) => count + prod.quantity, 0)

  /* Reduce calcula cantidad de productos llevados y su total e impuestos */  
  const { subTotal, impuesto, total } = productIds.reduce((totals, prodInOrder) => {
  const productQuantity = prodInOrder.quantity

  //Encontramos de los productos generales, los que tienen el mismo id de los prodInOrder
  const product = products.find(product => product.id === prodInOrder.productId)
  if(!product) throw new Error (`${prodInOrder.productId} no existe - 500`)
  
  const subTotal = product.price * productQuantity  

  totals.subTotal += subTotal
  totals.impuesto += subTotal * 0.21
  totals.total    += subTotal * 1.21

  return totals

  }, { subTotal: 0, impuesto: 0, total: 0 })

  /* Transacción con la base de datos ------------------------------------------*/
try {
  const prismaTx = await prisma.$transaction(async (tx) => {
    // 1. Actualizar stock de los productos
    const updateProductsPromises = products.map((product) => { //Acumula los valores de diferentes tallas.
        const productQuantity = productIds
            .filter((p) => p.productId === product.id)
            .reduce((acc, item) => item.quantity + acc, 0)

      //Valida si el price es cero o menos, lanza un error.    
      if (productQuantity <= 0) throw new Error (`${product.id} no tiene cantidad definida`)
      
      return tx.product.update({
        where: { id: product.id },
        data : { inStock: { decrement: productQuantity } }
      })      
    })

    const updateProducts = await Promise.all(updateProductsPromises)
    //Verifica valores negativos en la existencia (no hay stock)
    
    updateProducts.forEach(product => {
      if (product.inStock < 0) throw new Error(`${product.title} no tiene stock suficiente`)
    })

    // 2. Crear la orden (HEAD) en la BD - Detalles 
    const order = await tx.order.create({
      data: {
        userId      : userSessionId,
        itemsInOrder: itemsInOrder,
        subTotal    : subTotal,
        tax         : impuesto,
        total       : total,

        OrderItem: {
          createMany: {
            data: productIds.map(p => ({
              quantity : p.quantity,
              size     : p.size,
              productId: p.productId,
              price    : products.find(product => product.id === p.productId)?.price ?? 0
            }))
          }
        }
      }
    })

    // 3. Crear la dirección (Address de envió) de la orden en la BD
    
    const {  id, userId , country, ...restAddress } = address

    const orderAddress = await tx.orderAddress.create({
      data: {
        ...restAddress,
        countryId: country,
        OrderId  : order.id,
      } 
    })

    return {
      order         : order,
      updateProducts: updateProducts,
      orderAddress  : orderAddress,
    }
  })
  /* ------------------------------------------------------------------------- */

  //Si todo sale ok en la transacción
  return {
    ok      : true,
    order   : prismaTx.order,
    prismaTx: prismaTx
  }

  //Si hay algún  error en la transacción
  } catch (error: any) {
    console.log(error)
    return {
      ok     : false,
      message: error?.message
    }
  }

}