import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function GirisYap() {
  const [tc, setTc] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tc, password })
      });

      const data = await response.json();

      if (response.ok) {
        const role = data.role;
        localStorage.setItem('tc', tc); // Giriş yapan kişinin TC'sini sakla
        setMessage(`✅ Giriş başarılı! (${role})`);

        // role'a göre yönlendirme
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'yonetici') {
          navigate('/yonetici');
        } else if (role === 'juri') {
          navigate('/juri');
        } else if (role === 'aday') {
          navigate('/aday');
        } else if (role === 'yönetici') {
          navigate('/yonetici');}
          else {
          setMessage('❌ Bilinmeyen rol.');
        }
      } else {
        setMessage(`❌ Giriş başarısız: ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Sunucu hatası');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Giriş Yap</h1>

      <label>TC Kimlik No:</label>
      <input
        type="text"
        value={tc}
        onChange={(e) => setTc(e.target.value)}
        required
        maxLength={11}
        pattern="[0-9]{11}"
      />

      <label>Şifre:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Giriş Yap</button>

      {message && (
        <p className={message.includes('✅') ? 'success' : 'error'}>
          {message}
        </p>
      )}
    </form>
  );
}

export default GirisYap;
