import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  Button,
  ScrollView,
} from "react-native";
import { Left, Right, Container, H1 } from "native-base";

import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import { hostIP } from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyleComponents/EasyButton";
import TrafficLight from "../../Shared/StyleComponents/TrafficLight";

const SingleProduct = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const [availability, setAvailability] = useState(null);

  const [availabilityText, setAvailabilityText] = useState("");

  useEffect(() => {
    if (props.route.params.item.countInStock == 0) {
      setAvailability(<TrafficLight unavailable></TrafficLight>);
      setAvailabilityText("Unavailable");
    } else if (props.route.params.item.countInStock == 5) {
      setAvailability(<TrafficLight limited></TrafficLight>);
      setAvailabilityText("Limited Stock");
    } else {
      setAvailability(<TrafficLight available></TrafficLight>);
      setAvailabilityText("Available");
    }

    return () => {
      setAvailabilityText("");
      setAvailability(null);
    };
  }, []);

  return (
    <Container style={styles.container}>
      <ScrollView style={{ marginBottom: 80, padding: 5 }}>
        <View>
          <Image
            source={{
              uri: item.image
                ? `${hostIP}${item.image}`
                : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
            }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        <View style={styles.contentContainer}>
          <H1 style={styles.contentHeader}>{item.name}</H1>
          <Text style={styles.contentText}>{item.brand}</Text>
        </View>
        <View style={styles.availabilityContainer}>
          <View style={styles.availability}>
            <Text style={{ marginRight: 10 }}>
              
              Availability: {availabilityText}
            </Text>
            {availability}
          </View>
          <Text>
            {item.description}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Left>
          <Text style={styles.price}>₹{item.price}</Text>
        </Left>
        <Right>
          <EasyButton
            primary
            medium
            onPress={() => {
              props.addItemToCart(item),
                Toast.show({
                  topOffset: 60,
                  type: "success",
                  text1: `${item.name} added to card`,
                  text2: "GO to your card to compleat order",
                });
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold" }}>Add</Text>
          </EasyButton>
        </Right>
      </View>
    </Container>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (product) =>
      dispatch(actions.addToCart({ quantity: 1, product })),
  };
};
const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
  },
  imageContainer: {
    backgroundColor: "white",
    padding: 0,
    margin: 0,
  },
  image: {
    width: "100%",
    height: 250,
  },
  contentContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contentHeader: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
  },
  price: {
    fontSize: 24,
    margin: 20,
    color: "red",
  },
  availabilityContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  availability: {
    flexDirection: "row",
    marginBottom: 10,
  },
  availabilityContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  availability: {
    flexDirection: "row",
    marginBottom: 10,
  },
});
export default connect(null, mapDispatchToProps)(SingleProduct);
