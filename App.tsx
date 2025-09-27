import React from 'react';
import MbtiTestApp from './MbtiTestApp';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  const isAdmin = window.location.pathname === '/admin';
  
  if (isAdmin) {
    return <AdminPage />;
  }
  
  return <MbtiTestApp />;
};

export default App;