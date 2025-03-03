import { createAnecdote } from "./requests";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationDispatch } from "../NotificationContext";

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
    // ,
    // onError: () => {
    //   dispatch({
    //     type: "SHOW",
    //     content: `There was an error with the creation of the anecdote, make sure it is 5 or more letters!`,
    //   });
    // },
  });
  const onCreate = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate(
      {
        content,
        votes: 0,
      },
      {
        onError: () =>
          dispatch({
            type: "SHOW",
            content: `There was an error with the creation of the anecdote, make sure it is 5 or more letters!`,
          }),
      }
    );
    if (content.length > 4) {
      dispatch({
        type: "SHOW",
        content: `The anecdote "${content}" was created!`,
      });
    }
    setTimeout(function () {
      dispatch({
        type: "HIDE",
      });
    }, 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
