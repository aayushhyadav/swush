import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

// import Context from 'store/context';
import styles from 'styles/auth/Login.module.css';

export default function Login() {
  // const { globalState, globalDispatch } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const res = await axios.post(
        '/api/auth/login',
        { email, password },
        { redirect: 'follow' }
      );

      if (res.status === 200) {
        const { jwt } = res.data;
        localStorage.setItem('jwt', jwt);
        // globalDispatch({ type: 'LOGIN' });
        router.push('/dashboard');
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        setError(error.response.data.Error);
      } else {
        setError('Some error occured!');
      }
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.main__box}>
        <p className={styles.error}>{error}</p>

        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>

        <p className={styles.signup}>
          <Link href="/auth/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
