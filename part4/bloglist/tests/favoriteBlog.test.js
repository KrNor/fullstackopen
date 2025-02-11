const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { blogs, listWithOneBlog } = require("../misc/blogsForTesting");

describe("Post that has the max likes", () => {
  test("when 1 post exists", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    console.log(result);
    assert.deepStrictEqual(result.likes, 5);
  });
  test("when a list of blogs exists", () => {
    const result = listHelper.favoriteBlog(blogs);
    console.log(result);
    assert.deepStrictEqual(result.likes, 12);
  });
  test("Empty list of blogs", () => {
    const result = listHelper.favoriteBlog([]);
    console.log(result);
    assert.deepStrictEqual(result.likes, undefined);
  });
});
