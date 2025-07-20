import { Link, Routes, Route } from 'react-router-dom';
import AdminUsers from './AdminUsers';
import AdminEditUser from './AdminEditUser';
import AdminPosts from './AdminPosts';
import AdminPendingPosts from './AdminPendingPosts';
import AdminCategories from './AdminCategories';

export default function AdminPanel() {
  return (
    <div>
      <h2>Admin Panel</h2>
      <nav>
        <Link to="/admin/users">Users</Link> | 
        <Link to="/admin/posts">Posts</Link> | 
        <Link to="/admin/pending-posts">Pending Posts</Link> | 
        <Link to="/admin/categories">Categories</Link>
      </nav>
      <Routes>
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id/edit" element={<AdminEditUser />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="pending-posts" element={<AdminPendingPosts />} />
        <Route path="categories" element={<AdminCategories />} />
      </Routes>
    </div>
  );
}