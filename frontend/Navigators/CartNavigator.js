import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Cart from "../Screens/Cart/Cart";
import CheckoutNavigator from "./CheckoutNavigator";
import { createNavigatorFactory } from "@react-navigation/core";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutNavigator}
        options={{ title: "Checkout" }}
      />
    </Stack.Navigator>
  );
}
export default function CartNavigator() {
  return <MyStack />;
}
