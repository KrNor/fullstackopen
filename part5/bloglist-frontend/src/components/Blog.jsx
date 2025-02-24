import { useState } from "react";
import BlogService from "../services/blogs";

const DeleteButton = ({ blog, errorHandler, afterChangeBlog }) => {
  const handleBlogDeletion = async () => {
    if (
      window.confirm(
        `are you sure you want to delete the blog with id:"${blog.id}"`
      )
    ) {
      try {
        await BlogService.deleteBlog(blog.id);
        errorHandler("the blog was succsessfully deleted!");
        afterChangeBlog();
        // setVisibility(visibility);
      } catch (error) {
        errorHandler("there was a problem trying to delete the blog");
        // setVisibility(visibility);
      }
    }
  };
  return (
    <button
      onClick={() => {
        handleBlogDeletion();
      }}
    >
      delete post
    </button>
  );
};

const Blog = ({ blog, user, errorHandler, afterChangeBlog }) => {
  const [blogShown, setBlogShown] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  // const increaseLikeCount =
  const handleLikeClick = async () => {
    try {
      const updatedBlog = await BlogService.likePost(blog);
      // console.log(updatedBlog);
      setLikeCount(likeCount + 1); // this doesn't update the database with more likes, when it is pressed more than once, just a repeated request to original + 1, but I like it this way to be honest
      errorHandler("the post was liked");
    } catch (error) {
      errorHandler(
        "don't like your own posts (or something went wrong, if so try again later)"
      );
    }
  };
  // <span className=></span>
  if (!blogShown) {
    return (
      <div style={blogStyle} className="simple-blog">
        <span className="title-blog">{blog.title}</span>{" "}
        <span className="author-blog">{blog.author}</span>
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
    let deleteButtonStyle = {};
    // console.log(blog.user.username);
    // console.log(user.username);
    if (user && blog.user.username === user.username) {
      // added to check if user exists only for testing
      // comparing by unique username to check if the delete button needs to be shown
      deleteButtonStyle = { display: "" };
    } else {
      deleteButtonStyle = { display: "none" };
    }

    return (
      <div style={blogStyle} className="detailed-blog">
        <span className="title-blog">{blog.title}</span>{" "}
        <span className="author-blog">{blog.author}</span>{" "}
        <span className="url-blog">{blog.url}</span>{" "}
        <p>
          <span className="likecount-blog">{likeCount}</span>
          <button onClick={() => handleLikeClick()}>like</button>
        </p>
        <p>
          <span className="user-name-blog">{blog.user.name}</span>
        </p>
        <button
          onClick={() => {
            setBlogShown(false);
          }}
        >
          hide
        </button>
        <div style={deleteButtonStyle}>
          <DeleteButton
            blog={blog}
            errorHandler={errorHandler}
            afterChangeBlog={afterChangeBlog}
          />
        </div>
      </div>
    );
  }
};

export default Blog;
