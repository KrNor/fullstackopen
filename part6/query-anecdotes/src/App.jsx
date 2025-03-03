import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, upvoteAnecdote } from "./components/requests";
import { useReducer } from "react";
import { useNotificationDispatch } from "./NotificationContext";

const App = () => {
  const dispatch = useNotificationDispatch();
  // const [notification, notificationDispatch] = useReducer(
  //   notificationReducer,
  //   ""
  // );
  const queryClient = useQueryClient();
  const upvoteAnecdoteMutation = useMutation({
    mutationFn: upvoteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
  });
  const handleVote = (anecdote) => {
    upvoteAnecdoteMutation.mutate(anecdote);
    console.log(anecdote.content);
    dispatch({
      type: "SHOW",
      content: `The anecdote "${anecdote.content}" was upvoted!`,
    });
    setTimeout(function () {
      dispatch({
        type: "HIDE",
      });
    }, 5000);
  };

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 3,
  });
  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading || (!result.isLoading && result.isError)) {
    return (
      <div>anecdote service is unavaliable due to problems in the sever</div>
    );
  }
  const anecdotes = result.data;
  // <button onClick={() => dispatch("SHOW")}>push fr notif</button>;
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
