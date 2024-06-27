const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/authMiddleware");

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { postId: postId } });
  res.send(comments);
});

//validateToken,
router.post("/", async (req, res) => {
  const commentBody = req.body;
  //const username = req.user.username; for web
  const { username } = req.body;
  commentBody.username = username;
  console.log(commentBody);
  await Comments.create(commentBody);
  res.json(commentBody);
});

router.delete("/:commentId", async (req, res) => {
  //const commentId = req.params.commentId; for web and validate token

  const commentId = req.params.commentId;
  console.log(commentId);
  Comments.destroy({
    where: {
      id: commentId,
    },
  });
  res.json("Comment Deleted!");
});

module.exports = router;
