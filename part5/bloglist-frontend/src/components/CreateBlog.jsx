import { useState, useEffect } from "react";
import Blog from "../services/blogs";

const CreateBlog = ({ errorFunc, setVisibility }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
      };
      await Blog.create(newBlog);
      setBlogTitle("");
      setBlogAuthor("");
      setBlogUrl("");
      errorFunc(
        `a new blog called: "${newBlog.title}" was added!, it was written by:${newBlog.author}`
      );
      setVisibility(false); // hides after submission
    } catch (error) {
      errorFunc("there was a problem with creating the blog, try again");
    }
  };
  return (
    <div>
      <form>
        <div>
          <p>
            title:{" "}
            <input
              type="text"
              value={blogTitle}
              name="title"
              onChange={({ target }) => setBlogTitle(target.value)}
            ></input>
          </p>
          <p>
            author:{" "}
            <input
              type="text"
              value={blogAuthor}
              name="author"
              onChange={({ target }) => setBlogAuthor(target.value)}
            ></input>
          </p>
          <p>
            url:{" "}
            <input
              type="text"
              value={blogUrl}
              name="url"
              onChange={({ target }) => setBlogUrl(target.value)}
            ></input>
          </p>
          <button onClick={handleCreate}>create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
