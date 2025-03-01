import { createAnecdote } from "../reducers/anecdoteReducer";
import { useDispatch } from "react-redux";
import {
  handleCreationNotification,
  handleNotificationClear,
} from "../reducers/notificationReducer";
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.newanecdote.value;
    event.target.newanecdote.value = "";
    const anecdoteObject = await anecdoteService.createNew(content);
    console.log(anecdoteObject);
    dispatch(createAnecdote(anecdoteObject));
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
