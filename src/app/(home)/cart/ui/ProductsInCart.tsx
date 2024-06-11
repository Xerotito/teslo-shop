'use client'

import Image from 'next/image'

import { QuantitySelector } from '@/components'
import { useCartStore } from '@/store'
import Link from 'next/link'

export const ProductsInCart = () => {

    //GlobalStore
    const productsInCart = useCartStore(state => state.cart)
    const { updateProductQuantity,removeCartProduct } = useCartStore()


    return (
        <>
            {
                productsInCart.map(product => (
                    <div key={`${product.slug}-${product.size}`} className='flex mb-5'>
                        <Image
                            src    = {`/products/${product.image}`}
                            alt    = {product.title}
                            width  = {100}
                            height = {100}
                            style  = {{
                                width: '100px',
                                height: '100px'
                            }}
                            className='mr-5 rounded'
                        />
                        <div className=''>
                            <Link 
                                className='hover:underline cursor-pointer'
                                href={`/product/${product.slug}`}>
                                {product.size}-{product.title}
                            </Link>
                            <p>${product.price}</p>
                            <QuantitySelector 
                                quantity          = {product.quantity}
                                onQuantityChanged = {quantity => updateProductQuantity(product,quantity)}
                            />
                            <button 
                                onClick={() => removeCartProduct(product)}
                                className = 'underline mt-3'>Remover</button
                            >
                        </div>
                    </div>
                ))
            }
        </>
    )
}