const BlogRouter = require("express").Router();
const Blog = require("../models/blog");

BlogRouter.get("/", async (request, response) => {
  const blog = await Blog.find({});
  response.json(blog);
});

BlogRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = BlogRouter;
