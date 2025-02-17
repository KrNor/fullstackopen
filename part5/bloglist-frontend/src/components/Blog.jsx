import { useState, useEffect } from "react";

const Blog = ({ blog }) => {
  const [blogShown, setBlogShown] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
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
          {blog.likes}
          <button>like</button>
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
