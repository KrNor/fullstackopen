import { Table } from "react-bootstrap";
import UserService from "../services/users";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Link } from "react-router-dom";

const Users = (props) => {
  const users = useSelector((state) => {
    return state.users;
  });
  if (_.isEmpty(users)) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <h1>Information about users</h1>
      <Table striped>
        <thead>
          <tr>
            <th scope="col">User name</th>
            <th scope="col">blog count</th>
          </tr>
        </thead>
        <tbody>
          {users.map((users) => (
            <tr key={users.id}>
              <td>
                <Link to={`/users/${users.id}`}>{users.name}</Link>
              </td>
              <td>{users.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
