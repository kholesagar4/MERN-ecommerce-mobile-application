import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";

import { Item, Picker } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyleComponents/EasyButton";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import Error from "../../Shared/Error";
import AsyncStorage from "@react-native-community/async-storage";
import { baseURL, hostIP } from "../../assets/common/baseUrl";
import axios from "axios";
import Dropdown from "../../Components/Dropdown";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
//import { Picker } from "@react-native-picker/picker";
var { height } = Dimensions.get("window");

const ProductForm = (props) => {
  const [pickerValue, setPickerValue] = useState("");
  const [brand, setBrand] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [category, setCategory] = useState();
  const [categoryItems, setCategoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState();
  const [err, setError] = useState();
  const [countInStock, setCountInStock] = useState();
  const [rating, setRating] = useState(0);
  const [isFeatured, setIsFeature] = useState(false);
  const [richDescription, setRichDescription] = useState();
  const [numReviews, setNumReviews] = useState(0);
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setBrand(props.route.params.item.brand);
      setName(props.route.params.item.name);
      setPrice(props.route.params.item.price.toString());
      setDescription(props.route.params.item.description);
      setMainImage(`${hostIP}${props.route.params.item.image}`);
      setImage(props.route.params.item.image);
      setPickerValue(props.route.params.item.category._id);
      setCountInStock(props.route.params.item.countInStock.toString());
    }

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    //Categories
    axios
      .get(`${baseURL}categories`)
      .then((res) => {
        setCategories(res.data);
        setCategoryItems(
          res.data.map((item) => {
            return { label: item.name, value: item._id };
          })
        );
      })
      .catch((error) => {
        alert("Error to load categories");
      });

    //Image Picker
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permission to make this work");
        }
      }
    })();
    return () => {
      setCategories([]);
    };
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });
    if (!result.cancelled) {
      setMainImage(result.uri);
      setImage(result.uri);
    }
  };

  const addProduct = () => {
    if (
      name == "" ||
      brand == "" ||
      description == "" ||
      categories == "" ||
      countInStock == ""
    ) {
      setError("Please fill in the form correctly");
    }

    let formData = new FormData();

    const newImageUri = "file:///" + image.split("file:/").join("");
    console.log(image.split("/").pop());
    console.log(mime.getType(image));

    formData.append("image", {
      uri: Platform.OS == "android" ? image : newImageUri,
      type: mime.getType(image),
      name: image.split("/").pop(),
    });

    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", pickerValue);
    formData.append("countInStock", countInStock);
    formData.append("richDescription", richDescription);
    formData.append("rating", rating);
    formData.append("numReviews", numReviews);
    formData.append("isFeatured", isFeatured);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    if (item != null) {
      axios
        .put(`${baseURL}products/${item.id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Product successfully updated",
              text2: "",
            });
            setTimeout(() => {
              props.navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error.stack);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    } else {
      axios
        .post(`${baseURL}products`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Product added",
              text2: "",
            });
            setTimeout(() => {
              props.navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error.stack);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    }
  };

  return (
    <FormContainer title="Add Product">
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: mainImage }} />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Icon style={{ color: "white" }} name="camera" />
        </TouchableOpacity>
      </View>

      <View style={styles.label}>
        <Text>Brand</Text>
      </View>
      <Input
        placeholder="Brand"
        name="brand"
        id="brand"
        value={brand}
        onChangeText={(text) => setBrand(text)}
      />

      <View style={styles.label}>
        <Text>Name</Text>
      </View>
      <Input
        placeholder="Name"
        name="name"
        id="name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <View style={styles.label}>
        <Text>Price</Text>
      </View>
      <Input
        placeholder="Price"
        name="price"
        id="price"
        keyboardType={"numeric"}
        value={price}
        onChangeText={(text) => setPrice(text)}
      />

      <View style={styles.label}>
        <Text>Count in stock</Text>
      </View>
      <Input
        placeholder="Stock"
        name="stock"
        id="stock"
        keyboardType={"numeric"}
        value={countInStock}
        onChangeText={(text) => setCountInStock(text)}
      />

      <View style={styles.label}>
        <Text>Description</Text>
      </View>
      <Input
        placeholder="Description"
        name="description"
        id="description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />

      <Dropdown
        placeholder={{
          label: "Select your Category",
          value: null,
          color: "red",
        }}
        onValueChange={(e) => [setPickerValue(e), setCategory(e)]}
        items={categoryItems}
        value={pickerValue}
      />
      {err ? <Error message={err} /> : null}
      <View style={styles.buttonContainer}>
        <EasyButton large primary onPress={() => addProduct()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "80%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
});

export default ProductForm;
