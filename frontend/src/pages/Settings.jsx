import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    theme_preference: 'light',
    acknowledged: false,
    public_profile: true,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // load settings
  useEffect(() => {
    if (!user) return;
    async function load() {
      const res = await API.get(`/users/${user.id}/settings`);
      setSettings({
        theme_preference: res.data.theme_preference || 'light',
        acknowledged: !!res.data.acknowledged,
        public_profile: res.data.public_profile !== 0,
      });
      setLoading(false);
    }
    load();
  }, [user]);

  // apply theme instantly
  useEffect(() => {
    document.body.className = settings.theme_preference;
  }, [settings.theme_preference]);

  const handleChange = e => {
    const { name, type, checked, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = () => {
    API.put(`/users/${user.id}/settings`, settings)
      .then(() => setMessage('Settings updated'))
      .catch(() => setMessage('Failed to update'));
  };

  if (!user)   return <p>Please login</p>;
  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2>Settings</h2>

      <label>
        Theme:
        <select
          name="theme_preference"
          value={settings.theme_preference}
          onChange={handleChange}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <div>
        <label>
          <input
            type="checkbox"
            name="acknowledged"
            checked={settings.acknowledged}
            onChange={handleChange}
          /> Acknowledged Terms
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="public_profile"
            checked={settings.public_profile}
            onChange={handleChange}
          /> Public profile
        </label>
      </div>

      <button onClick={handleSave}>Save</button>
      {message && <p>{message}</p>}
    </div>
  );
}