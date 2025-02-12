const Blog = require("../models/blog");

const { blogs, listWithOneBlog } = require("../misc/blogsForTesting");

module.exports = {
  listWithOneBlog,
  listOfBlogs: blogs,
};
