export default function populateSessionStorage({jwt, name, email, publicKey, userid}) {
    sessionStorage.setItem('jwt', jwt);
    sessionStorage.setItem('username', name);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('publicKey', publicKey);
    sessionStorage.setItem('userid', userid);
}