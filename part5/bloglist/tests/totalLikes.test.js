const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { blogs, listWithOneBlog } = require("../misc/blogsForTesting");

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when multiple blogs are entered", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });

  test("when empty list is entered", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when likes are a negative value", () => {
    const result = listHelper.totalLikes([{ likes: -5 }]);
    assert.strictEqual(result, -5);
  });
});
