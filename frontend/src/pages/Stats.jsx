import { useEffect, useState } from 'react';
import API from '../api/api';

export default function Stats() {
  const [stats, setStats] = useState({ post_count: 0, user_count: 0 });

  useEffect(() => {
    API.get('/stats').then(res => setStats(res.data));
  }, []);

  return (
    <div style={{ border: '1px solid #ddd', padding: 20, margin: 20 }}>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <tr>
            <td>Total Posts:</td>
            <td>{stats.post_count}</td>
          </tr>
          <tr>
            <td>Total Users:</td>
            <td>{stats.user_count}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}