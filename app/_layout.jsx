import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" component={Index} />
      <Stack.Screen name="cart" component={CartPage} />
    </Stack>
  );
};

export default Layout;