import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Left, Right, ListItem, Thumbnail, Body } from "native-base";
import { hostIP } from "../../assets/common/baseUrl";

const CartItem = (props) => {
  const data = props.item.item.product;
  const [quantity, setQuantity] = useState(props.item.item.quantity);

  return (
    <ListItem style={styles.listItem} key={Math.random()} avatar>
      <Left>
        <Thumbnail
          source={{
            uri: data.image
              ? `${hostIP}${data.image}`
              : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
          }}
        />
      </Left>
      <Body style={styles.body}>
        <Text>{data.name}</Text>
        <Right>
          <Text>₹{data.price}</Text>
        </Right>
      </Body>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  body: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
  },
});
export default CartItem;
