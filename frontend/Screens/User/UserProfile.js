import React, { useContext, useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Button } from "react-native";
import { Container } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import { baseURL } from "../../assets/common/baseUrl";
import EasyButton from "../../Shared/StyleComponents/EasyButton";

import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/actions/auth.actions";
import OrderCard from "../../Shared/OrderCard";

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [orders, setOrders] = useState();

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("Login");
      }
      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => {
              setUserProfile(user.data);
            });
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .get(`${baseURL}orders`)
        .then((res) => {
          const data = res.data;
          const useOrders = data.filter(
            (order) => order.user._id === context.stateUser.user.userId
          );
          setOrders(useOrders);
        })
        .catch((error) => {
          console.log(error);
        });

      return () => {
        setUserProfile();
        setOrders();
      };
    }, [context.stateUser.isAuthenticated])
  );
  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        <Text style={{ fontSize: 30 }}>
          {userProfile ? userProfile.name : ""}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text style={{ margin: 10 }}>
            Email: {userProfile ? userProfile.email : ""}
          </Text>
          <Text style={{ margin: 10 }}>
            phone: {userProfile ? userProfile.phone : ""}
          </Text>
        </View>
        <View style={{ marginTop: 80 }}>
          <EasyButton
            large
            secondary
            onPress={() => [
              AsyncStorage.removeItem("jwt"),
              logoutUser(context.dispatch),
            ]}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold" }}>Sign out</Text>
          </EasyButton>
        </View>
        <View>
          <Text style={{ fontSize: 20 }}>My Orders</Text>
          <View style={styles.order}>
            {orders ? (
              orders.map((x) => {
                return <OrderCard key={x.id} {...x} />;
              })
            ) : (
              <View>
                <Text>You have no Orders</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  subContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  order: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 60,
  },
});
export default UserProfile;
