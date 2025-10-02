import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from '@/components/Layout/Header';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Teams from '@/pages/Teams';
import MyTeamsPage from '@/pages/Teams/MyTeamsPage';
import JoinTeamPage from '@/pages/Teams/JoinTeamPage';
import Tournaments from '@/pages/Tournaments';
import News from '@/pages/News';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
import Admin from '@/pages/Admin';
import Subscription from '@/pages/Subscription';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/teams" element={<Teams />} />
            <Route 
              path="/teams/my" 
              element={
                <ProtectedRoute>
                  <MyTeamsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teams/join/:token" 
              element={
                <ProtectedRoute>
                  <JoinTeamPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/news" element={<News />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subscription" 
              element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
