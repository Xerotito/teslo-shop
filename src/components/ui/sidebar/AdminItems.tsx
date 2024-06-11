import { useUIStore } from '@/store';
import Link from 'next/link'
import { IoPeopleOutline, IoShirtOutline, IoTicketOutline } from 'react-icons/io5'

export const AdminItems = () => {

    const { closeSideMenu } = useUIStore();

    return (
        <>  
            <h3 className='text-2xl underline text-blue-400'>Admin Panel</h3>
            <Link
                href      = {'/admin/products'}
                onClick   = { () => closeSideMenu() }
                className = 'flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
            >
                <IoShirtOutline size={30} />
                <span className='ml-3 text-xl'>Productos</span>
            </Link>

            <Link
                href      = {'/admin/orders'}
                onClick   = { () => closeSideMenu() }
                className = 'flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
            >
                <IoTicketOutline size={30} />
                <span className='ml-3 text-xl'>Ordenes</span>
            </Link>

            <Link
                href      = {'/admin/users'}
                onClick   = { () => closeSideMenu() }
                className = 'flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all'
            >
                <IoPeopleOutline size={30} />
                
                <span className='ml-3 text-xl'>Usuarios</span>
            </Link>
        </>
    )
}