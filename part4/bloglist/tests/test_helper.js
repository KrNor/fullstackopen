const Blog = require("../models/blog");

const { blogs, listWithOneBlog } = require("../misc/blogsForTesting");

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  listWithOneBlog,
  listOfBlogs: blogs,
  blogsInDb,
};
