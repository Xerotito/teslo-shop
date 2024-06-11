import Image from 'next/image'

interface Props {
    src      ?: string,
    alt       : string,
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className'],
    width     : number,
    height    : number,
}

export const ProductImage = ({
    src,
    alt,
    className,
    width,
    height
}: Props) => {
    /** 
     * Si el src viene sin http o https significa que la imagen viene de la ruta /products
     * Si el src es null o undefined mostramos el placeholder.jpg (imagen vacía por default) 
     * */
    const customSrc = (src)
        ? src.startsWith('http') // https://urlcompletodelaimagen.jpg
            ? src
            :`/products/${src}`
        : '/imgs/placeholder.jpg'

    return (
        <Image
            src       = {customSrc}
            className = {className}
            width     = {width}
            height    = {height}
            alt       = {alt}
        />
    )
}