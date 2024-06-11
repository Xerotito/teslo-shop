import { create } from 'zustand'
import { persist } from 'zustand/middleware' 

interface State {
  //State
  address: {
    firstName  : string,
    lastName   : string,
    address    : string,
    address2  ?: string,
    postalCode : string,
    city       : string,
    country    : string,
    phone      : string
  }
  //Methods
  getAddress: () => State['address'],
  setAddress: (address: State['address']) => void,
}

export const useAddressStore = create<State>()(
      /**
      * persist() guarda los datos automáticamente en el localStorage con el nombre address-storage
      */
  persist(
    (set, get) => ({
      address: {
        firstName : '',
        lastName  : '',
        address   : '',
        address2  : '',
        postalCode: '',
        city      : '',
        country   : '',
        phone     : '',
      },
      setAddress: (address) => { set({ address }) },
      getAddress: () => get().address
    }),
    { 
      name: 'address-storage' 
    }
  )
)