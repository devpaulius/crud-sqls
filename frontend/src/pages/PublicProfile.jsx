import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';

export default function PublicProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/users/${id}`)
      .then(r => {
        const u = Array.isArray(r.data) ? r.data[0] : r.data;
        setData(u || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!data)    return <p>User not found</p>;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h2>@{data.username}</h2>
      <table>
        <tbody>
          <tr><td>ID:</td><td>{data.id}</td></tr>
          <tr><td>First name:</td><td>{data.first_name || '-'}</td></tr>
          <tr><td>Middle name:</td><td>{data.middle_name || '-'}</td></tr>
          <tr><td>Last name:</td><td>{data.last_name || '-'}</td></tr>
          <tr><td>Email:</td><td>{data.email}</td></tr>
        </tbody>
      </table>
    </div>
  );
}