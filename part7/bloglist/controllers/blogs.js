const BlogRouter = require("express").Router();
const Blog = require("../models/blog");
var ObjectId = require("mongoose").Types.ObjectId;
const middleware = require("../utils/middleware");

BlogRouter.get("/", async (request, response, next) => {
  const blog = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blog);
});

BlogRouter.get("/:id", async (request, response, next) => {
  if (ObjectId.isValid(request.params.id)) {
    const blog = await Blog.findById(request.params.id).populate("user", {
      id: 1,
      name: 1,
      username: 1,
    });
    if (blog) {
      return response.status(200).json(blog);
    } else {
      return response.status(404).json({ error: "blog was not found" });
    }
  }
  return response.status(404).json({ error: "invalid request" });
});

BlogRouter.post("/:id/comments", async (request, response, next) => {
  const body = request.body;
  if (ObjectId.isValid(request.params.id)) {
    const blog = await Blog.findById(request.params.id);
    // console.log(blog);
    if (blog) {
      blog.comments.push(body.comment);
      await blog.save();

      return response.status(200).json(blog.comments);
    } else {
      return response.status(404).json({ error: "blog was not found" });
    }
  }
});

BlogRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    const body = request.body;
    const user = request.user;

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
      comments: [],
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
  }
);

BlogRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
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
        return response.json(resultat).status(200);
      } else {
        // console.log("the blog doesnt exist");
        return response
          .status(404)
          .json({ error: "Blog you wanted to delete was not fount" }); // should probably delete this one and it shouldn't get called ever, but ill keep it for now
      }
    } else {
      response
        .status(404)
        .json({ error: "Blog you wanted to delete was not fount" });
    }
  }
);

BlogRouter.put(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    const user = request.user;
    if (ObjectId.isValid(request.params.id)) {
      //&& user.id !== request.body.user) {
      const body = request.body;
      // console.log(request.params.id);
      const NewBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        {
          title: body.title,
          author: body.author,
          url: body.url,
          likes: body.likes,
          comments: body.comments,
        },
        {
          new: true,
        }
      );
      // console.log(NewBlog);
      if (NewBlog) {
        response.status(200).json(NewBlog);
      } else {
        response.status(400).end();
      }
    } else {
      response.status(404).json({ error: "invalid request" });
    }
  }
);

module.exports = BlogRouter;
