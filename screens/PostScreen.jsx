import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { authContext } from "../helpers/authContext";

const PostScreen = ({ route, navigation }) => {
  const { authState, setAuthState } = React.useContext(authContext);
  const { postId } = route.params;
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    axios
      .get(`http://192.168.210.99:3000/posts/byId/${postId}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((e) => {
        console.log(e);
      });

    axios
      .get(`http://192.168.210.99:3000/comments/${postId}`)
      .then((res) => {
        setComments(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [postId]);

  const addComment = () => {
    axios
      .post("http://192.168.210.99:3000/comments", {
        commentBody: newComment,
        PostId: postId,
        username: authState.username,
      })
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error);
        } else {
          console.log("comment added!");
          let commentToAdd = {
            commentBody: newComment,
            username: res.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  // const deleteComment = (id) => {
  //   axios.delete(`http://192.168.1.104:3000/comments/${id}`).then((res) => {
  //     if (res.data.error) {
  //       console.log(res.data.error);
  //     } else {
  //       console.log("comment deleted!");
  //       setComments(
  //         comments.filter((val) => {
  //           return val.id != id;
  //         })
  //       );
  //     }
  //   });
  // };

  const deleteComment = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion canceled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            axios
              .delete(`http://192.168.210.99:3000/comments/${id}`)
              .then((res) => {
                if (res.data.error) {
                  console.log(res.data.error);
                } else {
                  console.log("Comment deleted!");
                  setComments(
                    comments.filter((val) => {
                      return val.id != id;
                    })
                  );
                }
              });
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    setAuthState({ username: "", id: 0, status: false });
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
      <View
        style={{
          width: "100%",
          backgroundColor: "#f0f0f0",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.postText}>{post.postText}</Text>
        <Text style={styles.username}>~{post.username}</Text>
      </View>
      <View style={{ width: "100%", marginTop: 20 }}>
        <Text style={styles.commentTitle}>Comments</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
          />
          <TouchableOpacity style={styles.addButton} onPress={addComment}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ width: "100%", marginTop: 20 }}>
        {comments.map((comment, i) => (
          <View key={i} style={styles.commentContainer}>
            <Text style={styles.comment}>{comment.commentBody}</Text>
            <Text style={styles.commentUsername}>~{comment.username}</Text>
            {authState.username === comment.username && (
              <TouchableOpacity
                onPress={() => {
                  deleteComment(comment.id);
                }}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  postText: {
    fontSize: 18,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 20,
  },
  commentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  comment: {
    fontSize: 16,
    marginBottom: 5,
  },
  commentUsername: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    width: 70,
    alignSelf: "flex-end",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  // addButton: {
  //   marginLeft: 10,
  //   backgroundColor: "#1DA1F2",
  //   paddingHorizontal: 12, // Reduced padding
  //   paddingVertical: 6, // Reduced padding
  //   borderRadius: 15, // Rounded corners
  //   width: 100,
  //   alignSelf: "flex-end",
  //   marginRight: 10,
  // },
  // addButtonText: {
  //   color: "#fff",
  //   fontWeight: "bold",
  //   fontSize: 14, // Smaller font size
  //   marginBottom: 10,
  //   alignSelf: "center",
  //   paddingTop: 4,
  // },
  addButton: {
    marginRight: 10,
    backgroundColor: "#1DA1F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    width: 55,
    alignSelf: "flex-end",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
});

export default PostScreen;
