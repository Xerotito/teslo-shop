'use client'

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { CreateOrderData, CreateOrderActions, OnApproveActions, OnApproveData } from '@paypal/paypal-js'
import { paypalCheckPayment, setTransactionId } from '@/actions'


//OrderId id de la order en la BD 
interface Props {
    orderId: string,
    amount : number,
}

export const PaypalButton = ({ orderId, amount }: Props) => {


    const [{ isPending }] = usePayPalScriptReducer()
    const roundedAmount = Math.round(amount * 100) / 100  //Redondea los decimales a 2

    if (isPending) {
        return (
            <div className='animate-pulse mb-16'>
                <div className='h-11 bg-gray-300 rounded-none' />
                <div className='h-11 bg-gray-300 rounded-none mt-2' />
            </div>
            )
    }

    /**
     * Envía a paypal el Id de transacción y el id de la orden
     * Esto se guarda en su base de datos la cual luego podemos consultar por su API
     * y asi saber realmente si el producto se pago y cambiar nuestra interfaz en base a ello.
     */
    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
        const transactionId = await actions.order.create({
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount    : {
                        value: `${roundedAmount}`,
                    },
                },
            ],
        })

        //Guarda el transactionId en la orden de la base de datos
        const { ok } = await setTransactionId(orderId, transactionId)
        if (!ok ) throw new Error ('No se pudo actualizar la orden')
        
        return transactionId    
    }

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        const details = await actions.order?.capture()
        if(!details) return
        await paypalCheckPayment(details.id)
    }

    return (
        <div className='relative z-0'>
            <PayPalButtons
                createOrder = {createOrder}
                onApprove   = {onApprove}
            />
        </div>


    )
}