import React from 'react';
import MbtiTestApp from './MbtiTestApp';
import AdminPage from './pages/AdminPage';
import PrivacyPage from './pages/PrivacyPage';

const App: React.FC = () => {
  const path = window.location.pathname;
  
  if (path === '/admin') {
    return <AdminPage />;
  }
  
  if (path === '/privacy') {
    return <PrivacyPage />;
  }
  
  return <MbtiTestApp />;
};

export default App;