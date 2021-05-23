import React from "react";
import { StyleSheet, View, LogBox, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";

//Redux
import { Provider } from "react-redux";
import store from "./Redux/store";

//Context API
import Auth from "./Context/store/Auth";

//Navigator
import Main from "./Navigators/Main";
//Screens
import ProductContainer from "./Screens/Products/ProductContainer";
import Header from "./Shared/Header";

LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <Auth>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar backgroundColor="red" barStyle="light-content" />
          <Main />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </Provider>
    </Auth>
  );
}
