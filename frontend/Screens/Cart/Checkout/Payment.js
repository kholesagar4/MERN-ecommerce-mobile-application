import React, { useState } from "react";

import { View, Button } from "react-native";
import Dropdown from "../../../Components/Dropdown";
import {
  Container,
  Header,
  Content,
  ListItem,
  Text,
  Radio,
  Right,
  Left,
  Picker,
  Icon,
  Body,
  Title,
} from "native-base";
import RNPickerSelect from "react-native-picker-select";
const methods = [
  { name: "Cash on Delivery", value: 1 },
  { name: "Bank Transfer", value: 2 },
  { name: "Card Payment", value: 3 },
];

const paymentCards = [
  { label: "Wallet", value: "Wallet" },
  { label: "Visa", value: "Visa" },
  { label: "MasterCard", value: "MasterCard" },
  { label: "Other", value: "Other" },
];

const Payment = (props) => {
  const order = props.route.params;

  const [selected, setSelected] = useState();
  const [card, setCard] = useState();

  return (
    <Container>
      <Header style={{ backgroundColor: "#F8F8F8" }}>
        <Body style={{ alignItems: "center" }}>
          <Title style={{ color: "black" }}>Choose your payment method</Title>
        </Body>
      </Header>
      <Content>
        {methods.map((item, index) => {
          return (
            <ListItem onPress={() => setSelected(item.value)}>
              <Left>
                <Text>{item.name}</Text>
              </Left>
              <Right>
                <Radio selected={selected == item.value} />
              </Right>
            </ListItem>
          );
        })}
        {selected == 3 ? (
          <Dropdown
            placeholder={{
              label: "Select type",
              value: null,
              color: "red",
            }}
            onValueChange={(e) => setCard(e)}
            items={paymentCards}
            value={card}
          />
        ) : null}
        <View style={{ marginTop: 60, alignSelf: "center" }}>
          <Button
            title={"Confirm"}
            onPress={() => props.navigation.navigate("Confirm", { order })}
          />
        </View>
      </Content>
    </Container>
  );
};
export default Payment;
