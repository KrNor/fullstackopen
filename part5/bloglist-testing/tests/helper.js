const loginHelper = async (page, username, password) => {
  await page.getByTestId("password").fill(username);
  await page.getByTestId("username").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlogHelper = async (page, title, author, url) => {
  await page.getByRole("button", { name: "create new blog" }).click();
  await page.getByTestId("title-blog").fill(title);
  await page.getByTestId("author-blog").fill(author);
  await page.getByTestId("url-blog").fill(url);
  await page.getByRole("button", { name: "create" }).click();
};

const toLikeABlog = async (page, blogElement) => {
  var blogToLikeElement = page
    .getByTestId("list-of-blog")
    .getByText("TITLE2")
    .locator("..");

  await blogToLikeElement.getByRole("button", { name: "show" }).click();

  var blogToLikeElement2 = page
    .getByTestId("list-of-blog")
    .getByText("TITLE2")
    .locator("..");

  await blogToLikeElement2.waitFor();

  blogToLikeElement2.getByTestId("button", { name: "like" }).click();
  await blogToLikeElement2.waitFor();
  await expect(
    await page.getByTestId("list-of-blog").locator(".likecount-blog")
  ).toHaveText("1");
};
module.exports = {
  loginHelper,
  createBlogHelper,
  toLikeABlog,
};
