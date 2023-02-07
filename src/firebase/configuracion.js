/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
// Importa la biblioteca de Firebase
// eslint-disable-next-line import/no-unresolved
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword,
// eslint-disable-next-line import/no-unresolved
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  arrayUnion,
  arrayRemove,
// eslint-disable-next-line import/no-unresolved
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

// const auth = getAuth();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAAHfvbH9LChUrOwAbR4cydwCsmHa7Q330',
  authDomain: 'usuarias-journey-mates.firebaseapp.com',
  projectId: 'usuarias-journey-mates',
  storageBucket: 'usuarias-journey-mates.appspot.com',
  messagingSenderId: '15257223280',
  appId: '1:15257223280:web:eecc0cb646124a2f42b4b5',
  measurementId: 'G-4W8ETMYH7S',
};
// Inicializa la aplicación de Firebase,  valores de clave necesarios para conectarse y utilizar un proyecto específico en Firebase.
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);// Obtiene un servicio de autenticación de Firebase a partir de la instancia inicializada
export const provider = new GoogleAuthProvider(app);// Crea un proveedor de autenticación de Google a partir de la instancia de Firebase.
export const db = getFirestore(app);// Obtiene un servicio de base de datos de Firestore de Firebase a partir de la instancia inicializada.
export const user = () => auth.currentUser;// Define una función que devuelve el usuario actualmente autenticado en Firebase.
// Publicar
export const saveTask = (description) => addDoc(collection(db, 'tasks'), { // funcion toma como entrada una descripción y agrega un documento a una colección de tareas en Firestor
  description,
  name: auth.currentUser.displayName,
  uid: auth.currentUser.uid, // Identificador único del usuario actual obtenido a través de la autenticación de Firebase.
  likes: [],
  createdDateTime: Timestamp.fromDate(new Date()),
});
// Guardar la informacion de registro
export const saveUser = (name, uid, email, pais) => addDoc(collection(db, 'users'), {
  name,
  uid,
  email,
  pais,
  createdDateTime: Timestamp.fromDate(new Date()),
});

export const getTasks = () => getDocs(collection(db, 'tasks'));// Obtiene todos los documentos de la colección de tareas utilizando la función getDocs
export const deleteTask = (id) => deleteDoc(doc(db, 'tasks', id));// Elimina un documento específico de la colección de tareas utilizando la función deleteDoc con su id.
export const getTask = (id) => getDoc(doc(db, 'tasks', id));// Obtiene un documento específico de la colección de tareas utilizando la función getDoc con el id.
export const updateTask = (id, newFields) => updateDoc(doc(db, 'tasks', id), newFields);// Actualiza un documento específico de la colección.
export const dateTask = (querySnapshot) => { // 0rdena todos los documentos en la colección de tareas por fecha y hora.
  const q = query(collection(db, 'tasks'), orderBy('createdDateTime', 'desc')); // fecha y orden
  onSnapshot(q, querySnapshot);// escucha los cambios de la coleccion con la función onSnapshot, querySnapshot contiene información sobre los documentos devueltos por la consulta en tiempo real.
};

// Create new users, sincrona con callback,secuencial y bloqueará la ejecución del código hasta que se complete.
export function registerUser(email, password, name, pais, callback) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateProfile(auth.currentUser, {
        displayName: name,

      });
      // El usuario ha sido registrado correctamente
      // eslint-disable-next-line no-console
      console.log('Usuario registrado correctamente');
      const user = userCredential.user;
      const userId = user.uid;
      user.displayName = name;
      // console.log(user, userId);
      saveUser(user.displayName, userId, email, pais);
      callback(true);
    })
    .catch((error) => {
      console.error(error.code);
      if (error.code === 'auth/email-already-in-use') {
        alert('Este correo ya está registrado');
      } else if (error.code === 'auth/weak-password') {
        alert('Tu contraseña debe contener al menos 6 caracteres');
      } else if (error.code === 'auth/invalid-email') {
        alert('Este correo no existe o es inválido');
      } else if (error.code === 'auth/internal-error') {
        alert('Completa todos los campos');
      }
      callback(false);
    })
    .then(() => {
      sendEmailVerification(auth.currentUser);
    });
}

// inicio de sesión con email,asíncrona, la función no bloqueará el hilo principal yse espera la operación
export async function inicioDeSesionEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('signed in');
    const user = userCredential.user;
    const userId = user.uid;
    console.log(user, userId);
    return true;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      alert('Este correo ya está registrado');
    } else if (error.code === 'auth/weak-password') {
      alert('Tu contraseña no es segura');
    } else if (error.code === 'auth/invalid-email') {
      alert('Este correo no existe o es inválido');
    } else if (error.code === 'auth/internal-error') {
      alert('Completa todos los campos');
    }
    return false;
  }
}

// Sign in with Google, inicia de sesion con un provedor de autentificacion.

export const authGoogle = async () => {
  try {
    const userResult = await signInWithPopup(auth, provider);
    console.log(userResult);
    console.log('probando');
    window.location.href = '/timeLine';
  } catch (error) {
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // const correo = error.customData.email;
    // console.log(error);
  }
};

// Cerrar sesión

export const signOutFirebase = (auth) => auth.signOut();

export const onAuth = (auth) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('user is signed in');
      // const uid = user.uid;
    } else {
      console.log('user is signed out');
    }
  });
};

// Like function

export const tapLike = (id, newLike) => {
  updateDoc(doc(db, 'tasks', id), {
    likes:
      arrayUnion( // función de Firebase que permite agregar un nuevo elemento a un campo en la base de datos
        newLike,
      ),
  });
};

export const dislike = (id, oldLike) => {
  updateDoc(doc(db, 'tasks', id), {
    likes:
      arrayRemove( // permite eliminar un elemento específico de un campo en la base de datos que está configurado como un arreglo
        oldLike,
      ),
  });
};

export {
  createUserWithEmailAndPassword,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  Timestamp,
  updateProfile,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getFirestore,

};
