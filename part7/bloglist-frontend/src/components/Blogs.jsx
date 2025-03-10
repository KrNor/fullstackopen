import BlogService from "../services/blogs";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { useParams, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { setNotification } from "../reducers/notificationReducer";
import { initializeBlogs, likeBlog } from "../reducers/blogReducer";

export const DeleteButton = ({ blog }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleBlogDeletion = async () => {
    if (
      window.confirm(
        `are you sure you want to delete the blog with id:"${blog.id}"`
      )
    ) {
      try {
        await BlogService.deleteBlog(blog.id);
        dispatch(setNotification("the blog was succsessfully deleted!"));
        dispatch(initializeBlogs());
        navigate("/");
        // setVisibility(visibility);
      } catch (error) {
        dispatch(
          setNotification("there was a problem trying to delete the blog")
        );
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
      delete blog
    </button>
  );
};

const Blogs = () => {
  const dispatch = useDispatch();
  const [blogToShow, setBlogToShow] = useState({});
  // const [commentIds, setCommentIds] = useState(1);
  const id = useParams().id;

  const user = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    BlogService.getById(id)
      .then((blogg) => setBlogToShow(blogg))
      .catch((err) => {
        dispatch(
          setNotification("the blog you want to accsess is not avaliable")
        );
      });
  }, []);

  if (_.isEmpty(blogToShow)) {
    return <div>Loading blog...</div>;
  }

  // const handleCommentIds = async () => {
  //   console.log(commentIds);
  //   const tempid = commentIds;
  //   await setCommentIds(tempid + 1);
  //   return tempid + 1;
  // };

  const handleLikeClick = async () => {
    try {
      dispatch(likeBlog(blogToShow));
      setBlogToShow({ ...blogToShow, likes: blogToShow.likes + 1 });
      dispatch(initializeBlogs());
    } catch (error) {
      dispatch(
        setNotification(
          "don't like your own blogs (or something went wrong, if so try again later)"
        )
      );
    }
  };
  let deleteButtonStyle = {};
  // console.log(user.username);
  // console.log("up is user down is blogtoshow");
  // console.log(blogToShow.user.username);
  if (user && blogToShow.user.username === user.username) {
    deleteButtonStyle = { display: "" };
  } else {
    deleteButtonStyle = { display: "none" };
  }

  return (
    <div>
      <h2>Blogs</h2>
      <h1>{blogToShow.title}</h1>

      <div>
        link to blog: <a href={`${blogToShow.url}`}>{blogToShow.url}</a>
      </div>
      <div>
        likes: {blogToShow.likes}
        <button onClick={() => handleLikeClick()}>like</button>
      </div>
      <div>this blog was added by: {blogToShow.author}</div>
      <div style={deleteButtonStyle}>
        <DeleteButton blog={blogToShow} />
      </div>
      <div>
        <ul>
          comments:
          {blogToShow.comments.map((comment) => {
            return (
              <li key={Math.floor(Math.random() * 10000000) + 1}>{comment}</li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Blogs;
