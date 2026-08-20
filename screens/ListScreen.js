import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFavoritos } from '../context/FavoritosContext';

export default function ListScreen({ navigation }) {
  const [pokemones, setPokemones] = useState([]);
  const [todos, setTodos] = useState([]); 
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { favoritos } = useFavoritos();

  useEffect(() => {
    traerPokemones();
  }, []);

  const traerPokemones = async () => {
    setCargando(true);
    setError('');
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
      if (!res.ok) {
        setError('No se pudo cargar el listado');
        setCargando(false);
        return;
      }
      const data = await res.json();

      const lista = data.results.map((p) => {
        const partes = p.url.split('/').filter(Boolean);
        const id = partes[partes.length - 1];
        return {
          id,
          nombre: p.name,
          imagen: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });

      setPokemones(lista);
      setTodos(lista);
    } catch (e) {
      setError('Error de conexión');
    }
    setCargando(false);
  };

  const buscar = (texto) => {
    setBusqueda(texto);
    if (texto === '') {
      setPokemones(todos);
      return;
    }
    const filtrados = todos.filter((p) =>
      p.nombre.toLowerCase().includes(texto.toLowerCase())
    );
    setPokemones(filtrados);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Explorador</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
          <Text style={{ color: '#2563eb' }}>Favoritos ({favoritos.length})</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.buscador}
        placeholder="Buscar pokémon..."
        value={busqueda}
        onChangeText={buscar}
        autoCapitalize="none"
      />

      {cargando && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {!cargando && !error && (
        <FlatList
          data={pokemones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Detalle', { nombre: item.nombre })}
            >
              <Image source={{ uri: item.imagen }} style={styles.img} />
              <View>
                <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{item.nombre}</Text>
                <Text style={{ color: '#666' }}>Nº {item.id}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.error}>No se encontraron resultados</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  buscador: { borderWidth: 1, borderColor: '#999', padding: 10, marginBottom: 15 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10 },
  img: { width: 50, height: 50, marginRight: 10 },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
});
