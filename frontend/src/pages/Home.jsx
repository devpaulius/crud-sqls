import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);

  const [categories, setCategories] = useState([]);

  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');
  const [from, setFrom]           = useState('');
  const [to, setTo]               = useState('');
  const [sort, setSort]           = useState('created_at');
  const [order, setOrder]         = useState('desc');
  const [limit]                   = useState(10);
  const [page, setPage]           = useState(1);

  const params = {
    search,
    category,
    from: from || undefined,
    to:   to   || undefined,
    sort,
    order,
    limit,
    offset: (page - 1) * limit
  };

  const fetchPosts = () =>
    API.get('/posts', { params }).then(r => {
      setPosts(r.data.rows);
      setTotal(r.data.total);
    });

  useEffect(() => { API.get('/categories').then(r => setCategories(r.data)); }, []);
  useEffect(() => { fetchPosts(); }, [search, category, from, to, sort, order, page]);

  const likePost   = id => API.post(`/posts/${id}/like`).then(fetchPosts);
  const deletePost = id => API.delete(`/posts/${id}`).then(fetchPosts);

  const pages = Math.ceil(total / limit);

  return (
    <div>
      <h2>Posts ({total})</h2>

      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', marginBottom: 20 }}>
        <input
          placeholder="Search title / content"
          value={search}
          onChange={e => { setPage(1); setSearch(e.target.value); }}
        />

        <select value={category} onChange={e => { setPage(1); setCategory(e.target.value); }}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>

        <input type="date" value={from} onChange={e => { setPage(1); setFrom(e.target.value); }} />
        <input type="date" value={to}   onChange={e => { setPage(1); setTo(e.target.value); }} />

        <select value={sort} onChange={e => { setPage(1); setSort(e.target.value); }}>
          <option value="created_at">Date</option>
          <option value="title">Title</option>
          <option value="likes">Likes</option>
        </select>

        <select value={order} onChange={e => { setPage(1); setOrder(e.target.value); }}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {user && <button onClick={() => navigate('/new-post')}>Create New Post</button>}

      {posts.map(p => (
        <div key={p.id} style={{ border: '1px solid #ddd', padding: 10, margin: 10 }}>
          <h3>{p.title}</h3>
          <p>{p.content}</p>
          <p>Category: {p.categoryName || 'None'}</p>
          <p>Likes: {p.likes}</p>
          {user && (
            <div>
              <button onClick={() => likePost(p.id)}>Like</button>
              {user.username === p.createdBy && (
                <>
                  <button onClick={() => navigate(`/edit-post/${p.id}`)}>Edit</button>
                  <button onClick={() => deletePost(p.id)}>Delete</button>
                </>
              )}
            </div>
          )}
        </div>
      ))}

      {pages > 1 && (
        <div style={{ marginTop: 20 }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span style={{ margin: '0 8px' }}>{page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}