import { render, screen } from "@testing-library/react";
import CreateBlog from "./CreateBlog";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";

describe("createBlog Tests", () => {
  test("the form calls the event handler it recieved as props with the right details when new blog is created", async () => {
    const newBlog = {
      title: "The Title",
      author: "Lewis Test",
      url: "www.websito.cooooooooom",
    };
    const mockHandleCreateBlog = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <CreateBlog handleCreateBlog={mockHandleCreateBlog} />
    );

    const titleInput = container.querySelector("#title-input");
    const authorInput = container.querySelector("#author-input");
    const urlInput = container.querySelector("#url-input");
    // screen.debug();
    const createButtonInput = container.querySelector("#create-button-input");
    // const createButtonInput = screen.getByText("create");

    await user.type(titleInput, newBlog.title);
    await user.type(authorInput, newBlog.author);
    await user.type(urlInput, newBlog.url);

    expect(titleInput).toHaveValue(newBlog.title);
    expect(authorInput).toHaveValue(newBlog.author);
    expect(urlInput).toHaveValue(newBlog.url);

    await user.click(createButtonInput);

    // console.log(mockHandleCreateBlog.mock.lastCall);

    expect(mockHandleCreateBlog).toHaveBeenCalledWith(newBlog);
  });
});
