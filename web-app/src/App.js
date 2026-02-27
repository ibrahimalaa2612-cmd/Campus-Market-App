import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import CompleteProfile from './CompleteProfile';

function App() {
  const [view, setView] = useState('login'); // 'login', 'register', 'complete'

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      {view === 'login' && <Login onSwitch={() => setView('register')} onSuccess={() => setView('complete')} />}
      {view === 'register' && (
        <Register
          onBack={() => setView('login')}
          onSuccess={() => setView('complete')}
        />
      )}
      {view === 'complete' && <CompleteProfile />}
    </div>
  );
}

export default App;