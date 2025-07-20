import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // Fetch settings from API if logged in
      API.get(`/users/${parsedUser.id}/settings`)
        .then(res => {
          const userTheme = res.data.theme_preference || 'light';
          setTheme(userTheme);
          applyTheme(userTheme);
        })
        .catch(() => {
          // fallback
          setTheme(savedTheme || 'light');
          applyTheme(savedTheme || 'light');
        });
    } else {
      setTheme(savedTheme || 'light');
      applyTheme(savedTheme || 'light');
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    // Immediately fetch settings after login
    API.get(`/users/${user.id}/settings`).then(res => {
      const userTheme = res.data.theme_preference || 'light';
      setTheme(userTheme);
      applyTheme(userTheme);
      localStorage.setItem('theme', userTheme);
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setTheme('light');
    applyTheme('light');
  };

  const applyTheme = (mode) => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(mode);
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, theme, updateTheme }}>
      {children}
    </AuthContext.Provider>
  );
}