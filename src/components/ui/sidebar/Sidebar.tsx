'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPersonOutline, IoSearchOutline, IoTicketOutline } from 'react-icons/io5'
import clsx from 'clsx'

import { logout } from '@/actions'
import { useUIStore } from '@/store'
import { AdminItems } from './AdminItems'


export const Sidebar = () => {

    const { isSideMenuOpen, openSideMenu ,closeSideMenu } = useUIStore();
    const { data: session } = useSession()
    
    const isAuthenticated = !!session?.user
    const isAdmin         = session?.user.role === 'admin'

    return (
        <div>
            {/* Background black */}
            {isSideMenuOpen && (
                <div className='fixed tip-0 left-0 w-screen h-screen z-10 bg-black opacity-30' />
            )}

            {/* Blur */}
            {isSideMenuOpen && (
                <div
                    onClick={() => closeSideMenu()}
                    className='fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm'
                />
            )}

            {/* Side menu */}
            <nav
                className={clsx(
                    'fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300',
                    { 'translate-x-full': !isSideMenuOpen }
                )}
            >
                <IoCloseOutline
                    size={50}
                    className='absolute top-5 right-5 cursor-pointer'
                    onClick={() => closeSideMenu()}
                />

                {/* Input */}
                <div className='relative mt-14'>
                    <IoSearchOutline
                        size={20}
                        className='absolute top-2 left-2'
                    />
                    <input
                        type='text'
                        placeholder='Buscar'
                        className='w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500'
                    />
                </div>

                {/* Menu */}



                { !isAuthenticated && (
                    <Link
                        href      = {'/auth/login'}
                        onClick   = {() => closeSideMenu()}
                        className = 'flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
                    >
                        <IoLogInOutline size={30} />
                        <span className='ml-3 text-xl'>Ingresar</span>
                    </Link>
                ) }

                {isAuthenticated && (
                    <>
                        <Link
                            href      = {'/profile'}
                            onClick   = {() => closeSideMenu()}
                            className = 'flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
                        >
                            <IoPersonOutline size={30} />
                            <span className='ml-3 text-xl'>Perfil</span>
                        </Link>

                        <Link
                            href      = {'/orders'}
                            onClick   = {() => closeSideMenu()}
                            className = 'flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
                        >
                            <IoTicketOutline size={30} />
                            <span className='ml-3 text-xl'>Ordenes</span>
                        </Link>
                        <button
                            onClick   = {() => logout()}
                            className = 'flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
                        >
                            <IoLogOutOutline size={30} />
                            <span className='ml-3 text-xl'>Salir</span>
                        </button>
                    </>
                ) }

                {/* Items que solo aparecen si el usuario es administrador */}
                { isAdmin && (
                    <>
                        {/* Line separator */}
                        <div className='w-full h-px bg-gray-200 my-10' />
                        <AdminItems />
                    </>
                ) }

            </nav>
        </div>
    )
}
