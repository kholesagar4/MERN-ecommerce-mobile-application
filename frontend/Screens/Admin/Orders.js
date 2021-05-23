import React, { useState, useCallback } from "react";
import { View, FlatList, Text } from "react-native";
import axios from "axios";
import { baseURL } from "../../assets/common/baseUrl";
import { useFocusEffect } from "@react-navigation/native";
import OrderCard from "../../Shared/OrderCard";

const Orders = (props) => {
  const [orderList, setOrderList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getOrders();
      return () => {
        setOrderList([]);
      };
    }, [])
  );
  const getOrders = () => {
    axios
      .get(`${baseURL}orders`)
      .then((res) => {
        setOrderList(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <View>
      <FlatList
        data={orderList}
        renderItem={({ item }) => (
          <OrderCard navigation={props.navigation} {...item} editMode={true} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
export default Orders;
