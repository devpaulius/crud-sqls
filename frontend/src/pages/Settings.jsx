import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    theme_preference: 'light',
    acknowledged: false,
    public_profile: true
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) {
      API.get(`/users/${user.id}/settings`)
        .then(r => setSettings(r.data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    document.body.className = settings.theme_preference;
  }, [settings.theme_preference]);

  const handleChange = e => {
    const { name, type, checked, value } = e.target;
    setSettings(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const save = () =>
    API.put(`/users/${user.id}/settings`, settings)
      .then(() => setMsg('Saved'))
      .catch(() => setMsg('Error'));

  if (!user)   return <p>Please login</p>;
  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2>Settings</h2>

      <label>
        Theme:
        <select name="theme_preference" value={settings.theme_preference} onChange={handleChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label>
        <input
          type="checkbox"
          name="acknowledged"
          checked={settings.acknowledged}
          onChange={handleChange}
        /> I acknowledge terms
      </label>

      <label>
        <input
          type="checkbox"
          name="public_profile"
          checked={settings.public_profile}
          onChange={handleChange}
        /> Public profile
      </label>

      <button onClick={save}>Save</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
