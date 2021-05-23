import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
//Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/auth.actions";
import EasyButton from "../../Shared/StyleComponents/EasyButton";

const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate("User Profile");
    }
    return () => {};
  }, [context.stateUser.isAuthenticated]);

  const handleSubmit = () => {
    const user = {
      email,
      password,
    };
    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {
      loginUser(user, context.dispatch);
    }
  };

  return (
    <FormContainer title={"Login"}>
      <Input
        placeholder={"Enter Email"}
        name={"email"}
        id={"email"}
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase().trim())}
      />
      <Input
        placeholder={"Enter Password"}
        name={"password"}
        id={"password"}
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <EasyButton large primary onPress={() => handleSubmit()}>
          <Text style={{ color: "#FFF", fontWeight: "bold" }}>Login</Text>
        </EasyButton>
      </View>
      <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
        <Text style={styles.middleText}>Don't have account yet?</Text>
        <EasyButton
          large
          secondary
          onPress={() => props.navigation.navigate("Register")}
        >
          <Text style={{ color: "#FFF", fontWeight: "bold" }}>Register</Text>
        </EasyButton>
      </View>
    </FormContainer>
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

export default Login;
