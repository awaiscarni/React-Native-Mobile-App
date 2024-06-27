import React from "react";
import { View, Button, TextInput, StyleSheet, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(4)
      .max(16)
      .required("Username should not be empty"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = (data, { resetForm }) => {
    axios
      .post("http://192.168.210.99:3000/auth/", data, { timeout: 10000 }) // replace with your local IP address
      .then((res) => {
        console.log("Registration successful");
        resetForm();
        navigation.navigate("Login");
      })
      .catch((err) => console.error(err));
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
          <Text style={styles.title}>Registration</Text>
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
          <Button onPress={handleSubmit} title="Sign Up" />
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

export default RegisterScreen;
