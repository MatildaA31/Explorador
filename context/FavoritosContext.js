import { createContext, useContext } from 'react';

// En este caso no use AysncStorge, por lo que los favoritos se mantendran unicamente cuando la aplicacion se encuentre ejecutandose
export const FavoritosContext = createContext();

export function useFavoritos() {
  return useContext(FavoritosContext);
}
