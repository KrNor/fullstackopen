import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
// import anecdoteService from "./services/anecdotes";
// import { setAnecdotes } from "./reducers/anecdoteReducer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
// anecdoteService.getAll().then((notes) => store.dispatch(setAnecdotes(notes)));
