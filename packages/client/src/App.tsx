import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Landing } from './pages/Landing';
import { Friends } from './pages/Friends';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';
import { Explore } from './pages/Explore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CallProvider } from './context/CallContext';
import { CallOverlay } from './components/CallOverlay';
import { ThemeProvider } from './context/ThemeProvider';
import { AppLayout } from './components/AppLayout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Landing />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <CallProvider>
                  <AppLayout>
                    <CallOverlay />
                    <Routes>
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/friends" element={<Friends />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/explore" element={<Explore />} />
                      <Route path="*" element={<Navigate to="/chat" replace />} />
                    </Routes>
                  </AppLayout>
                </CallProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
