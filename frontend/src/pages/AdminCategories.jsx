import { useEffect, useState } from 'react';
import API from '../api/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');

  const fetchCats = () => API.get('/categories').then(res => setCategories(res.data));
  useEffect(() => { fetchCats(); }, []);

  const add = () => API.post('/categories', { name: newCat }).then(() => { setNewCat(''); fetchCats(); });
  const remove = (id) => API.delete(`/categories/${id}`).then(fetchCats);

  return (
    <div>
      <h3>Categories</h3>
      <input value={newCat} onChange={e => setNewCat(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>
        {categories.map(c => (
          <li key={c.id}>{c.name} <button onClick={() => remove(c.id)}>Delete</button></li>
        ))}
      </ul>
    </div>
  );
}