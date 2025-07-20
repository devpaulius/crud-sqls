import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer style={{
      backgroundColor: '#333',
      color: '#fff',
      textAlign: 'center',
      padding: '1em',
      marginTop: '2em'
    }}>
      <p>&copy; 2025 CRUD App. All rights reserved.</p>
      <div>
        <Link to="/" style={{ color: '#fff', margin: '0 0.5em' }}>Home</Link>
        {user && <Link to="/profile" style={{ color: '#fff', margin: '0 0.5em' }}>Profile</Link>}
        <Link to="/stats" style={{ color: '#fff', margin: '0 0.5em' }}>Stats</Link>
      </div>
    </footer>
  );
}