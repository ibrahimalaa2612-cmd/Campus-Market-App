import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import CompleteProfile from './CompleteProfile';
import Home from './Home';

function App() {
  const [view, setView] = useState('login');

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      {view === 'login' && (
        <Login 
          onSwitch={() => setView('register')}
          onSuccess={() => setView('complete')}
        />
      )}

      {view === 'register' && (
        <Register
          onBack={() => setView('login')}
          onSuccess={() => setView('complete')}
        />
      )}

      {view === 'complete' && (
        <CompleteProfile 
          onSuccess={() => setView('home')}
        />
      )}

      {view === 'home' && <Home />}
    </div>
  );
}

export default App;