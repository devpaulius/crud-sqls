import { useEffect, useState } from 'react';
import API from '../api/api';

export default function Stats() {
  const [stats, setStats] = useState({ postCount: 0, userCount: 0, likeCount: 0 });


  useEffect(() => {
    API.get('/stats').then(r => setStats(r.data));
  }, []);

  return (
    <div style={{ border: '1px solid #ddd', padding: 20, margin: 20 }}>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <tr><td>Total Posts:</td><td>{stats.postCount}</td></tr>
          <tr><td>Total Users:</td><td>{stats.userCount}</td></tr>
          <tr><td>Total Likes:</td><td>{stats.likeCount}</td></tr>
        </tbody>
      </table>
    </div>
  );
}