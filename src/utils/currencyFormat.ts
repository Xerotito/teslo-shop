/**
 * Función para el formateo de divisas en este caso dólar, la fn interna que retorna es propia de js
 */

export const currencyFormat = (value: number) => {
  return Intl.NumberFormat('en-US',{
    style                : 'currency',
    currency             : 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}