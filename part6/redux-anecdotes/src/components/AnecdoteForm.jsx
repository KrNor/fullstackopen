import { createAnecdote } from "../reducers/anecdoteReducer";
import { useDispatch } from "react-redux";
import {
  handleCreationNotification,
  handleNotificationClear,
} from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.newanecdote.value;
    event.target.newanecdote.value = "";
    dispatch(createAnecdote(content));
    dispatch(handleCreationNotification(content));
    // console.log("before");
    setTimeout(function () {
      // console.log("after");
      dispatch(handleNotificationClear(""));
    }, 5000);
  };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="newanecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
