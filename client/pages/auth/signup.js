import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import GlobalContext from 'store/context';
import CircularProgress from '@mui/material/CircularProgress';

import styles from 'styles/auth/Login.module.css';

export default function Login() {
  const { globalState, globalDispatch } = useContext(GlobalContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoader(false);
  }, [error]);

  function validateForm() {
    return name.length > 0 && email.length > 0 && password.length > 0;
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setLoader(true);

      const res = await axios.post(
        '/api/auth/signup',
        { name, email, password },
        { redirect: 'follow' }
      );

      if (res.status === 200) {
        const { jwt, publicKey, name } = res.data;

        sessionStorage.setItem('jwt', jwt);
        sessionStorage.setItem('publicKey', publicKey);
        sessionStorage.setItem('username', name);

        globalDispatch({ type: 'LOGIN' });
        globalDispatch({ type: 'SET_NAME', payload: name });

        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response.data.Error);
    }
  }

  return (
    <div className={styles.main}>
      {loader ? <CircularProgress /> : ''}
      <div className={styles.main__box}>
        <p className={styles.error}>{error}</p>

        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            disabled={loader}
            type="text"
            name="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className={styles.input}
            disabled={loader}
            type="email"
            name="email"
            placeholder="example@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={styles.input}
            disabled={loader}
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className={styles.submit}
            type="submit"
            disabled={!validateForm() || loader}
          >
            Sign Up
          </button>
        </form>

        <p className={styles.signup}>
          <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
