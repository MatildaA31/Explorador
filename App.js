import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FavoritosContext } from './context/FavoritosContext';

import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';
import FavoritosScreen from './screens/FavoritosScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // guardamos solo los nombres de los pokemon marcados como favoritos
  const [favoritos, setFavoritos] = useState([]);

  const toggleFavorito = (nombre) => {
    setFavoritos((actual) => {
      if (actual.includes(nombre)) {
        // ya estaba, lo saco
        return actual.filter((n) => n !== nombre);
      }
      // no estaba, lo agrego en este caso 
      return [...actual, nombre];
    });
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Lista" component={ListScreen} />
          <Stack.Screen name="Detalle" component={DetailScreen} />
          <Stack.Screen name="Favoritos" component={FavoritosScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritosContext.Provider>
  );
}
