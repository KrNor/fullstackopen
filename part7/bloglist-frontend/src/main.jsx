import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import NotificationReducer from "./reducers/notificationReducer";
import BlogReducer from "./reducers/blogReducer";
import UserReducer from "./reducers/userReducer";

const store = configureStore({
  reducer: {
    notification: NotificationReducer,
    blog: BlogReducer,
    user: UserReducer,
  },
});

// console.log(store.getState());

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
