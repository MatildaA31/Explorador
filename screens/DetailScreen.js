import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFavoritos } from '../context/FavoritosContext';

export default function DetailScreen({ route, navigation }) {
  const { nombre } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { favoritos, toggleFavorito } = useFavoritos();

  const esFavorito = favoritos.includes(nombre);

  useEffect(() => {
    cargarDetalle();
  }, [nombre]);

  const cargarDetalle = async () => {
    setCargando(true);
    setError('');
    try {
      // Aca estoy pidiendo datos basicos, y datos de especie para poder tener la descripcion y el habitat
      const res1 = await fetch('https://pokeapi.co/api/v2/pokemon/' + nombre);
      const res2 = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + nombre);

      if (!res1.ok || !res2.ok) {
        setError('No se pudo cargar el detalle');
        setCargando(false);
        return;
      }

      const data1 = await res1.json();
      const data2 = await res2.json();

      setPokemon(data1);

      const entrada = data2.flavor_text_entries.find((e) => e.language.name === 'en');
      setDescripcion(entrada ? entrada.flavor_text.replace(/\n|\f/g, ' ') : 'Sin descripción');

      setPokemon({
        ...data1,
        generacion: data2.generation.name,
        habitat: data2.habitat ? data2.habitat.name : 'desconocido',
      });
    } catch (e) {
      setError('Error de conexión');
    }
    setCargando(false);
  };

  if (cargando) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error !== '') {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#2563eb', marginTop: 10 }}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: '#2563eb', marginBottom: 15 }}>← Volver</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }}
        style={styles.img}
      />

      <View style={styles.filaTitulo}>
        <Text style={styles.titulo}>{pokemon.name}</Text>
        <TouchableOpacity onPress={() => toggleFavorito(nombre)}>
          <Text style={{ fontSize: 24 }}>{esFavorito ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Descripción</Text>
      <Text>{descripcion}</Text>

      <Text style={styles.label}>Generación (fecha)</Text>
      <Text>{pokemon.generacion}</Text>

      <Text style={styles.label}>Puntuación (experiencia base)</Text>
      <Text>{pokemon.base_experience}</Text>

      <Text style={styles.label}>Ubicación (hábitat)</Text>
      <Text style={{ textTransform: 'capitalize' }}>{pokemon.habitat}</Text>

      <Text style={styles.label}>Características</Text>
      <Text>Tipos: {pokemon.types.map((t) => t.type.name).join(', ')}</Text>
      <Text>Habilidades: {pokemon.abilities.map((a) => a.ability.name).join(', ')}</Text>
      <Text>Altura: {pokemon.height} | Peso: {pokemon.weight}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  img: { width: '100%', height: 200, marginBottom: 15 },
  filaTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', textTransform: 'capitalize' },
  label: { fontWeight: 'bold', marginTop: 12 },
  error: { color: 'red' },
}); 
