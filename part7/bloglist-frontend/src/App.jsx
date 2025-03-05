import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import CreateBlog from "./components/CreateBlog";
import Togglable from "./components/Togglable";
import WelcomeBox from "./components/WelcomeBox";
import { setNotification } from "./reducers/notificationReducer";

const Notification = ({}) => {
  const notification = useSelector((state) => {
    return state.notification;
  });

  if (notification.length < 1) {
    return null;
  } else {
    return <div className="error">{notification}</div>;
  }
};

const App = () => {
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [visible, setVisible] = useState(false);

  const helloBoxRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, [visible]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  // const handleError = (message) => {
  //   setErrorMessage(message);
  //   // console.log(message);
  //   setTimeout(() => {
  //     setErrorMessage(null);
  //   }, 5000);
  // };
  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      const user = await loginService.login({ username, password });
      // console.log(user);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
      dispatch(setNotification("login succsessfull!"));
    } catch (error) {
      dispatch(setNotification("bad login information, please try again"));
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    dispatch(setNotification("logout succsessfull"));
  };
  const handleCreateBlog = async (newBlog) => {
    try {
      // console.log(newBlog);
      await blogService.create(newBlog);
      dispatch(
        setNotification(
          `a new blog called: "${newBlog.title}" was added!, it was written by:${newBlog.author}`
        )
      );
      afterChangeBlog();
    } catch (error) {
      dispatch(
        setNotification("there was a problem with creating the blog, try again")
      );
    }
  };
  const afterChangeBlog = () => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  };

  const makeLocalNicknameBetter = () => {
    helloBoxRef.current.setPersonalNickname();
  };

  if (user === null) {
    return (
      <div>
        <Notification />

        <h2>Log in to application</h2>
        <form onSubmit={handleLogin} data-testid="login-form">
          <div>
            username{" "}
            <input
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password{" "}
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <Notification />
      <h2>The list of blogs!</h2>

      <WelcomeBox
        buttonLabel="WelcomeBox"
        ref={helloBoxRef}
        user={user}
        handleLogout={handleLogout}
      />
      <button onClick={makeLocalNicknameBetter}>make my nickname better</button>
      <Togglable
        buttonLabel="create new blog"
        setVisibility={setVisible}
        visibility={visible}
      >
        <CreateBlog
          setVisibility={setVisible}
          handleCreateBlog={handleCreateBlog}
        />
      </Togglable>
      <div data-testid="list-of-blog">
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              afterChangeBlog={afterChangeBlog}
            />
          ))}
      </div>
    </div>
  );
};

export default App;
