import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Register from './Pages/Register';
import type { createdUser } from './types/user.ts';
import Dashboard from './Pages/Dashboard.tsx';
import Login from './Pages/Login.tsx';
import ProtectedRoute from './Components/ProtectedComponent.tsx';
import { setInMemoryToken } from './api.ts';
import { refreshAccessToken } from './api/auth.ts';
import Profile from './Pages/Profile.tsx';
import Home from './Pages/Home.tsx';

const AppRoutes = () => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(true);

  const handleSuccess = (userData: createdUser) => {
    console.log("Welcome!", userData.username);
  };

  useEffect(() => {
    const restore = async () => {
      try {
        const token = await refreshAccessToken();

        setAccessToken(token);
      } catch {
        setAccessToken("");
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);


  useEffect(() => {
    setInMemoryToken(accessToken);
  }, [accessToken]);







  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />

      <Route
        path="/register"
        element={
          <Register
            setAccessToken={setAccessToken}
            onRegisterSuccess={handleSuccess}
          />
        }
      />

      <Route
        path="/login"
        element={
          <Login setAccessToken={setAccessToken} />
        }
      />

      <Route
        element={
          <ProtectedRoute accessToken={accessToken} />
        }
      >
        <Route
          path="/dashboard"
          element={<Profile setAccessToken={setAccessToken} />}
        />
        <Route
          path="/home"
          element={<Home />}
        />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;