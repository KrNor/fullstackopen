const BlogRouter = require("express").Router();
const Blog = require("../models/blog");

BlogRouter.get("/", async (request, response) => {
  const blog = await Blog.find({});
  response.json(blog);
});

BlogRouter.post("/", async (request, response) => {
  // const body = request.body;

  // const note = new Note({
  //   content: body.content,
  //   important: body.important || false,
  // });
  // const savedNote = await note.save();
  // response.status(201).json(savedNote);

  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });
  // console.log(blog);
  const ress = await blog.save();
  response.status(201).json(ress);
});

module.exports = BlogRouter;
