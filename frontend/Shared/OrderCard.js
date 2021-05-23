import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import { baseURL } from "../assets/common/baseUrl";
import Dropdown from "../Components/Dropdown";
import EasyButton from "./StyleComponents/EasyButton";
import TrafficLight from "./StyleComponents/TrafficLight";

const codes = [
  { label: "pending", value: "3" },
  { label: "shipped", value: "2" },
  { label: "delivered", value: "1" },
];

const OrderCard = (props) => {
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [statusChange, setStatusChange] = useState();
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();

  useEffect(() => {
    if (props.editMode) {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (props.status == "3") {
      setOrderStatus(<TrafficLight unavailable></TrafficLight>);
      setStatusText("pending");
      setCardColor("#E74c3c");
    } else if (props.status == "2") {
      setOrderStatus(<TrafficLight limited></TrafficLight>);
      setStatusText("shipped");
      setCardColor("#F1C40f");
    } else {
      setOrderStatus(<TrafficLight available></TrafficLight>);
      setStatusText("delivered");
      setCardColor("#2ECC71");
    }
    return () => {
      setOrderStatus();
      setStatusText();
      setCardColor();
    };
  }, []);

  const updateOrder = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const order = {
      city: props.city,
      country: props.country,
      dateOrdered: props.dateOrdered,
      id: props.id,
      orderItems: props.orderItems,
      phone: props.phone,
      shippingAddress1: props.shippingAddress1,
      shippingAddress2: props.shippingAddress2,
      status: statusChange,
      totalPrice: props.totalPrice,
      user: props.user,
      zip: props.zip,
    };

    axios
      .put(`${baseURL}orders/${props.id}`, order, config)
      .then((res) => {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Order Edited",
          text2: "",
        });
        setTimeout(() => {
          props.navigation.navigate("Cart");
        }, 500);
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };
  return (
    <View style={[styles.container, { backgroundColor: cardColor }]}>
      <View style={styles.container}>
        <Text style={styles.textColor} >Order Number #{props.id}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={styles.textColor}>
          Status: {statusText} {orderStatus}
        </Text>
        <Text style={styles.textColor}>
          Address: {props.shippingAddress1} {props.shippingAddress2}
        </Text>
        <Text style={styles.textColor}>City: {props.city}</Text>
        <Text style={styles.textColor}>Country: {props.country}</Text>
        <Text style={styles.textColor}>Data Order: {props.dateOrdered.split("T")[0]}</Text>

        <View style={styles.priceContainer}>
          <Text>Price: </Text>
          <Text style={styles.price}>{props.totalPrice}</Text>
        </View>
        {props.editMode ? (
          <View>
            <Dropdown
              placeholder={{
                label: "Change Status",
                value: null,
                color: "#007aff",
              }}
              onValueChange={(e) => setStatusChange(e)}
              items={codes}
              value={statusChange}
            />
            <EasyButton large secondary onPress={() => updateOrder()}>
              <Text style={{ color: "white" }}>Update</Text>
            </EasyButton>
          </View>
        ) : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    backgroundColor: "#62B1F6",
    padding: 5,
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  price: {
    color: "white",
    fontWeight: "bold",
  },
  textColor:{
    color:'#FFF'
  }
});
export default OrderCard;
