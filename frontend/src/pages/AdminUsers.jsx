import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    API.get('/admin/users').then(res => setUsers(res.data));
  };

  useEffect(() => { fetchUsers(); }, []);

  const block = (id) => API.put(`/admin/users/${id}/block`).then(fetchUsers);
  const unblock = (id) => API.put(`/admin/users/${id}/unblock`).then(fetchUsers);
  const remove = (id) => API.delete(`/admin/users/${id}`).then(fetchUsers);

  return (
    <div>
      <h3>Users</h3>
      <table border="1">
        <thead>
          <tr><th>ID</th><th>Username</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                {u.blocked ? <button onClick={() => unblock(u.id)}>Unblock</button> : <button onClick={() => block(u.id)}>Block</button>}
                <button onClick={() => remove(u.id)}>Delete</button>
                <Link to={`/admin/users/${u.id}/edit`}><button>Edit</button></Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}