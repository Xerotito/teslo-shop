'use server'

import { z } from 'zod'

import prisma from '@/libs/prisma'
import { Gender, Product, Size } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import {v2 as cloudinary} from 'cloudinary'
import { CgKey } from 'react-icons/cg'
cloudinary.config(process.env.CLOUDINARY_URL ?? '')

//--- Esquema de validación ---------------------------------------------------------------------------  
const productSchema = z.object({
  id         : z.string().uuid().optional().nullable(),
  title      : z.string().min(3).max(255),
  slug       : z.string().min(3).max(255),
  description: z.string(),
  price      : z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes     : z.coerce.string().transform(val => val.split(',')),
  tags      : z.string(),
  gender    : z.nativeEnum(Gender)
})

//--- Server Action ---------------------------------------------------------------------------------
export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData)
  // console.log(data)

  /**
   * Realiza la validación del esquema (zod)
   * si pasa la validación retorna el objeto validado (productParse.data)
   * si no pasa la validación retorna el error (productParsed.error)
   */
  const productParsed = productSchema.safeParse(data)

  if (!productParsed.success) {
    console.log(productParsed.error)
    return { ok: false }
  }

  const product = productParsed.data
  //Se asegura de que el slug no contenga espacios en blanco, si es asi lo remplaza por un guion, también recorta adelante y atrás.
  product.slug = product.slug.toLocaleLowerCase().replace(/ /g, '_').trim()

  const { id, ...restProduct } = product

  try {
    //Prisma Transaction ------------------------------------------------
    const prismaTx = await prisma.$transaction(async (tx) => {
    
      let product: Product // =>No confundir con el product del productParsed.data, esta es una variable en la que se almacena la data para la transacción. 
      const tagsArray = restProduct.tags.split(',').map(tag => tag.trim().toLowerCase())
  
      if (id) {
        //Actualizar producto
        product = await prisma.product.update({
          where: { id },
          data: {
            ...restProduct,
            sizes: { set: restProduct.sizes as Size[] },
            tags : { set: tagsArray }
          }
        })
      }
      else {
        //Crear producto
        product = await prisma.product.create({
          data: {
            ...restProduct,
            sizes: { set: restProduct.sizes as Size[]},
            tags : { set: tagsArray }
          }
        }) 
      }

      /* Proceso de carga y guardado de imágenes, recorre las imágenes y las guarda */
      if (formData.getAll('images')) {        
        //Al subir imágenes a cloudinary retorna  un arreglo con las secure urls
        const images = await uploadImages(formData.getAll('images') as File[])
        //Si hubo algún error
        if (!images) throw new Error('Hubo un error al cargar las i') 
        //Si las imágenes se subieron correctamente guardaremos las urls en la base de datos
        await prisma.productImage.createMany({
          data: images.map(image => ({
            url      : image!,
            productId: product.id
          }))
        })
      }
      return { product }
    })

  //Revalidación de paths (next/cache)
  revalidatePath('/admin/products')
  revalidatePath(`/admin/product/${product.slug}`)
  revalidatePath(`/products/${product.slug}`)

    return {
      ok     : true,
      product: prismaTx.product,
    }
  
  } catch (error) {
    return {
      ok     : false,
      message: 'No se puedo actualizar/crear producto'
    }
  }
}

/**
 * Fn que se encarga de subir las imágenes a cloudinary en forma paralela
 * usa un promise.all para hacer la carga paralela y un try & catch anidado
 * asi retorna error en la subida que presentara error.
 */
const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (images) => {

      try {
        //Transforma las imágenes en un string en base 64 para subir
        const buffer = await images.arrayBuffer()
        const base64Image = Buffer.from(buffer).toString('base64')

        //método de cloudinary para subir imágenes , option?: carpeta de cloudinary
        //la promesa retorna el secure url
        return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, { folder: 'teslo-shop' })
          .then(resp => resp.secure_url)
      } catch (error) {
        console.log(error)
        return null
      }
    })

    const uploadImages = await Promise.all(uploadPromises)
    //Si no hubo error en la subida retorna un array con las secure_urls
    return uploadImages

  } catch (error) {
    console.log(error)
    return null
  }
}