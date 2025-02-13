const BlogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
var ObjectId = require("mongoose").Types.ObjectId;

BlogRouter.get("/", async (request, response, next) => {
  const blog = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blog);
});

BlogRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });
  let ress = await blog.save();
  user.blogs.push(ress.id);
  await user.save();
  // console.log(user.notes);
  // console.log(ress);
  if (ress) {
    response.status(201).json(ress);
  } else {
    response.status(400).json();
  }
  // console.log(blog);
});

BlogRouter.delete("/:id", async (request, response, next) => {
  const user = request.user;

  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete) {
    return response
      .status(404)
      .json({ error: "Blog you wanted to delete was not fount" });
  }
  // console.log(blogToDelete);

  // console.log(user.id, "     ", blogToDelete.user.toString());
  if (user.id.toString() === blogToDelete.user.toString()) {
    const resultat = await Blog.findByIdAndDelete(blogToDelete.id);
    // console.log(resultat);
    if (resultat) {
      // console.log("the blog was deleted");
      return response.status(204).end();
    } else {
      console.log("the blog doesnt exist");
      return response
        .status(404)
        .json({ error: "Blog you wanted to delete was not fount" }); // should probably delete this one and it shouldn't get called ever, but ill keep it for now
    }
  }
  response
    .status(404)
    .json({ error: "Blog you wanted to delete was not fount" });
});

BlogRouter.put("/:id", async (request, response, next) => {
  if (ObjectId.isValid(request.params.id)) {
    const body = request.body;
    // console.log(request.params.id);
    const NewBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
      },
      {
        new: true,
      }
    );
    // console.log(NewBlog);
    if (NewBlog) {
      response.json(NewBlog);
    } else {
      response.status(400).end();
    }
  }
});

module.exports = BlogRouter;
