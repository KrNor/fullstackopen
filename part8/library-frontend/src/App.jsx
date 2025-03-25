/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";
import { BOOK_ADDED } from "./queries";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useApolloClient, useSubscription } from "@apollo/client";

const UserLoginThing = ({ token, setToken }) => {
  const client = useApolloClient();
  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    navigate("/");
  };
  if (token === null) {
    return (
      <button>
        <Link to="/login">login</Link>
      </button>
    );
  }
  return (
    <>
      <button>
        <Link to="/add">add book</Link>
      </button>
      <button onClick={logout}>logout</button>
    </>
  );
};

const App = () => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("library-user-token"));
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data.data);
      window.alert(`A new book: "${data.data.bookAdded.title}" was added!`);
    },
  });

  return (
    <Router>
      <div>
        <button>
          <Link to="/authors">authors</Link>
        </button>
        <button>
          <Link to="/books">books</Link>
        </button>
        <button>
          <Link to="/recommendations">recommendations</Link>
        </button>
        <UserLoginThing token={token} setToken={setToken} />
      </div>

      <Routes>
        <Route path="/authors" element={<Authors token={token} />} />
        <Route path="/books" element={<Books />} />
        <Route
          path="/recommendations"
          element={
            token === null ? (
              <div>Log in to see recommendations</div>
            ) : (
              <Recommendations />
            )
          }
        />
        <Route path="/add" element={<NewBook />} />
        <Route
          path="/login"
          element={<LoginForm setToken={setToken} />}
        ></Route>
        <Route path="/" element={<Authors token={token} />} />
      </Routes>
    </Router>
  );
};

export default App;
