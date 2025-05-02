import React, { useState } from 'react';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const data = await res.json();
  
    if (data.success) {
      setUser({ ...data.user, isAdmin: data.isAdmin }); // include isAdmin
    } else {
      alert('Login failed');
    }
  };  

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
