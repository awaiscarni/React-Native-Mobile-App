import React from "react";
import { View, Button, TextInput, StyleSheet, Text, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { authContext } from "../helpers/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const { authState, setAuthState } = React.useContext(authContext);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(4, "Username should be at least 4 characters")
      .max(16, "Username should not exceed 16 characters")
      .required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (data, { resetForm }) => {
    try {
      // Clear AsyncStorage
      //await AsyncStorage.clear();

      const response = await axios.post(
        //172.20.10.2
        "http://192.168.210.99:3000/auth/login",
        data,
        {
          timeout: 10000,
        }
      );

      if (response.data.error) {
        Alert.alert("Error", response.data.error);
        resetForm();
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        alert("Welcome " + response.data.username);
        navigation.navigate("Home");
      }
    } catch (err) {
      console.error("Error: ", err.message);
      Alert.alert("Error", "Failed to log in. Please try again later.");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Log In</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
            placeholder="Username"
          />
          {touched.username && errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
          <TextInput
            style={styles.input}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            placeholder="Password"
            secureTextEntry
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <Button onPress={handleSubmit} title="Log In" />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});

export default LoginScreen;
