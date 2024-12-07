import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/Home';
import Cart from './components/Cart';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Список товаров' }} // Настройки заголовка
        />
        <Stack.Screen 
          name="Cart" 
          component={Cart} 
          options={{ title: 'Корзина' }} // Настройки заголовка
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
