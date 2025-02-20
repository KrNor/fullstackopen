import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";

describe("Blog component testing", () => {
  let container;
  let blog;
  beforeEach(() => {
    blog = {
      user: "67ada3b63b0950d2668499d3",
      likes: 3,
      url: "www.websito.cooooooooom",
      title: "The Title",
      author: "Lewis Carroll",
      id: "67ae09bab5b2723ef21dfc4d",
    };
    container = render(<Blog blog={blog} />).container;
  });

  test("renders author and title, but not url or likecount", () => {
    //   const blogWhole = container.querySelector(".simple-blog");

    const blogAuthor = container.querySelector(".author-blog");
    const blogTitle = container.querySelector(".title-blog");
    const blogUrl = container.querySelector(".url-blog");
    const blogLikecount = container.querySelector(".likecount-blog");
    //   screen.debug(blogWhole);

    expect(blogTitle).toHaveTextContent(blog.title);
    expect(blogAuthor).toHaveTextContent(blog.author);
    expect(blogUrl).toBeNull();
    expect(blogLikecount).toBeNull();
  });
  test("url and number of likes after show button is clicked", async () => {
    const user = userEvent.setup();

    const button = screen.getByText("show");
    await user.click(button);
    const blogUrl = container.querySelector(".url-blog");
    const blogLikecount = container.querySelector(".likecount-blog");

    // screen.debug(blogUrl);
    expect(blogUrl).toHaveTextContent(blog.url);
    expect(blogLikecount).toHaveTextContent(blog.likes);
  });
});
