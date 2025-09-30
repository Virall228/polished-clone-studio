import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Layout/Header';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Teams from '@/pages/Teams';
import Tournaments from '@/pages/Tournaments';
import News from '@/pages/News';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;