import { getCategories, getProductsBySlug } from '@/actions'
import { Title } from '@/components'
import { redirect } from 'next/navigation'
import { ProductForm } from './ui/ProductForm'

interface Props {
    params: {
        slug: string
    }
}

export default async function ProductSlugPage({ params }: Props) {

    const { slug } = params

    const [product, categories] = await Promise.all([
        getProductsBySlug(slug),
        getCategories()
    ]) 


    

    //TODO: New Product
    if(!product && slug !== 'new') redirect('/admin/product')

    const title = slug === 'new' ? 'Nuevo producto' : 'Editar producto' 

    return (
        <>
            <Title title={title} />
            <ProductForm product={product ?? {}} categories={categories} />
        </>
    )
}