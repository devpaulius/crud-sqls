import { useEffect, useState } from 'react';
import API from '../api/api';

export default function LikesAverage() {
  const [average, setAverage] = useState(null);

  useEffect(() => {
    API.get('/posts').then(res => {
      const likesArray = res.data.map(post => post.likes || 0);
      const total = likesArray.reduce((acc, val) => acc + val, 0);
      const avg = likesArray.length ? (total / likesArray.length).toFixed(2) : 0;
      setAverage(avg);
    });
  }, []);

  return (
    <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.3em' }}>
      Average likes: {average}
    </div>
  );
}