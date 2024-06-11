'use client'

import Link from 'next/link'
import { titleFont } from '@/config/fonts'
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5'

import { useCartStore, useUIStore } from '@/store';
import { useEffect, useState } from 'react';


export const TopMenu = () => {

    const { isSideMenuOpen, openSideMenu } = useUIStore()
    //GlobalStore
    const totalItemsInCart = useCartStore(state => state.getTotalItems())

    const [loadedCart, setLoadedCart] = useState(false)

    /**
     * Soluciona el problema de hidratación al renderizar la cantidad de productos del lado del cliente
     * ya que desde el servidor siempre sera 0, y esto no coincide generando conflictos
     */
    useEffect(() => { setLoadedCart(true) }, [])
    

    return (
        <nav className='flex px-5 justify-between items-center w-full'>

            {/* Logo */}
            <div>
                <Link href={'/'}>
                    <span className={`${titleFont.className} antialiased font-bold`}>Teslo</span>
                    <span> | Shop</span>
                </Link>
            </div>

            {/* Center menu */}
            <div className='hidden sm:block'>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100' href={'/gender/men'}>Hombres</Link>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100' href={'/gender/women'}>Mujeres</Link>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100' href={'/gender/kid'}>Niños</Link>
            </div>

            {/* Search, Cart, Menu */}
            <div className='flex items-center'>

                <Link href={'/search'} className='mx-2'>
                    <IoSearchOutline className='w-5 h-5' />
                </Link>

                <Link 
                    href      = { (totalItemsInCart === 0 && loadedCart) ? '/empty' : '/cart' }
                    className = 'mx-2'
                    >
                    <div className='relative'>
                        { (loadedCart && totalItemsInCart > 0) &&
                            ( <span className='fade-in absolute text-xs rounded-full font-bold px-1 -top-2 -right-2 bg-blue-700 text-white'>
                                {totalItemsInCart}
                            </span> )
                        }
                        <IoCartOutline className='w-5 h-5'/>
                    </div>
                </Link>

                <button 
                    onClick={() => openSideMenu()}
                    className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'
                    >
                    Menú
                </button>

            </div>
        </nav>
    )
} 