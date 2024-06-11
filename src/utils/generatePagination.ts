/**
 * Genera un array con la cantidad de paginas para el componente de paginación,
 * también crea los puntos suspensivos depende la cantidad de paginas
 */

export const generatePagination = (currentPage: number, totalPages: number) => {
  //Si el numero total es 7 o menos muestra las paginas sin puntos suspensivos
  if( totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1) //[1,2,3,4,5,6,7]

  //Si el currentPage está entra las primeras tres páginas, muestra las primeras 3, puntos suspensivos y las ultimas 2
  if(currentPage <= 3) return [1,2,3,'...',totalPages-1, totalPages] //[1,2,3,'...',49,50]

  //Si la pagina actual esta entre las últimas 3 páginas, muestra las primeras dos, puntos suspensivos y las ultimas tres
  if (currentPage >= totalPages - 2) return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]

  //Si la página actual esta en un intermedio, muestra la primera página, puntos suspensivos, la página actual y sus vecinos
  return [1,'...', currentPage - 1, currentPage, currentPage + 1, '...',totalPages]
}

