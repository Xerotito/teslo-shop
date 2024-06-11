export const revalidate = 604800 //7 días

import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { titleFont } from '@/config/fonts'
import { getProductsBySlug } from '@/actions'
import { ProductMobileSlideshow, ProductSlideshow, StockLabel } from '@/components'
import { AddToCart } from './ui/AddToCart'


interface Props {
    params: {
        slug: string
    }
}

//Metadata dinámica
export async function generateMetadata({ params }: Props,parent: ResolvingMetadata): Promise<Metadata> {
    // read route params
    const slug = params.slug

    const product = await getProductsBySlug(slug)

    // optionally access and extend (rather than replace) parent metadata
    // const previousImages = (await parent).openGraph?.images || []

    return {
        title      : product?.title ?? 'Producto no encontrado',
        description: product?.description ?? '',
        openGraph  : {
            title      : product?.title ?? 'Producto no encontrado',
            description: product?.description ?? '',
            images     : [`/products/${product?.images[1]}`],
        },
    }
}
export default async function ProductSlugPage({ params }: Props) {

    const { slug } = params
    const product = await getProductsBySlug(slug)

    if (!product) notFound()

        return (
            <div className='mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3'>

                <div className='col-span-1 md:col-span-2'>
                {/* Desktop slideshow*/}
                    <ProductSlideshow 
                        images    = {product.images}
                        title     = {product.title}
                        className = 'hidden md:block'
                        />
                {/* Mobile slideshow */}
                    <ProductMobileSlideshow 
                        images={product.images} 
                        title={product.title}
                        className='block md:hidden'
                        />
                </div>


                {/* Detalles del producto */}
                <div className='col-span-1 px-5'>
                    <StockLabel slug={product.slug}  />

                    <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
                        {product.title}
                    </h1>
                    <p className='text-lg mb-5'>${product.price}</p>

                    {/* Selector de talles y agregar al carrito */}
                    <AddToCart product={product} />

                    {/* Descripción */}
                    <h3 className='font-bold text-sm'>Descripción</h3>
                    <p className='font-light'>{product.description}</p>
                </div>
            </div>
        )
}