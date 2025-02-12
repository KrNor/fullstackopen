const BlogRouter = require("express").Router();
const Blog = require("../models/blog");

BlogRouter.get("/", async (request, response, next) => {
  const blog = await Blog.find({});
  response.json(blog);
});

BlogRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });
  const ress = await blog.save();
  // console.log(ress);
  if (ress) {
    response.status(201).json(ress);
  } else {
    response.status(400).json();
  }
  // console.log(blog);
});

module.exports = BlogRouter;
