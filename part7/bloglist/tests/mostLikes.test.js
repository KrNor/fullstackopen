const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { blogs, listWithOneBlog } = require("../misc/blogsForTesting");

describe("Author with most Likes", () => {
  test("when 1 post exists", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    // console.log(result);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });
  test(
    "when a list of blogs exists",
    () => {
      const result = listHelper.mostLikes(blogs);
      // console.log(result);
      assert.deepStrictEqual(result, {
        author: "Edsger W. Dijkstra",
        likes: 17,
      });
    },

    test("empty list", () => {
      const result = listHelper.mostLikes([]);
      assert.deepStrictEqual(result, {});
    })
  );
});
