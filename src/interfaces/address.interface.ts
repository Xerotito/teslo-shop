export interface Address {
    firstName: string,
    lastName: string,
    address: string,
    address2?: string,
    postalCode: string,
    city: string,
    country: string,
    phone: string
}

export interface UserAddress {
    userId?: string,
    firstName: string,
    lastName: string,
    id?: string
    address: string,
    address2?: string,
    postalCode: string,
    city: string,
    country: string,
    phone: string
}
