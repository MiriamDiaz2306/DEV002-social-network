// eslint-disable-next-line import/no-unresolved
import { signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

// const auth = getAuth();
const provider = new GoogleAuthProvider();

export const authGoogle = async () => {
  try {
    const userResult = await signInWithPopup(auth, provider);
    console.log(userResult);
    console.log('probando');
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const correo = error.customData.email;
    console.log(errorCode, errorMessage, correo, credential);
  }
};

export function signInWithGoogle(callback) {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      const email = result.user.email;
      console.log('signed in');
      callback(true);
      // ...
    }).catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      callback(false);
      // ...
    });
}
