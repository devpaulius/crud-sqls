import { useEffect, useState } from 'react';
import API from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    middle_name: ''
  });

  useEffect(() => {
    API.get(`/users/${id}`).then(res => setForm(res.data));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    API.put(`/users/${id}`, form).then(() => navigate('/admin/users'));
  };

  return (
    <div>
      <h3>Edit User</h3>
      <form onSubmit={handleSubmit}>
        <input name="username" value={form.username || ''} onChange={handleChange} placeholder="Username" />
        <input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" />
        <input name="first_name" value={form.first_name || ''} onChange={handleChange} placeholder="First Name" />
        <input name="middle_name" value={form.middle_name || ''} onChange={handleChange} placeholder="Middle Name" />
        <input name="last_name" value={form.last_name || ''} onChange={handleChange} placeholder="Last Name" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}