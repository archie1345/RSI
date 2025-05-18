import { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { signIn } from '../api/userApi';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (!error) navigate('/');
    else alert(error.message);
  };

  return (
    <form onSubmit={handleLogin} style={{ padding: '2rem', maxWidth: 400, margin: 'auto' }}>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button type="submit">Login</button>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>

    </form>
  );
};

export default LoginForm;
