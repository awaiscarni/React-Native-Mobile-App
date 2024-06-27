// EditPostScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { authContext } from "../helpers/authContext";

const EditPostScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const { authState, setAuthState } = React.useContext(authContext);
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");

  useEffect(() => {
    axios
      .get(`http://192.168.210.99:3000/posts/byId/${postId}`)
      .then((res) => {
        setTitle(res.data.title);
        setPostText(res.data.postText);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [postId]);

  const handleUpdatePost = () => {
    axios
      .put(`http://192.168.210.99:3000/posts/${postId}`, {
        title,
        postText,
      })
      .then((res) => {
        // Call the updatePost function from navigation options
        navigation.navigate("Home");
        navigation.goBack();
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("There was an error updating the post!", error);
      });
  };

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
      <Text style={styles.title1}>Edit Post</Text>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Post Text</Text>
      <TextInput
        style={styles.input}
        value={postText}
        onChangeText={setPostText}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdatePost}>
        <Text style={styles.buttonText}>Update Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1DA1F2",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 150,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
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
});

export default EditPostScreen;
