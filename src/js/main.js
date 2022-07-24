import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, doc, addDoc, deleteDoc, query, where, orderBy, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

console.log(import.meta.env.VITE_TEST_VAR);
const firebaseConfig = {
  apiKey: 'AIzaSyDJxljNAIBezuZOH9csu9nmQV3 - rjw2foU',
  authDomain: 'webprojects-ca9b3.firebaseapp.com',
  projectId: 'webprojects-ca9b3',
  storageBucket: 'webprojects-ca9b3.appspot.com',
  messagingSenderId: '408705471207',
  appId: '1:408705471207:web:69d12f76e6a0235b158842',
};

//Init Firebase App
initializeApp(firebaseConfig);

//Init services
const db = getFirestore();
const auth = getAuth();

//Collection reference
const colRef = collection(db, 'books');

//Queries
const q = query(colRef, orderBy('createdAt'));

//Realtime Collection Data
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});
//Adding Documents
const addBookForm = document.getElementById('add');

addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

//Delete Documents
const deleteBookForm = document.getElementById('delete');

deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, 'books', deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

//Get a single document
const docRef = doc(db, 'books', 'tGqao2Q03igCidoJAb2Z');

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

//Updating a document
const updateForm = document.getElementById('update');
updateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, 'books', updateForm.id.value);

  updateDoc(docRef, {
    title: 'updated title',
  }).then(() => {
    updateForm.reset();
  });
});

//signing up users
const signupForm = document.getElementById('signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log('user created:', cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//Logging in & Out
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', (e) => {
  signOut(auth)
    .then(() => {
      // console.log('the user signed out');
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.getElementById('login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // console.log('user logged in:', cred.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//Subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed: ', user);
});

//Unsubscribing from changes (auth & db)
const unsubButton = document.getElementById('unsub');
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing');
  unsubCol();
  unsubDoc();
  unsubAuth();
});
