import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const database = await SQLite.openDatabaseAsync('store.db');
      setDb(database);

      // Создаем таблицу, если её еще нет
      database.transaction(tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, image TEXT, price REAL, description TEXT);"
        );
      });
    };

    initDB();
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [db]); // Теперь fetchCartItems вызывается, когда db инициализирована

  const fetchCartItems = async () => {
    if (!db) return; // Если база данных еще не инициализирована, выходим

    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM cart",
        [],
        (_, { rows }) => setCartItems(rows._array),
        (tx, error) => console.error("Ошибка при получении корзины:", error)
      );
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text>Цена: ${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
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

export default Cart;
