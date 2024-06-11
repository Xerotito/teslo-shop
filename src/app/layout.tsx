/** Layout global de la aplicación  */

import type { Metadata } from 'next'

import { Providers } from '@/components'
import { inter } from '@/config/fonts'
import './globals.css'


export const metadata: Metadata = {
    title      : {
        template: '%s - Teslo | Shop',
        default : 'Home - Teslo | Shop'
    },
    description: 'Proyecto final curso next13, tienda virtual de productos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='es'>
            <body className={inter.className}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
