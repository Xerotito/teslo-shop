import type { CartProduct } from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware' //Middleware de Zustand que almacena en localStorage los datos del estado

interface State {
  //State
  cart: CartProduct[],
  //Métodos  
  getTotalItems        : () => number,
  getSummaryInformation: () => {
    subTotal   : number,
    impuestos  : number,
    itemsInCart: number,
    total      : number,
  },
  addProductToCart     : (product:CartProduct) => void,
  updateProductQuantity: (product:CartProduct, quantity:number) => void,
  removeCartProduct    : (product: CartProduct ) => void,
  clearCart            : () => void,
}

export const useCartStore = create<State>()(
  persist(
    (set,get)=> ({

      //State
      cart: [],
  
      //Métodos
      getTotalItems: () => {
        const {cart} = get()
        return cart.reduce((total, item) => total + item.quantity , 0)
      },
      //------------------------------------------------------------------------------------------------------------
      getSummaryInformation: () => {
        const { cart }  = get()
        const subTotal  = cart.reduce( (acc, product) => (product.quantity * product.price) + acc, 0 )
        const impuestos = subTotal * 0.21
        const total     = subTotal + impuestos
        const itemsInCart = cart.reduce((total, item) => total + item.quantity , 0)
        return { subTotal, impuestos, itemsInCart, total }
      },
      //------------------------------------------------------------------------------------------------------------
      addProductToCart: (product: CartProduct) => {
        const { cart } = get()
        //1. Revisar si el producto existe en el carrito con la talla seleccionada
        //Evalúa si el producto existe y si existe ya en la talla seleccionada
        const productInCart = cart.some( (item) => (item.id === product.id && item.size === product.size) )
        //Si esta condición es falsa es decir no existe agregamos al carrito
        if (!productInCart) {
          set({ cart: [...cart, product] })
          return
        }
  
        //2. Si el producto ya existe por talla aumentamos la cantidad
        const updateCartProducts = cart.map( item => {
          if(item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity }
          }
          return item
        })
  
        set({cart: updateCartProducts})
      },
      //-------------------------------------------------------------------------------------------------------------
      updateProductQuantity: (product:CartProduct, quantity:number) =>  {
        const { cart } = get()
        const updateQuantity = cart.map(item => {
          if(item.id === product.id && item.size === product.size){
            return {...item, quantity: quantity}  
          }
          return item                  
        })
        set({cart: updateQuantity})
      },
    //-------------------------------------------------------------------------------------------------------------
      removeCartProduct: (product:CartProduct) =>{
        const { cart } = get()
        const removeProduct = cart.filter(item => item.id !== product.id || item.size !== product.size)
        set({ cart: removeProduct })
      }, 
    //-------------------------------------------------------------------------------------------------------------
      clearCart: () => { set({ cart: [] }) }
    }),

    { name : 'shopping-cart' }
    
  )
)