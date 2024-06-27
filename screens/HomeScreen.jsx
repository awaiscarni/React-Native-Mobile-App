// HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { authContext } from "../helpers/authContext";

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const { authState, setAuthState } = React.useContext(authContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://192.168.210.99:3000/posts/")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const likePost = (postId) => {
    axios
      .post("http://192.168.210.99:3000/likes/", {
        PostId: postId,
        UserId: authState.id,
      })
      .then((res) => {
        setPosts(
          posts.map((postItem) => {
            if (postItem.id === postId) {
              if (res.data.liked) {
                return {
                  ...postItem,
                  Likes: [...postItem.Likes, { UserId: authState.id }],
                };
              } else {
                return {
                  ...postItem,
                  Likes: postItem.Likes.filter(
                    (like) => like.UserId !== authState.id
                  ),
                };
              }
            } else {
              return postItem;
            }
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const heartColor = (post) => {
    if (!post.Likes) {
      return "white";
    }
    const alreadyLiked = post.Likes.some(
      (like) => like.UserId === authState.id
    );
    return alreadyLiked ? "red" : "white";
  };

  const handleLogout = async () => {
    setAuthState({ username: "", id: 0, status: false });
    navigation.navigate("Login");
  };

  // HomeScreen.js
  // Inside handlePostPress and deletePost functions

  const handlePostPress = (postId) => {
    navigation.navigate("Post", { postId });
  };

  // const deletePost = (id) => {
  //   axios.delete(`http://192.168.1.104:3000/posts/${id}`).then((res) => {
  //     if (res.data.error) {
  //       console.log(res.data.error);
  //     } else {
  //       setPosts(
  //         posts.filter((val) => {
  //           return val.id != id;
  //         })
  //       );
  //     }
  //   });
  // };

  const deletePost = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            axios
              .delete(`http://192.168.210.99:3000/posts/${id}`)
              .then((res) => {
                if (res.data.error) {
                  console.log(res.data.error);
                } else {
                  setPosts(
                    posts.filter((val) => {
                      return val.id != id;
                    })
                  );
                }
              });
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Twitter</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout {authState.username}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Posts</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {filteredPosts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.card}
            onPress={() => handlePostPress(post.id)}
          >
            <Text style={styles.cardTitle}>{post.title}</Text>
            <Text>{post.postText}</Text>
            <Text>~{post.username}</Text>
            <View style={styles.likeContainer}>
              <TouchableOpacity onPress={() => likePost(post.id)}>
                <Ionicons name="heart" size={24} color={heartColor(post)} />
              </TouchableOpacity>
              <Text style={styles.likeCount}>
                {post.Likes ? post.Likes.length : 0}
              </Text>
            </View>
            {authState.username === post.username && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditPost", {
                      postId: post.id,
                      updatePost,
                    })
                  }
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deletePost(post.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  scrollViewContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  likeCount: {
    marginLeft: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    marginRight: 10,
    backgroundColor: "#1DA1F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;
