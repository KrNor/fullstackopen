import { useState, useEffect } from "react";
import Blog from "../services/blogs";

const CreateBlog = ({ title, author, url }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");

  const handleCreate = (event) => {
    event.preventDefault();
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    };
    Blog.create(newBlog);
    setBlogTitle("");
    setBlogAuthor("");
    setBlogUrl("");
    console.log("a blog was created");
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
