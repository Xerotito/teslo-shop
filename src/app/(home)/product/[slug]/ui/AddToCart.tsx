'use client'

import { QuantitySelector, SizeSelector } from '@/components'
import type { CartProduct, Product, Size } from '@/interfaces'
import { useCartStore } from '@/store'

import { useState } from 'react'

interface Props {
    product: Product
}

export const AddToCart = ({product}: Props) => {

    //GlobalStore
    const { cart,addProductToCart } = useCartStore()

    const [size, setSize]         = useState<Size | undefined>()
    const [quantity, setQuantity] = useState<number>(1)
    const [posted, setPosted]     = useState(false)

    const addToCart = () => {
        setPosted(true)
        if (!size) return

        const cartProduct: CartProduct = {
            id      : product.id,
            slug    : product.slug,
            title   : product.title,
            price   : product.price,
            quantity: quantity,
            size    : size,
            image   : product.images[0]
        }
        addProductToCart(cartProduct)
        setPosted(false)
        setQuantity(1)
        setSize(undefined)
    }
    
    return (
        <>
            { posted && !size && (
                <span className='mt-2 text-red-500'>
                    Debe de seleccionar una talla*
                </span>
            )}

            {/* Selector de tallas */}
            <SizeSelector selectedSize={size} availableSizes={product.sizes} onSizeChange={setSize} />

            {/* Selector de cantidad */}
            <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

            {/* Button */}
            <button 
                onClick={addToCart}
                className='btn-primary my-5 fade-in'
                >
                    Agregar al carrito
            </button>
        </>
    )
}