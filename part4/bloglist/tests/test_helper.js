const Blog = require("../models/blog");
const User = require("../models/user");

const { blogs, listWithOneBlog } = require("../misc/blogsForTesting");
const { users } = require("../misc/usersForTesting");

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  listWithOneBlog,
  listOfBlogs: blogs,
  blogsInDb,
  listOfUsers: users,
  usersInDb,
};
