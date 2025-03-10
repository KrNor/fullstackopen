import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Blogs from "./components/Blogs";
import CreateBlog from "./components/CreateBlog";
import Togglable from "./components/Togglable";
import WelcomeBox from "./components/WelcomeBox";
import Users from "./components/Users";
import User from "./components/User";
import { setNotification } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUsers } from "./reducers/usersReducer";
import { initializeUser, loginUser, logoutUser } from "./reducers/userReducer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import _ from "lodash";
import { Table, Navbar, Container } from "react-bootstrap";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch(initializeUser());
  }, []);

  useEffect(() => {
    dispatch(initializeUsers());
  }, []);
  useEffect(() => {
    dispatch(initializeBlogs());
  }, [visible]);

  const blog = useSelector((state) => {
    return state.blog;
  });

  const user = useSelector((state) => {
    return state.user;
  });

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      await dispatch(loginUser({ username, password }));
      setUsername("");
      setPassword("");
    } catch (error) {
      dispatch(setNotification("bad login information, please try again"));
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await dispatch(logoutUser());
      dispatch(setNotification("logout succsessfull"));
    } catch (error) {
      dispatch(setNotification("something wrnt wrong with the logout"));
    }
  };

  if (_.isEmpty(user)) {
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
  } else if (blog === undefined) {
    return <div>Loading ...</div>;
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const navigationStyle = {
    backgroundColor: "grey",
  };

  return (
    <Router>
      <div className="container">
        <Navbar>
          <Container>
            <Link to="/">home </Link>
            <Link to="/">blogs </Link>
            <Link to="/users">users </Link>
            <Navbar.Brand href="/">refresh into home</Navbar.Brand>
            <WelcomeBox
              buttonLabel="WelcomeBox"
              user={user}
              handleLogout={handleLogout}
            />
          </Container>
        </Navbar>

        <Notification />
        <Routes>
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/blogs/" element={<Navigate replace to="/" />} />
          <Route path="/blogs/:id" element={<Blogs />} />
          <Route
            path="/"
            element={
              <div>
                <h2>The list of blogs!</h2>
                <Togglable
                  buttonLabel="create new blog"
                  setVisibility={setVisible}
                  visibility={visible}
                >
                  <CreateBlog setVisibility={setVisible} />
                </Togglable>
                <Table striped bordered hover>
                  <tbody>
                    {[...blog]
                      .sort((a, b) => b.likes - a.likes)
                      .map((blog) => (
                        <tr key={blog.id}>
                          <td style={blogStyle}>
                            <Link to={`/blogs/${blog.id}`}>
                              <div>
                                "{blog.title}" by {blog.author}
                              </div>
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <div data-testid="list-of-blog"></div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
