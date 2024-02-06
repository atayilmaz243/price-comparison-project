
import React, { useState,useEffect } from 'react';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword, signInWithRedirect,getRedirectResult} from 'firebase/auth';
import {auth,provider} from '../firebase';


function Deneme()
{

  const [email,setEmail] = useState('');
  const [pwd,setPwd] = useState('');
  const [user,setUser] = useState();



  useEffect(() => {
    checkRedirectResult()
  },[]);


  async function checkRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      const user2 = result.user;
      console.log('aaa');
      console.log(user2);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + ' - ' + errorMessage);
    }
  }

  async function GoogleLogin() {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.log("Error in signInWithRedirect: ", error);
    }
  }


  function register(e)
  {
    e.preventDefault();

    createUserWithEmailAndPassword(auth,email,pwd)
    .then((userCredential) => {
      // Signed in 
      setUser(userCredential.user);
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('error');
      console.log(errorCode + ' - ' + errorMessage);
      // ..
    });

  }

  function login(e)
  {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, pwd)
      .then((userCredential) => {
        // Signed in 
        setUser(userCredential.user);
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('error');
        console.log(errorCode + ' - ' + errorMessage);
      });

  }

  return (
    <>
    
      <form onSubmit = {register}>
        <input placeholder = "email" value = {email} onChange={(e) => {setEmail(e.target.value)}}/>
        <input placeholder = "sifre" value = {pwd} onChange = {(e) => {setPwd(e.target.value)}} />
        <button type = "submit">

          kayit ol
        </button>
      </form>
      <form onSubmit = {login}>
      <input placeholder = "email" value = {email} onChange={(e) => {setEmail(e.target.value)}}/>
        <input placeholder = "sifre" value = {pwd} onChange = {(e) => {setPwd(e.target.value)}} />
        <button type = "submit">

          giris yap
        </button>
      </form>
      <p>aaaa</p>


      <button onClick = {GoogleLogin}>Sign in with google</button>
    
    </>
    
  
  
  );
}

export default Deneme;