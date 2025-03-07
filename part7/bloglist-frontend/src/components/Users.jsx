import { Table } from "react-bootstrap";
import UserService from "../services/users";
import { useDispatch, useSelector } from "react-redux";

const Users = (props) => {
  const users = useSelector((state) => {
    return state.users;
  });

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
                <div>{users.name}</div>
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
