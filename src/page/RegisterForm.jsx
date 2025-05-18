import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../api/userApi';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await signUp(email, password, username);
    if (!error) navigate('/');
    else alert(error.message);
  };

  return (
    <form onSubmit={handleRegister} style={{ padding: '2rem', maxWidth: 400, margin: 'auto' }}>
      <h2>Register</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
