import { handlers } from '@/auth.config'

/**
 * Configuración de next-auth,estamos utilizando un <provider></provider> para acceder a la sesión del lado del cliente
 * esto se consulta en un endpoint con un GET generado en esta ruta
 * La importación del handler la realiza de la configuración de next-auth desde /auth.config.
 */

export const { GET, POST } = handlers