import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from 'styles/auth/Login.module.css';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  function validateForm() {
    return name.length > 0 && email.length > 0 && password.length > 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const raw = JSON.stringify({ name, email, password });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: raw,
      redirect: 'follow'
    };

    const res = await fetch('/api/auth/signup', requestOptions);
    const result = await res.json();
    console.log(result.status, result);

    if (res.status == '200') {
      router.push('/auth/dashboard');
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.main__box}>
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
      </div>
    </div>
  );
}
