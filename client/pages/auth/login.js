import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import axios from 'axios';
import withSession from 'utils/withSession';
import { connectToDatabase } from 'utils/connectDb';

import Context from 'store/context';
import styles from 'styles/auth/Login.module.css';

export default function Login() {
  const { globalState, globalDispatch } = useContext(Context);
  const matches = useMediaQuery('(max-width:500px)');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dashboardLink, setDashboardLink] = useState('/dashboard');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (matches) setDashboardLink('/m/teams');
    else setDashboardLink('/dashboard');
  }, [matches]);

  useEffect(() => {
    setLoader(false);
  }, [error]);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setLoader(true);

      const res = await axios.post(
        '/api/auth/login',
        { email, password },
        { redirect: 'follow' }
      );

      if (res.status === 200) {
        const { jwt, name, email, publicKey, userid } = res.data;

        sessionStorage.setItem('jwt', jwt);
        sessionStorage.setItem('username', name);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('publicKey', publicKey);
        sessionStorage.setItem('userid', userid);

        const notifications = await axios.post('/api/team/viewNotifications', { jwt });

        globalDispatch({ type: 'LOGIN', payload: notifications.data.Notifications });
        globalDispatch({ type: 'SET_NAME', payload: name });

        router.push(dashboardLink);
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
      {loader ? <CircularProgress /> : ''}
      <div className={styles.main__box}>
        <p className={styles.error}>{error}</p>
        <form onSubmit={handleSubmit}>
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

export const getServerSideProps = withSession(async function () {
  await connectToDatabase();
  return {
    props: {},
  };
});
