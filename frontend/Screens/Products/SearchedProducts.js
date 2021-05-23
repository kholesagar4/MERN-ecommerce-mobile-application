import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  Content,
  Left,
  Body,
  ListItem,
  Thumbnail,
  Text,
  Container,
} from "native-base";

var { width } = Dimensions.get("window");
import { hostIP } from "../../assets/common/baseUrl";

const SearchedProduct = (props) => {
  const { productsFiltered } = props;
  return (
    <Content style={{ width: width }}>
      {productsFiltered.length > 0 ? (
        productsFiltered.map((item) => (
          <ListItem
            onPress={() => {
              props.navigation.navigate("Product Detail", { item: item });
            }}
            key={item._id}
            avatar
          >
            <Left>
              <Thumbnail
                source={{
                  uri: item.image
                    ? `${hostIP}${item.image}`
                    : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                }}
              />
            </Left>
            <Body>
              <Text>{item.name}</Text>
              <Text note>{item.description} </Text>
            </Body>
          </ListItem>
        ))
      ) : (
        <View style={styles.center}>
          <Text style={{ alignSelf: "center" }}>
            No product match the selected criteria
          </Text>
        </View>
      )}
    </Content>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
export default SearchedProduct;
