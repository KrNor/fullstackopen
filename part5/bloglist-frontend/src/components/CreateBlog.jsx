import { useState } from "react";
import Blog from "../services/blogs";

const CreateBlog = ({ setVisibility, handleCreateBlog }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");

  const handleCreateInForm = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
      };
      await handleCreateBlog(newBlog);
      // await Blog.create(newBlog);
      setBlogTitle("");
      setBlogAuthor("");
      setBlogUrl("");
      setVisibility(false); // hides after submission
      // console.log("GOOD creation was succsessfull");
    } catch (error) {
      // console.log("BAD creation was not succsessfull");
    }
  };
  return (
    <div>
      <form onSubmit={handleCreateInForm} className="form-createblog">
        <div>
          <p>
            title:{" "}
            <input
              data-testid="title-blog"
              id="title-input"
              type="text"
              value={blogTitle}
              name="title"
              onChange={({ target }) => setBlogTitle(target.value)}
            ></input>
          </p>
          <p>
            author:{" "}
            <input
              data-testid="author-blog"
              id="author-input"
              type="text"
              value={blogAuthor}
              name="author"
              onChange={({ target }) => setBlogAuthor(target.value)}
            ></input>
          </p>
          <p>
            url:{" "}
            <input
              data-testid="url-blog"
              id="url-input"
              type="text"
              value={blogUrl}
              name="url"
              onChange={({ target }) => setBlogUrl(target.value)}
            ></input>
          </p>
          <button
            type="submit"
            id="create-button-input"
            data-testid="submit-button-blog"
          >
            create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
