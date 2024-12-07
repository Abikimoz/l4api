import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('store.db'); // Открываем базу данных асинхронно
        setDb(database);

        // Выполняем запрос для получения товаров из корзины
        const result = await database.execAsync("SELECT * FROM cart");
        setCartItems(result.rows._array); // Получаем все товары из корзины
      } catch (error) {
        console.error("Ошибка при инициализации базы данных:", error);
      }
    };

    initDB();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Корзина</Text>
      {cartItems.length === 0 ? (
        <Text>Корзина пуста</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text>Цена: ${item.price}</Text>
            </View>
          )}
        />
      )}
      <Button title="Вернуться назад" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontWeight: 'bold',
  },
});

export default Cart;