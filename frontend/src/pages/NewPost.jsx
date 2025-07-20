import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function NewPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    categoryId: '',
    scheduled_at: ''
  });
  const [categories, setCategories] = useState([]);
  const [future, setFuture] = useState(false);

  useEffect(() => {
    API.get('/categories').then(res => setCategories(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let scheduledAt = null;
    if (future && form.scheduled_at) {
      scheduledAt = new Date(form.scheduled_at).toISOString().slice(0, 19).replace('T', ' ');
    } else {
      const now = new Date();
      scheduledAt = now.toISOString().slice(0, 19).replace('T', ' ');
    }

    API.post('/posts', {
      title: form.title.trim(),
      content: form.content.trim(),
      categoryId: form.categoryId || null,
      scheduled_at: scheduledAt
    }).then(() => navigate('/my-posts'));
  };

  return (
    <div>
      <h2>New Post</h2>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Title" 
          value={form.title || ''} 
          onChange={e => setForm({ ...form, title: e.target.value })} 
        />
        <textarea 
          placeholder="Content" 
          value={form.content || ''} 
          onChange={e => setForm({ ...form, content: e.target.value })} 
        />
        <select 
          value={form.categoryId || ''} 
          onChange={e => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>
          <input 
            type="checkbox" 
            checked={!!future} 
            onChange={e => setFuture(e.target.checked)} 
          /> Schedule for future
        </label>

        {future && (
          <input 
            type="datetime-local" 
            value={form.scheduled_at || ''} 
            onChange={e => setForm({ ...form, scheduled_at: e.target.value })} 
          />
        )}

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
