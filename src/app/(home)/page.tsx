export const revalidate = 60

import { redirect } from 'next/navigation'
import { getPaginatedProductsWhitImages } from '@/actions'

import { Pagination, ProductGrid, Title } from '@/components'

/* Se utilizaba cuando se cargaban los productos en duro desde una seed (inicio del proyecto) */
// import { initialData } from '@/seed/seed'
// const products = initialData.products

interface Props {
    searchParams: {
        page?: string
    }
}

export default async function Home({ searchParams }: Props) {

    const page = searchParams.page ? parseInt(searchParams.page) : 1

    /* 
    server action busca en la bd y retorna los productos, la página actual de navegación y el total de páginas
    con estos valores armamos la grilla de productos y el paginado de navegación. 
    */
    const { products,currentPage,totalPages } = await getPaginatedProductsWhitImages({page})

    if (products.length === 0) redirect('/')


    return (
        <>
            <Title
                title     = {'Tienda'}
                subtitle  = 'Todos los productos'
                className = 'mt-2'
            />
            <ProductGrid products   = {products} />
            <Pagination  totalPages = {totalPages} />
        </>
    )
}
