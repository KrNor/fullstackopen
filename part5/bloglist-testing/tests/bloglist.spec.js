const {
  test,
  expect,
  beforeEach,
  describe,
  waitFor,
} = require("@playwright/test");
import fs from "fs";
import helper from "./helper";

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
  test.slow();

  describe("Login", () => {
    test("Login form is shown", async ({ page }) => {
      await expect(page.getByTestId("login-form")).toBeVisible();
      await expect(page.getByText("Log in to application")).toBeVisible();
      await expect(page.getByTestId("username")).toBeVisible();
      await expect(page.getByTestId("password")).toBeVisible();
      await expect(page.getByText("login")).toBeVisible();
    });

    test("succeeds with correct credentials", async ({ page }) => {
      await helper.loginHelper(page, "asd", "asd");
      await expect(page.getByText("welcome back!")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await helper.loginHelper(page, "bad", "bad");
      await expect(page.getByText("welcome back!")).not.toBeVisible();
      await expect(
        page.getByText("bad login information, please try again")
      ).toBeVisible();
    });
    describe("When logged in", () => {
      beforeEach(async ({ page }) => {
        await helper.loginHelper(page, "asd", "asd");
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
          await helper.createBlogHelper(
            page,
            "The title of a new blog",
            "Name Surname",
            "www.a.w.e.b.si.te.asdd"
          );
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
        });
        test("deleting a blog", async ({ page }) => {
          // to auto accept the dialog messages
          page.on("dialog", async (dialog) => {
            // console.log(`Dialog message: ${dialog.message()}`);
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
          await helper.loginHelper(page, "qwe", "qwe");
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
      describe("when multiple blogs are added", async () => {
        test("multiple blogs are added, and liked randomly, then checked if the ammount of likes is correctly sorted", async ({
          page,
        }) => {
          // this works but bareley and takes long because of the delay between like calls, because otherwise they just don't work
          // there's probably too manny awaits also
          test.setTimeout(50000);
          const blogTestInfo = [
            ["Blog1", "Name Surn", "web.si.te"],
            ["Blog2", "Name Surn", "web.si.te"],
            ["Blog3", "Name Surn", "web.si.te"],
            ["TITLE1", "Name Surn", "web.si.te"],
            //["TITLE2", "Name Surn", "web.si.te"],
          ];
          let startingBlogsLikes = [];
          for (let i = 0; i < blogTestInfo.length; i++) {
            const element = blogTestInfo[i];
            await helper.createBlogHelper(
              page,
              blogTestInfo[i][0],
              blogTestInfo[i][1],
              blogTestInfo[i][2]
            );
            startingBlogsLikes.push([blogTestInfo[i][0], 0]);
          }
          await expect(
            await page
              .getByTestId("list-of-blog")
              .getByText(blogTestInfo[blogTestInfo.length - 1][0])
          ).toBeVisible();

          const buttons2 = await page
            .locator(".simple-blog")
            .filter("button", { hasText: "show" })
            .all();

          // console.log(buttons2.length);
          expect(buttons2.length).toBe(blogTestInfo.length);
          for (let i = 0; i < buttons2.length; i++) {
            const element = blogTestInfo[i];
            // console.log(element[0] + " " + element[1]);
            const tempval = await page
              .getByTestId("list-of-blog")
              .locator("div")
              .filter({ hasText: element[0] + " " + element[1] })
              .getByRole("button", { name: "show" });
            await tempval.first().click();
          }

          const tempi = await page
            .getByTestId("list-of-blog")
            .locator(".detailed-blog")
            .all();
          expect(tempi.length).toBe(blogTestInfo.length);

          for (let i = 0; i < tempi.length; i++) {
            const element = startingBlogsLikes[i];
            const timesToLike = Math.floor(Math.random() * 5);
            for (let y = 0; y < timesToLike; y++) {
              await page
                .locator(".detailed-blog")
                .getByText(element[0])
                .locator("..")
                .getByTestId("button")
                .click();
              await page.waitForTimeout(1000);
              startingBlogsLikes[i][1] += 1;

              expect(
                await page
                  .locator(".detailed-blog")
                  .getByText(element[0])
                  .locator("..")
                  .getByTestId("like-count")
                  .innerText()
              ).toBe(startingBlogsLikes[i][1].toString());
            }
          }
          // console.log(startingBlogsLikes);

          startingBlogsLikes.sort(function (a, b) {
            return b[1] - a[1];
          });
          // console.log(startingBlogsLikes);

          const tempi3 = await page
            .getByTestId("list-of-blog")
            .locator(".detailed-blog")
            .all();

          expect(tempi3.length).toEqual(startingBlogsLikes.length);

          for (let i = 0; i < tempi3.length; i++) {
            const element = startingBlogsLikes[i];
            tempi3[i].getByTestId("like-count").innerText();
            // console.log(await tempi3[i].getByTestId("like-count").innerText());
            // console.log(element[1]);
            expect(await tempi3[i].getByTestId("like-count").innerText()).toBe(
              element[1].toString()
            );
          }
          // await expect(tempi3.length).toEqual(startingBlogsLikes.length);
        });
      });
    });
  });
});
