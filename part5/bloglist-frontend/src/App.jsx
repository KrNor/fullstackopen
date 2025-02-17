import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import CreateBlog from "./components/CreateBlog";
import Togglable from "./components/Togglable";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  } else {
    return <div className="error">{message}</div>;
  }
  // return <div className="error">{message}</div>;
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [visible, setVisible] = useState(false);

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

  const handleError = (message) => {
    setErrorMessage(message);
    // console.log(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };
  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      const user = await loginService.login({ username, password });
      // console.log(user);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
      handleError("login succsessfull!");
    } catch (error) {
      handleError("bad login information, please try again");
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    handleError("logout succsessfull");
  };

  const afterAddBlog = () => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  };

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} />

        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username{" "}
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password{" "}
            <input
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
      <Notification message={errorMessage} />
      <h2>The list of blogs!</h2>

      <p>
        hello {user.name} welcome back!{" "}
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable
        buttonLabel="create new blog"
        setVisibility={setVisible}
        visibility={visible}
      >
        <CreateBlog
          errorFunc={handleError}
          setVisibility={setVisible}
          onBlogCreation={afterAddBlog}
        />
      </Togglable>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
