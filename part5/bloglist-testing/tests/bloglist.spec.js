const {
  test,
  expect,
  beforeEach,
  describe,
  waitFor,
} = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        username: "asd",
        name: "Anna",
        password: "asd",
      },
    });
    await request.post("/api/users", {
      data: {
        username: "qwe",
        name: "Tom",
        password: "qwe",
      },
    });
    await page.goto("/");
  });

  describe("Login", () => {
    test("Login form is shown", async ({ page }) => {
      await expect(page.getByTestId("login-form")).toBeVisible();
      await expect(page.getByText("Log in to application")).toBeVisible();
      await expect(page.getByTestId("username")).toBeVisible();
      await expect(page.getByTestId("password")).toBeVisible();
      await expect(page.getByText("login")).toBeVisible();
    });

    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("password").fill("asd");
      await page.getByTestId("username").fill("asd");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("welcome back!")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("password").fill("bad");
      await page.getByTestId("username").fill("bad");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("welcome back!")).not.toBeVisible();
      await expect(
        page.getByText("bad login information, please try again")
      ).toBeVisible();
    });
    describe("When logged in", () => {
      beforeEach(async ({ page }) => {
        await page.getByTestId("password").fill("asd");
        await page.getByTestId("username").fill("asd");
        await page.getByRole("button", { name: "login" }).click();
        // await page.getByText(content).waitFor();
      });

      test("a new blog can be created", async ({ page }) => {
        await page.getByRole("button", { name: "create new blog" }).click();
        await page.getByTestId("title-blog").fill("The title of a new blog");
        await page.getByTestId("author-blog").fill("Name Surname");
        await page.getByTestId("url-blog").fill("www.a.w.e.b.si.te.asdd");
        await page.getByRole("button", { name: "create" }).click();
        await expect(
          page.getByTestId("list-of-blog").getByText("The title of a new blog")
        ).toBeVisible();
      });
      describe("When a user is logged in and a blog is already added", async () => {
        // because I made that a user can't like its own blogs I have to create the blog and then logout and login with another user
        // I made this harder for myself for no reason
        // edit1: I removed that limitation to make it more easy
        beforeEach(async ({ page }) => {
          await page.getByRole("button", { name: "create new blog" }).click();
          await page.getByTestId("title-blog").fill("The title of a new blog");
          await page.getByTestId("author-blog").fill("Name Surname");
          await page.getByTestId("url-blog").fill("www.a.w.e.b.si.te.asdd");
          await page.getByRole("button", { name: "create" }).click();
        });
        test("liking a blog", async ({ page }) => {
          const blogToLikeElement = page
            .getByTestId("list-of-blog")
            .getByText("The title of a new blog")
            .locator("..");

          await blogToLikeElement.getByRole("button", { name: "show" }).click();

          const clickedLike = await blogToLikeElement
            .getByRole("button", { name: "like" })
            .click();
          await expect(
            await blogToLikeElement.locator(".likecount-blog")
          ).toHaveText("1");
          expect(
            page.locator(".error").getByText("the blog was liked")
          ).toBeVisible();
        });
        test("deleting a blog", async ({ page }) => {
          // to auto accept the dialog messages
          page.on("dialog", async (dialog) => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
          });
          const blogToLikeElement = page
            .getByTestId("list-of-blog")
            .getByText("The title of a new blog")
            .locator("..");

          await blogToLikeElement.getByRole("button", { name: "show" }).click();

          await blogToLikeElement
            .getByRole("button", { name: "delete blog" })
            .click();
          await expect(
            page
              .locator(".error")
              .getByText("the blog was succsessfully deleted!")
          ).toBeVisible();
          await expect(
            blogToLikeElement.getByText("The title of a new blog")
          ).not.toBeVisible();
        });
        test("logging out, and logging in another user to see if delete button is there", async ({
          page,
        }) => {
          await page.getByRole("button", { name: "logout" }).click();

          await expect(page.getByText("login")).toBeVisible();
          await page.getByTestId("password").fill("qwe");
          await page.getByTestId("username").fill("qwe");
          await page.getByRole("button", { name: "login" }).click();
          await expect(page.getByText("hello Tom welcome back!")).toBeVisible();
          const blogElement = page
            .getByTestId("list-of-blog")
            .getByText("The title of a new blog")
            .locator("..");

          await blogElement.getByRole("button", { name: "show" }).click();
          const blogUpdatedElement = page
            .getByTestId("list-of-blog")
            .getByText("The title of a new blog")
            .locator("..");
          await expect(blogUpdatedElement).toBeVisible();
          await expect(
            blogUpdatedElement.getByRole("button", { name: "hide" })
          ).toBeVisible();
          await expect(
            blogUpdatedElement.getByRole("button", { name: "delete" })
          ).not.toBeVisible();
        });
      });
    });
  });
});
