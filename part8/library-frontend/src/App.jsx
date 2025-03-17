// import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {
  // const [page, setPage] = useState("authors");

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
          <Link to="/add">add book</Link>
        </button>
      </div>

      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/" element={<Authors />} />
      </Routes>
    </Router>
  );
};

export default App;
