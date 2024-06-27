import React from "react";
import {
  View,
  Button,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { authContext } from "../helpers/authContext";

const CreatePostScreen = ({ navigation }) => {
  const { authState, setAuthState } = React.useContext(authContext);

  const initialValues = {
    title: "",
    postText: "",
  };

  const onSubmit = (values, { resetForm }) => {
    const postData = {
      ...values,
      UserId: authState.id,
      username: authState.username,
    };

    axios
      .post("http://192.168.210.99:3000/posts/", postData)
      .then((res) => {
        console.log("Post created successfully:", res.data);
        resetForm();
        navigation.navigate("Home ");
        navigation.goBack();
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must enter a title"),
    postText: Yup.string().required("Post text is required"),
  });

  const handleLogout = async () => {
    // Set auth state to initial state
    setAuthState({ username: "", id: 0, status: false });
    // Navigate to Login screen
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Twitter</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout {authState.username}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title1}>Create Post</Text>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.d}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              onChangeText={handleChange("title")}
              onBlur={handleBlur("title")}
              value={values.title}
              style={styles.input}
            />
            {errors.title && <Text style={styles.error}>{errors.title}</Text>}

            <Text style={styles.label}>Post</Text>
            <TextInput
              onChangeText={handleChange("postText")}
              onBlur={handleBlur("postText")}
              value={values.postText}
              style={[styles.input, { height: 100 }]}
              multiline
            />
            {errors.postText && (
              <Text style={styles.error}>{errors.postText}</Text>
            )}

            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
    marginTop: 10,
  },
  appName: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#1DA1F2",
  },
  logoutButton: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "bold",
  },
  title1: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  d: {
    marginTop: 45,
  },
});

export default CreatePostScreen;
