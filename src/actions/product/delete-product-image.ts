'use server'

import prisma from '@/libs/prisma'
import { v2 as cloudinary } from 'cloudinary'
import { revalidatePath } from 'next/cache'
cloudinary.config(process.env.CLOUDINARY_URL ?? '')


export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith('http')) {
    return {
      ok: false,
      error: 'No se pudo eliminar imágenes del File'
    }
  }

  //De la url recortamos el segmento del nombre para eliminar de cloudinary quedando algo como 'qqz8qccthuufdxgku2iv'
  const imageName = imageUrl
  .split('/')
  .pop()
  ?.split('.')[0] ?? ''

  console.log(imageName)

  //Procedemos a eliminar la imagen de cloudinary y la base de datos
  try {
    await cloudinary.uploader.destroy(`teslo-shop/${imageName}`)
    const deletedImage = await prisma.productImage.delete({
        where: { id: imageId },
        select: {
            product: {
                select: { slug: true },
            },
        },
    })

    //Revalidación de paths 
    revalidatePath('/admin/products')
    revalidatePath(`/admin/product/${deletedImage.product.slug}`)
    revalidatePath(`/product/${deletedImage.product.slug}`)

  } catch (error) {
    console.log(error)
    return {
      ok     : false,
      message: 'Hubo un error al eliminar la imagen'
    }
  }

}