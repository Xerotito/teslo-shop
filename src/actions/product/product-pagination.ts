'use server'

import prisma from '@/libs/prisma'
import { Gender } from '@prisma/client'

/**
 * Server actions que realizan las llamas a la base de datos para obtener productos, filtra por pagina y genero
 *  con los datos retornados, armamos el componente paginación
 */

interface PaginationOptions {
  page  ?: number,
  take  ?: number,
  gender?: Gender,
}

export const getPaginatedProductsWhitImages = async ({ page=1, take=12, gender }: PaginationOptions) => {

  //Validaciones por si lo recibido no es un numero
  if (isNaN(Number(page))) page = 1
  if (page < 1 ) page = 1

  //1. Obtener los productos y filtrar por genero dado el caso
  try {    
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: { url: true }
        }
      },
      //! filtro por genero
      where:{
        gender: gender
      },
    })

    //2. Obtener el total de paginas
    const totalProducts = await prisma.product.count({
      where: { gender }
    }) //Traemos el total de productos de la bd
    const totalPages = Math.ceil(totalProducts / take)   //Redondea la fracción al siguiente entero esa sera la cantidad total de paginado.

  /*     
    Formamos el objeto que espera la interface Product que espera el componente, 
    le agregamos el paginado y donde se encuentra actualmente el usuario. 
  */
    return {
      currentPage: page, 
      totalPages : totalPages,
      products   : products.map(product => ({
        ...product,
        images: product.ProductImage.map(image => image.url)
      }))
    }
  } catch (error) {
    throw new Error ('Ocurrió un error al cargar los productos')
  }
}