import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { Container, Header, Icon, Item, Input, Text } from "native-base";
import { baseURL } from "../../assets/common/baseUrl";
import axios from "axios";

import ProductList from "./ProductList";
import SearchedProduct from "./SearchedProducts";
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";

const productsCategories = require("../../assets/data/categories.json");

var { height } = Dimensions.get("window");

const ProductContainer = (props) => {
  const [products, setProducts] = useState([]);
  const [productFiltered, setProductFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);
  const [loading,setLoading]=useState(true)

  useFocusEffect((useCallback(
    () => {
      setFocus(false);

      setActive(-1);
  
      //Products
      axios.get(`${baseURL}products`).then((res) => {
        setProducts(res.data);
        setProductFiltered(res.data);
        setProductsCtg(res.data);
        setInitialState(res.data);
        setLoading(false)
      });
  
      //Categories
      axios
        .get(`${baseURL}categories`)
        .then((res) => {
          setCategories(res.data);
        })
        .catch((error) => {
          console.log("categories api call error", error);
        });
  
      return () => {
        setProducts([]);
        setProductFiltered([]);
        setProductsCtg([]);
        setFocus();
        setCategories([]);
        setActive();
        setInitialState();
      };
    },
    [],
  )))
    
  

  searchProduct = (text) => {
    setProductFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };
  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  //Categories
  const changeCtg = (ctg) => {
    ctg === "all"
      ? [setProductsCtg(initialState), setActive(true)]
      : [
          setProductsCtg(
            products.filter((i) => i.category._id === ctg),
            setActive(true)
          ),
        ];
  };

  return (
    <>
    {loading==false?(
        <Container>
        <Header searchBar rounded style={{ backgroundColor: "gainsboro" }}>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              onFocus={openList}
              onChangeText={(text) => searchProduct(text)}
            />
            {focus == true ? <Icon onPress={onBlur} name="ios-close" /> : null}
          </Item>
        </Header>
        {focus == true ? (
          <SearchedProduct
            navigation={props.navigation}
            productsFiltered={productFiltered}
          />
        ) : (
          <ScrollView>
            <View>
              <View>
                <Banner />
              </View>
              <View>
                <CategoryFilter
                  categories={categories}
                  categoryFilter={changeCtg}
                  productsCtg={productsCtg}
                  active={active}
                  setActive={setActive}
                />
              </View>
              {productsCtg.length > 0 ? (
                <View style={style.listContainer}>
                  {/* <FlatList
                numColumns={2}
                data={products}
                renderItem={({ item }) => (
                  <ProductList key={item.id} item={item} />
                )}
                keyExtractor={(item) => item.name}
              /> */}
                  {productsCtg.map((item) => {
                    return (
                      <ProductList
                        navigation={props.navigation}
                        key={item._id}
                        item={item}
                      />
                    );
                  })}
                </View>
              ) : (
                <View style={(style.center, { height: height / 2 })}>
                  <Text>NO products found</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </Container>
    ):(
      <Container style={style.center,{backgroundColor:"#f2f2f2"}}>
        <ActivityIndicator size="large" color="#a0e1eb" />
      </Container>
    )}
    
    </>
    
  );
};
const style = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  listContainer: {
    height: height + 1000,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductContainer;
