import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import styles from 'styles/auth/Login.module.css';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function validateForm() {
    return name.length > 0 && email.length > 0 && password.length > 0;
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const res = await axios.post(
        '/api/auth/signup',
        { name, email, password },
        { redirect: 'follow' }
      );

      if (res.status === 200) {
        router.push('/dashboard');
      }
    } catch (err) {
      const errMessage = err.response.data.Error ?? 'Some error occured!';
      setError(errMessage);
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.main__box}>
        <p className={styles.error}>{error}</p>

        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="example@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={styles.submit} type="submit" disabled={!validateForm()}>
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
