const BlogRouter = require("express").Router();
const Blog = require("../models/blog");
var ObjectId = require("mongoose").Types.ObjectId;

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

BlogRouter.delete("/:id", async (request, response, next) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
  if (deletedBlog) {
    response.status(204).end();
  } else {
    response.status(404).end();
  }
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
      response.status(400).json({});
    }
  }
});

module.exports = BlogRouter;
