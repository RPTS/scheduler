import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBhMVDpcIMF_OVuZMnAqASpBUeSbGr4iz4",
    authDomain: "scheduler394-56923.firebaseapp.com",
    databaseURL: "https://scheduler394-56923-default-rtdb.firebaseio.com",
    projectId: "scheduler394-56923",
    storageBucket: "scheduler394-56923.appspot.com",
    messagingSenderId: "266267646831",
    appId: "1:266267646831:web:bae2e0b630b4c3f276e69a",
    measurementId: "G-5V3PHRL4MH"
  };

  const firebase = initializeApp(firebaseConfig);
  const database = getDatabase(firebase);

  export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`loading ${path}`); }
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (devMode) { console.log(val); }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
  };

  export const setData = (path, value) => (
    set(ref(database, path), value)
  );

  export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
  };

  const firebaseSignOut = () => signOut(getAuth(firebase));
  export { firebaseSignOut as signOut };

  export const useUserState = () => {
    const [user, setUser] = useState();
  
    useEffect(() => {
      onIdTokenChanged(getAuth(firebase), setUser);
    }, []);
  
    return [user];
  };