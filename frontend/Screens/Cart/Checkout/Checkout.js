import React, { useEffect, useState, useContext } from "react";
import { Text, View, Button, Platform, StyleSheet } from "react-native";
import {
  Item,
  Picker,
  Header,
  Body,
  Title,
  Content,
  Container,
} from "native-base";

import Icon from "react-native-vector-icons/FontAwesome";
import FormContainer from "../../../Shared/Form/FormContainer";
import Input from "../../../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const countries = require("../../../assets/data/countries.json");
import AuthGlobal from "../../../Context/store/AuthGlobal"

import Dropdown from "../../../Components/Dropdown";

import { connect } from "react-redux";

const Checkout = (props) => {


  const context = useContext(AuthGlobal)

  const [orderItems, setOrderItems] = useState();
  const [address, setAddress] = useState();
  const [address2, setAddress2] = useState();
  const [city, setCity] = useState();
  const [zip, setZip] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [ user, setUser ] = useState();
  useEffect(() => {
    setOrderItems(props.cartItems);

    if(context.stateUser.isAuthenticated) {
      setUser(context.stateUser.user.userId)
  } else {
      props.navigation.navigate("Cart");
      Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Please Login to Checkout",
          text1: "Please Login to Checkout",
          text2: ""
      });
  }


    return () => {
      setOrderItems();
    };
  }, []);

  const checkOut = () => {
    let order = {
      city,
      country,
      dateOrdered: Date.now(),
      orderItems,
      phone,
      shippingAddress1: address,
      shippingAddress2: address2,
      zip,
      status: 3,
      user,
    };
    props.navigation.navigate("Payment", { order: order });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <Container>
        <Header style={{ backgroundColor: "#F8F8F8" }}>
          <Body style={{ alignItems: "center" }}>
            <Title style={{ color: "black" }}>Shipping Address</Title>
          </Body>
        </Header>
        <Content>
          <FormContainer>
            <Input
              placeholder={"Phone"}
              name={"Phone"}
              value={phone}
              keyboardType={"numeric"}
              onChangeText={(text) => setPhone(text)}
            />

            <Input
              placeholder={"Shipping Address 1"}
              name={"ShippingAddress1"}
              value={address}
              onChangeText={(text) => setAddress(text)}
            />
            <Input
              placeholder={"Shipping Address 2"}
              name={"ShippingAddress2"}
              value={address2}
              onChangeText={(text) => setAddress2(text)}
            />

            <Input
              placeholder={"City"}
              name={"city"}
              value={city}
              onChangeText={(text) => setCity(text)}
            />

            <Input
              placeholder={"Zip Code"}
              name={"zip"}
              value={zip}
              keyboardType={"numeric"}
              onChangeText={(text) => setZip(text)}
            />

            <Dropdown
              placeholder={{
                label: "Select your country",
                value: null,
                color: "red",
              }}
              onValueChange={(e) => setCountry(e)}
              items={countries}
              value={country}
            />

            {/* <Item picker>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            color={"#007aff"}
            style={{ width:(Platform.OS === 'ios') ? undefined : 120 }}
            selectedValue={country}
            placeholder="Select Your country"
            placeholderStyle={{ color: "#007aff" }}
            placeholderIconColor="#007aff"
            onValueChange={(e) => setCountry(e)}
          >
            {countries.map((c) => {
              return <Picker.Item key={c.code} label={c.name} value={c.name} />;
            })}
          </Picker>
        </Item> */}
            <View style={{ width: "80%", alignItems: "center" }}>
              <Button title="Confirm" onPress={() => checkOut()} />
            </View>
          </FormContainer>
        </Content>
      </Container>
    </KeyboardAwareScrollView>
  );
};
const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

const styles = StyleSheet.create({
  dropdownContainer: {
    width: "80%",
    height: 60,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "gray",
    margin: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingLeft: 10,
    color: "black", // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: "100%",
    height: 60,
    paddingLeft: 10,
    color: "black", // to ensure the text is never behind the icon
  },
});
export default connect(mapStateToProps, null)(Checkout);
