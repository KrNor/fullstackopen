const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { blogs, listWithOneBlog } = require("../misc/blogsForTesting");

describe("Author that has the most blogs, with count", () => {
  test("when 1 post exists", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    // console.log(result);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 1 });
  });
  test("when a list of blogs exists", () => {
    const result = listHelper.mostBlogs(blogs);
    // console.log(result);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });

  test("When the list of blogs is empty", () => {
    const result = listHelper.mostBlogs([]);
    assert.deepStrictEqual(result, {});
  });
});
