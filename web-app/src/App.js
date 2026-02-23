import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function App() {
  const [view, setView] = useState('login');

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      {view === 'login' ? (
        <Login onSwitch={() => setView('register')} />
      ) : (
        <Register onBack={() => setView('login')} />
      )}
    </div>
  );
}

export default App;