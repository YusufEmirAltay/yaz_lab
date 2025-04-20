import React, { useState } from 'react';
import './index.css';

function KayitOl() {
  const [tc, setTc] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tc, name, email, password, role: 'aday' })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(`✅ Kayıt başarılı: Hoş geldin ${data.user.name} 🥳`);
    } else {
      setMessage(`❌ Kayıt başarısız: ${data.error} 😢`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Kayıt Ol</h1>

      <label>TC Kimlik No:</label>
      <input
        type="text"
        value={tc}
        onChange={(e) => setTc(e.target.value)}
        required
        maxLength={11}
        pattern="[0-9]{11}"
      />

      <label>Ad Soyad:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Şifre:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Kayıt Ol</button>

      {message && (
        <p className={message.includes('✅') ? 'success' : 'error'}>
          {message}
        </p>
      )}
    </form>
  );
}

export default KayitOl;
