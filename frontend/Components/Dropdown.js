import React from "react";
import { StyleSheet, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

const Dropdown = (props) => {
    return(
      
         <View style={styles.dropdownContainer}>
              <RNPickerSelect
                placeholder={props.placeholder}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                    top: 20,
                    right: 10,
                  },
                  placeholder: {
                    color: "black",
                    fontSize: 12,
                    fontWeight: "bold",
                  },
                }}
                onValueChange={props.onValueChange}
                items={props.items}
                value={props.value}
              />
        
            </View>
      
       

    )
};
const styles = StyleSheet.create({
  dropdownContainer: {
    width: "80%",
    height: 60,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "gray",
    margin: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingLeft: 10,
    color: "black", // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: "100%",
    height: 60,
    paddingLeft: 10,
    color: "black", // to ensure the text is never behind the icon
  },
});
export default Dropdown;