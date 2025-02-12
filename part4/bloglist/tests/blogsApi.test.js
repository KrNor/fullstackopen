const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { listWithOneBlog, listOfBlogs } = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = listOfBlogs.map((blog) => new Blog(blog));
  //   console.log(blogObjects.length);
  const blogPromiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(blogPromiseArray);
  //   console.log("data is prepped");
});

describe("Blog api tests", async () => {
  test("test1", assert.deepStrictEqual(1, 1));

  test("blogs are returned as json, and returned blog count", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    // console.log(response.body.length);
    assert.deepStrictEqual(response.body.length, listOfBlogs.length);
  });
  test("the object identifier is id  and not _id", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // console.log(response.body[0].id, listOfBlogs[0]._id);
    // console.log(response.body[0]._id, listOfBlogs[0]._id);

    assert(mongoose.isValidObjectId(response.body[0].id));
  });
});

after(async () => {
  await mongoose.connection.close();
});
