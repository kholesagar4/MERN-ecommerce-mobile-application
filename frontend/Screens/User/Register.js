import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { baseURL } from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyleComponents/EasyButton";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = () => {
    if (email === "" || name === "" || phone === "" || password === "") {
      setError("Please Fill in the form correctly");
    }
    let user = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      isAdmin: false,
    };

    axios
      .post(`${baseURL}users/register`, user)
      .then((res) => {
        if (res.status == 200) {
          setTimeout(() => {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Registration Succeeded",
              text2: "Please login into your account",
            });
            props.navigation.navigate("Login");
          }, 500);
        }
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={"Register"}>
        <Input
          placeholder={"Email"}
          name={"email"}
          id={"email"}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          value={email}
        />
        <Input
          placeholder={"Name"}
          name={"name"}
          id={"name"}
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <Input
          placeholder={"Phone"}
          name={"phone"}
          id={"phone"}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />

        <Input
          placeholder={"Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <View>{error ? <Error message={error} /> : null}</View>

        <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
          <EasyButton large primary onPress={() => register()}>
            <Text style={{ color: "#FFF", fontWeight: "bold" }}>Register</Text>
          </EasyButton>
        </View>
        <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
          <EasyButton
            large
            secondary
            onPress={() => props.navigation.navigate("Login")}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold" }}> Back to login</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});
export default Register;
