const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/authMiddleware");

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  res.send(listOfPosts);
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.send(post);
});

// router.post("/", async (req, res) => {
//   const post = req.body;
//   //const UserId = req.user.id; for web and validatetoken
//   //const username = req.user.username;
//   const UserId = req.body;
//   const username = req.body;
//   post.UserId = UserId;
//   post.username = username;
//   await Posts.create(post);
//   res.json(post);
// });

router.post("/", async (req, res) => {
  try {
    const { title, postText, UserId, username } = req.body;
    const newPost = await Posts.create({ title, postText, UserId, username });
    res.json(newPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
});
router.delete("/:postId", async (req, res) => {
  //const commentId = req.params.commentId; for web and validate token
  const postId = req.params.postId;
  console.log(postId);
  Posts.destroy({
    where: {
      id: postId,
    },
  });
  res.json("Post Deleted!");
});

router.put("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const { title, postText } = req.body;

  try {
    const post = await Posts.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.title = title;
    post.postText = postText;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the post." });
  }
});

module.exports = router;
