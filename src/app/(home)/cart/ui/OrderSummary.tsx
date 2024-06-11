'use client'

import { useEffect, useState } from 'react'

import { useCartStore } from '@/store'
import { currencyFormat } from '@/utils'

export const OrderSummary = () => {
    //GlobalState
    const { itemsInCart, subTotal, impuestos, total } = useCartStore(state => state.getSummaryInformation() )

    const [loaded, setLoaded] = useState(false)

    useEffect(() => { setLoaded(true) },[])

    if(!loaded) return <p>Cargando datos...</p>
    

    return (
        <div className='grid grid-cols-2'>
            <span>No. Productos</span>
            <span className='text-right'>{itemsInCart === 1 ? '1 articulo' : `${itemsInCart} artículos`}</span>

            <span>Subtotal</span>
            <span className='text-right'>{currencyFormat(subTotal)}</span>


            <span>Impuestos (21%)</span>
            <span className='text-right'>{currencyFormat(impuestos)}</span>

            <span className='mt-5 text-2xl'>Total:</span>
            <span className='mt-5 text-2xl text-right'>{currencyFormat(total)}</span>
        </div>
    )
}