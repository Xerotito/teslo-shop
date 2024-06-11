export const revalidate = 0

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedOrders, getPaginatedUser } from '@/actions'
import { Pagination, Title } from '@/components'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { IoCardOutline } from 'react-icons/io5'
import { UserTable } from './ui/UserTable'

export default async function UserManagement () {


    const { ok, users = [] } = await getPaginatedUser() 

    if(!ok) redirect('/auth/login')
    

    return (
        <>
            <Title title="Gestión de usuarios" />

            <div className="mb-10">
                <UserTable users={users} />
            </div>
        </>
    )
}