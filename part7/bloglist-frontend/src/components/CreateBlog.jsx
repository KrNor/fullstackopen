import { useState } from "react";
import Blog from "../services/blogs";
import { createNewBlog, initializeBlogs } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const CreateBlog = ({ setVisibility }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const dispatch = useDispatch();

  const handleCreateInForm = async (event) => {
    event.preventDefault();

    try {
      const newBlog = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
      };
      await dispatch(createNewBlog(newBlog));
      dispatch(
        setNotification(
          `a new blog called: "${newBlog.title}" was added!, it was written by:${newBlog.author}`
        )
      );
      dispatch(initializeBlogs());

      // await Blog.create(newBlog);
      setBlogTitle("");
      setBlogAuthor("");
      setBlogUrl("");
      setVisibility(false); // hides after submission
      // console.log("GOOD creation was succsessfull");
    } catch (error) {
      // console.log(error);
      dispatch(
        setNotification("there was a problem with creating the blog, try again")
      );
    }
  };
  return (
    <div>
      <Form onSubmit={handleCreateInForm}>
        <div>
          <Form.Group>
            <Form.Label>Title:</Form.Label>
            <Form.Control
              data-testid="title-blog"
              id="title-input"
              type="text"
              value={blogTitle}
              name="title"
              onChange={({ target }) => setBlogTitle(target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Author:</Form.Label>
            <Form.Control
              data-testid="author-blog"
              id="author-input"
              type="text"
              value={blogAuthor}
              name="author"
              onChange={({ target }) => setBlogAuthor(target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>URL:</Form.Label>
            <Form.Control
              data-testid="url-blog"
              id="url-input"
              type="text"
              value={blogUrl}
              name="url"
              onChange={({ target }) => setBlogUrl(target.value)}
            ></Form.Control>
          </Form.Group>
          <Button
            type="submit"
            id="create-button-input"
            data-testid="submit-button-blog"
          >
            create
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateBlog;
