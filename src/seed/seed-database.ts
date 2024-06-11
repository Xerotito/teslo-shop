/**
 * Como en este proyecto de next14  no usamos una apiRest creamos una función de node que restaura el contenido de la base de datos.
 * Eliminando todo el contenido de la bd y cargado los valores que existen en duro en en el archivo /seed.seed-database.ts
 * Es decir carga los valores desde un objeto a la base de datos
 */

import prisma from '../libs/prisma'
import { initialData } from './seed'
import { countries } from './seed-countries'

async function main() {

  //Borra todos los registros de la base de datos, esto debe ser en orden de relaciones para no crear conflicto 
  await prisma.orderAddress.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()

  await prisma.userAddress.deleteMany()
  await prisma.user.deleteMany()
  await prisma.country.deleteMany()

  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  /**
   * Transforma la data en duro de la seed a un formato compatible para insertar en la bd
   */
  const { categories, products, users } = initialData

  await prisma.user.createMany({ data: users })

  await prisma.country.createMany({ data: countries })

  //categories es un array [] lo transformaremos en un objeto cuyo clave sea name: y el valor las categories
  //categories: ['Shirts', 'Pants', 'Hoodies', 'Hats'], => {name:'Shirts',name:'Pants',name:'Hoodies',...}
  const categoriesData = categories.map(category => ({ name: category })) 

  await prisma.category.createMany({
    data:categoriesData
  })

  //Obtiene las categorías de la bd ['Shirts', 'Pants', 'Hoodies', 'Hats'] y sus ids
  const categoriesDB = await prisma.category.findMany()
  /**
   * Con esta info crearemos un nuevo mapa que contenga el nombre de la categoría y su id 
   * con el fin de ahorrar búsquedas en la bd
   */

  //Mi solución
  // const categoriesMap: Record<string,string> = {}
  // categoriesDB.map(({ id, name }) => ( categoriesMap[name.toLowerCase()] = id ) ) 

  //*Solución Fernando Herrera
  const categoriesMap = categoriesDB.reduce((object,category)=> {
    object[category.name.toLocaleLowerCase()] = category.id
    return object
  }, {} as Record<string,string>)


  /**
   * Itera en productos desde la seed, inserta en la bd cada uno, agregando el Id correspondiente de la categoría.
   */
  products.forEach( async (product) => {
    //Sacamos las propiedades (images,type) generan conflicto con las tablas al no encontrarse definidas en el esquema.
    const {type,images,...rest} = product

    //Agrega en la tabla productos
    const dbProduct = await prisma.product.create({
      data:{
        ...rest,
        categoryId: categoriesMap[type]
      }
    })

    //Agrega en la tabla images
    const imagesData = images.map(image => ({
      url      : image,
      productId: dbProduct.id
    }))

    await prisma.productImage.createMany({ data: imagesData })
    
  })

  console.log('Seed ejecutada correctamente, se restableció la base de datos')
}



(()=>{
  if (process.env.NODE_ENV === 'production') return
  main()
})()