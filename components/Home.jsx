import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const database = await SQLite.openDatabaseAsync('store.db');
      setDb(database);

      // Создание таблицы корзины
      database.transaction(tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, image TEXT, price REAL, description TEXT);"
        );
      });
    };

    initDB();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    setProducts(data);
  };

  const addToCart = (product) => {
    if (!db) {
      console.error("База данных еще не инициализирована.");
      return; // Прекратить выполнение, если база данных не инициализирована
    }
    
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO cart (title, image, price, description) VALUES (?, ?, ?, ?)",
        [product.title, product.image, product.price, product.description],
        () => console.log("Добавлено в корзину"),
        (tx, error) => console.error("Ошибка при добавлении в корзину:", error)
      );
    });
  };

  const navigateToCart = () => {
    navigation.navigate('Cart');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Цена: ${item.price}</Text>
      <Button title="Добавить в корзину" onPress={() => addToCart(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
      <Button title="Перейти в корзину" onPress={navigateToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default Home;
