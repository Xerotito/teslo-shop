//Fn que simula latencia en el servidor

export const sleep = (seconds: number = 1) => {
  return new Promise ( resolve => {
    setTimeout(() => { resolve(true) }, seconds * 1000)
  })
}