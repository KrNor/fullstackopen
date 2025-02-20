import { render } from "@testing-library/react"; // add screen if uncommented blogWhole and screen.debug
import Blog from "./Blog";
import { expect } from "vitest";

test("renders author and title, but not url or likecount", () => {
  const blog = {
    user: "67ada3b63b0950d2668499d3",
    likes: 3,
    url: "www.websito.cooooooooom",
    title: "The Title",
    author: "Lewis Carroll",
    id: "67ae09bab5b2723ef21dfc4d",
  };

  const { container } = render(<Blog blog={blog} />);

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
