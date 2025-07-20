import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer.jsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MyPosts from './pages/MyPosts';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import Stats from './pages/Stats';
import AdminPanel from './pages/AdminPanel';
import PublicProfile from './pages/PublicProfile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/user/:id" element={<PublicProfile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}