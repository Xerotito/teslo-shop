'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { placeOrder } from '@/actions'
import { useAddressStore, useCartStore } from '@/store'
import { currencyFormat } from '@/utils'
import clsx from 'clsx'


export const PlaceOrder = () => {
    
    const router                              = useRouter()
    const [loaded, setLoaded]                 = useState(false)
    const [errorMessage, setErrorMessage]     = useState('')
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    

    //Obtención de datos del globalStore
    const address  = useAddressStore(state => state.getAddress())
    const { cart, clearCart } = useCartStore()


    const { itemsInCart, subTotal, impuestos, total } = useCartStore(state => state.getSummaryInformation() )
    
    useEffect(() => { setLoaded(true) }, [])  
    
    //Deshabilita el botón de realizar el pedido mientras hace el llamado al server action
    const onPlaceHolder = async () => {
        setIsPlacingOrder(true)

        const productsToOrder = cart.map( product => ({
            productId: product.id,
            quantity : product.quantity,
            size     : product.size,
        }))

        /* Server Action que realiza las transacciones en la BD */
        const resp = await placeOrder(productsToOrder, address)
        //Si hay un error
        if (!resp.ok){
            setIsPlacingOrder(false)
            setErrorMessage(resp.message)
            return
        }
        //Si todo sale ok!
        clearCart()
        router.replace('/orders/' + resp.order?.id)
        
    }


    if (!loaded) { return (<p>...Cargando</p>) }

    return (
        <div className='bg-white rounded-xl shadow-xl p-7'>
            <h2 className='text-2xl mb-2'>Dirección de entrega</h2>
            <div className='mb-10 '>
                <p className='font-bold text-xl'>{address.firstName} {address.lastName}</p>
                <p className='font-semibold'>{address.address}</p>
                <p className='font-semibold'>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <div className='w-full h-0.5 rounded bg-gray-200 mb-10'>

            </div>

            <h2 className='text-2xl mb-2'>Resumen de orden</h2>
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

            <div className='mt-5 mb-2 w-full'>

                {/* Disclaimer */}
                <div className='mb-5'>
                    <span className='text-xs'>
                        Al hacer click en ${"Realizar Pedido"}, acepta nuestros <a href='#' className='underline'>términos y condiciones</a> y <a href='#' className='underline'>política de privacidad</a>
                    </span>
                </div>
                <p className='text-red-500'>{errorMessage}</p>
                <button
                    // href='/orders/123'
                    onClick   = {onPlaceHolder}
                    className = {clsx({
                        'btn-primary' : !isPlacingOrder,
                        'btn-disabled': isPlacingOrder,
                    })}
                >
                    Realizar pedido
                </button>
            </div>

        </div>
    )
}

