import { useState, useEffect } from "react";
import BlogService from "../services/blogs";

const Blog = ({ blog, errorHandler }) => {
  const [blogShown, setBlogShown] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const handleLikeClick = async () => {
    try {
      const updatedBlog = await BlogService.likePost(blog);
      console.log(updatedBlog);
      setLikeCount(likeCount + 1); // this doesn't update the database with more likes, when it is pressed more than once, just a repeated request to original + 1, but I like it this way to be honest
    } catch (error) {
      errorHandler(
        "don't like your own posts (or something went wrong, if so try again later)"
      );
    }
  };

  if (!blogShown) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}{" "}
        <button
          onClick={() => {
            setBlogShown(true);
          }}
        >
          show
        </button>
      </div>
    );
  } else {
    return (
      <div style={blogStyle}>
        <p>{blog.title}</p> <p>{blog.author}</p>
        <p>{blog.url}</p>
        <p>
          {likeCount}
          <button onClick={() => handleLikeClick()}>like</button>
        </p>
        <p>{blog.user.name}</p>
        <button
          onClick={() => {
            setBlogShown(false);
          }}
        >
          hide
        </button>
      </div>
    );
  }
};

export default Blog;
