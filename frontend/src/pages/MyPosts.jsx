import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    API.get('/posts').then(res => {
      const myPosts = res.data.filter(p => p.createdBy === user.username);
      setPosts(myPosts);
    });
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = (id) => {
    API.delete(`/posts/${id}`).then(fetchPosts);
  };

  return (
    <div>
      <h2>My Posts</h2>
      <Link to="/new-post">New Post</Link>
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ddd', padding: 10, margin: 10 }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <Link to={`/edit-post/${post.id}`}>Edit</Link>
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}