import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get(`/posts/${id}`).then(res => {
      setForm({
        title: res.data.title || '',
        content: res.data.content || '',
        categoryId: res.data.category_id || ''
      });
    });
    API.get('/categories').then(res => setCategories(res.data));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    API.put(`/posts/${id}`, {
      title: form.title.trim(),
      content: form.content.trim(),
      categoryId: form.categoryId || null
    }).then(() => navigate('/my-posts'));
  };

  return (
    <div>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
        />
        <select
          value={form.categoryId}
          onChange={e => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}