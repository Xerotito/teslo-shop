'use server'

import { revalidate } from '@/app/(home)/page'
/**
 * Server Action que se encarga de gestionar el cobro con paypal
 * Genera un token de autentificación que necesita la API de paypal 
 * Luego con ese token y la transacciónId que ya esta guardada en la BD corrobora el pago con el backend de paypal 
 */

import type{ PayPalOrderStatusResponse } from '@/interfaces'
import prisma from '@/libs/prisma'
import { revalidatePath } from 'next/cache'

export const paypalCheckPayment = async (paypalTransactionId: string) => {

  
/* Fn que genera el token de autentificación para la API de paypal */
  const authToken = await getPayPalBearToken()
  // console.log({ authToken })

  if(!authToken) return {
    ok     : false,
    message: 'No se puedo obtener token de verificación'
  }

/* Con el token generado y el transactionId de la base de datos podemos consultar el pago a paypal */
  const paypalResponse = await verifyPayPalPayment(paypalTransactionId, authToken)

  if(!paypalResponse) return {
    ok     : false,
    message: 'Error al verificar el pago',
  }

  /**
   * El backend de paypal nos retorna el id de la factura (invoice_id === orderId)
   * con la cual corrobora el pago de dicha orden desde paypal
   */
  const { status, purchase_units } = paypalResponse
  const { invoice_id: orderId } = purchase_units[0] 

  if(status !== 'COMPLETED') return {
    ok     : false,
    message: 'Aún no se realizado el pago en paypal'
  }

  //Realiza la actualización en la base de datos una vez aprobada la compra
  try {
    await prisma.order.update({
      where: { id: orderId  },
      data : { 
        isPaid: true,
        paidAt: new Date(),
      }
    })

  } catch (error) {
    console.log(error)
    return {
      ok     : false,
      message: 'El pago no se pudo realizar'
    }
  }

  //Recarga de path (revalidar path) para actualizar la interface (botones y orden pagada)
  revalidatePath(`orders/${orderId}`)

  return { ok: true }
}

/* Fn que genera el token de autentificación para la API de paypal */
const getPayPalBearToken = async (): Promise<string | null> => {

  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET    = process.env.PAYPAL_SECRET

  const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,'utf-8').toString('base64')

  const headersList = {
    "Accept"       : "*/*",
    "User-Agent"   : "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `Basic ${base64Token}`,
    "Content-Type" : "application/x-www-form-urlencoded"
  }

  const bodyContent = "grant_type=client_credentials";

  const requestOptions = {
    method : "POST",
    headers: headersList,
    body   : bodyContent,
  }

  try {
    const data = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      ...requestOptions,
      cache: 'no-store'
    }).then(resp => resp.json())

    return data.access_token

  } catch (error) {

    console.log(error)
    return null

  }

}

/* Con el token generado y el transactionId de la base de datos podemos consultar el pago a paypal */
const verifyPayPalPayment = async (paypalTransactionId: string, bearerToken: string): Promise<PayPalOrderStatusResponse | null> => {

  const headersList = {
    "Accept"       : "*/*",
    "User-Agent"   : "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `Bearer ${bearerToken}`
  }

  const requestOptions = {
    method : "GET",
    headers: headersList
  }

  try {
    const data = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${paypalTransactionId}`, {
      ...requestOptions,
      cache: 'no-store'
    }).then(resp => resp.json())
  
    return data

  } catch (error) {
    console.log(error)
    return null
  }

}

