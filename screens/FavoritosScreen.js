import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFavoritos } from '../context/FavoritosContext';

export default function FavoritosScreen({ navigation }) {
  const { favoritos, toggleFavorito } = useFavoritos();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ color: '#2563eb', marginBottom: 15 }}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Mis Favoritos</Text>

      {favoritos.length === 0 ? (
        <Text style={{ color: '#666', marginTop: 20 }}>Todavía no marcaste favoritos</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => navigation.navigate('Detalle', { nombre: item })}
              >
                <Text style={{ textTransform: 'capitalize' }}>{item}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleFavorito(item)}>
                <Text style={{ color: 'red' }}>Quitar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 15 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 10,
  },
});
