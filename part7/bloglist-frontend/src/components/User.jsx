import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import _ from "lodash";

const User = ({ userProfile }) => {
  const id = useParams().id;
  const users = useSelector((state) => {
    return state.users;
  });
  // console.log(users);
  if (_.isEmpty(users)) {
    return <div>Loading users...</div>;
  }
  const profileToShow = users.find((user) => id === user.id);

  // console.log(profileToShow);
  return (
    <div>
      <div>Blogs submitted by: {profileToShow.name}!</div>
      <ul>
        {profileToShow.blogs.map((blog) => {
          return <li key={blog.id}>{blog.title}</li>;
        })}
      </ul>
    </div>
  );
};

export default User;
