const { test, expect, beforeEach, describe } = require("@playwright/test");

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
        await page.getByTestId("title-blog").fill("The title of a new post");
        await page.getByTestId("author-blog").fill("Name Surname");
        await page.getByTestId("url-blog").fill("www.a.w.e.b.si.te.asdd");
        await page.getByRole("button", { name: "create" }).click();
        await expect(page.getByText("The title of a new post")).toBeVisible();
        await expect(
          page.getByTestId("list-of-blog").getByText("The title of a new post")
        ).toBeVisible();
      });
    });
  });
});
