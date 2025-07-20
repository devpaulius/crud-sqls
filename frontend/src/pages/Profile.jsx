import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    middle_name: ''
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      API.get(`/users/${user.id}`).then(res => {
        const profileData = Array.isArray(res.data) ? res.data[0] : res.data;
        setProfile(profileData);
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    API.put(`/users/${user.id}`, profile).then(() => {
      setEditing(false);
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      API.delete(`/users/${user.id}`).then(() => {
        logout();
        navigate('/');
      });
    }
  };

  if (!user) return <p>Please login</p>;

  return (
    <div>
      <h2>Profile</h2>
      {editing ? (
        <>
          <input name="first_name" placeholder="First Name" value={profile.first_name || ''} onChange={handleChange} />
          <input name="middle_name" placeholder="Middle Name" value={profile.middle_name || ''} onChange={handleChange} />
          <input name="last_name" placeholder="Last Name" value={profile.last_name || ''} onChange={handleChange} />
          <input name="email" placeholder="Email" value={profile.email || ''} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>First Name:</strong> {profile.first_name}</p>
          <p><strong>Middle Name:</strong> {profile.middle_name}</p>
          <p><strong>Last Name:</strong> {profile.last_name}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
          <button onClick={handleDelete} style={{ backgroundColor: 'red' }}>Delete Account</button>
        </>
      )}
    </div>
  );
}