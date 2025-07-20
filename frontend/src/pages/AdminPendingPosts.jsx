import { useEffect, useState } from 'react';
import API from '../api/api';

export default function AdminPendingPosts() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    API.get('/admin/posts/pending')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Error fetching pending posts:', err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const approve = (id) => {
    API.put(`/admin/posts/${id}/approve`)
      .then(fetchPosts)
      .catch(err => console.error('Error approving post:', err));
  };

  const reject = (id) => {
    API.delete(`/admin/posts/${id}/reject`)
      .then(fetchPosts)
      .catch(err => console.error('Error rejecting post:', err));
  };

  return (
    <div>
      <h3>Pending Posts</h3>
      {posts.length === 0 ? (
        <p>No pending posts found.</p>
      ) : (
        posts.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', margin: 10, padding: 10, borderRadius: 4 }}>
            <h4>{p.title}</h4>
            <p><strong>Author:</strong> {p.createdBy}</p>
            <p>{p.content}</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => approve(p.id)}>Approve</button>
              <button onClick={() => reject(p.id)} style={{ backgroundColor: 'red' }}>Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}