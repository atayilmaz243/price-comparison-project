
import '../styles/userauth.css';

import {Cross1Icon,ExitIcon, PersonIcon} from '@radix-ui/react-icons'
import React, { useState, useEffect,useRef} from 'react';
import {signInWithRedirect,onAuthStateChanged,signOut} from 'firebase/auth';
import {auth,provider} from '../firebase';


export function Login({setOpen})
{


  async function GoogleLogin() {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.log("Error in signInWithRedirect: ", error);
    }
  }


  return (
    <div className = 'login'>
      <div className = 'login-container'>
        <div className = 'login-close' onClick = {() => {setOpen(false)}}><Cross1Icon /></div>
        <p style = {{fontWeight: 500,fontSize: 23}}>Giriş yap</p>
        <div className = 'login-line'></div>
        <div className = 'login-google' onClick = {GoogleLogin}>
          <img src = "https://storage.googleapis.com/images4134123/company-images/google-logo" alt = ""/>
          <p>Google ile giriş yap</p>
        </div>
      </div>

    </div>
  );
}

function UserInfo({user})
{
  const optionRef = useRef(null);
  const [isOpenOption,setOpenOption] = useState(false);
  
  useEffect(() => {
    const closeOptions = (e) => {
      if (!optionRef.current.contains(e.target))
      {
        setOpenOption(false);
      }
    };

    document.addEventListener('mousedown',closeOptions);

    return () => {document.removeEventListener('mousedown',closeOptions)};
  },[]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
      }).catch((error) => {
        console.log("Error signing out: ", error);
      });
  };
  return (
    <div ref = {optionRef} onClick = {() => {setOpenOption(!isOpenOption)}} className = 'user-logo'>
      <PersonIcon />
      {isOpenOption && <div className = 'user-options'>
        <div onClick = {handleSignOut} className = 'user-option'>
          <ExitIcon />
           Çıkış yap
        </div>

      </div>}
    </div>
  );



}

// eslint-disable-next-line
export default function UserAuth({setListItems,list,setList,user,setUser})
{
  const [isOpenLogin,setOpenLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // console.log(authUser);
        setUser(authUser);
      } else {
        // console.log('noooo'); 
        setUser(null);
        // console.log('auth null');
      }
    });

    return () => unsubscribe();
     // eslint-disable-next-line
  },[]);

  useEffect(() => {
    if (user)
    {
      const fetchdata = async () => {
        fetch(process.env.REACT_APP_API_URL + '/get-user-list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id:user.uid})
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json()
        })
        .then(data => {
          setList(data);
          // console.log('user found');
          // console.log(data);
        })
        .catch(error => {
          setList([]);
          console.log('user not found in the database');
        });
      }
      fetchdata();
    }
    else
    {
      setList(null);
    }
    // eslint-disable-next-line 
  },[user]);

  useEffect(() => { 
    if (list && setListItems)
    {
      // console.log('guncelle');
      const fetchdata = async () => {
      fetch(process.env.REACT_APP_API_URL + '/get-products-by-list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({list: list}) // Your payload
        })
        .then(response => {
          if (!response.ok) {
            // console.log('aasdasdsa')
            throw new Error('Network response was not ok');
          }
          return response.json()
        })
        .then(data => {
          // console.log(data);
          // console.log('aaakk');
          setListItems(data);
        })
        .catch(error => {console.log('error setting items by list');});
      }
      fetchdata();
    }
    else if(setListItems)
    {
      setListItems(null);
    }
    // eslint-disable-next-line 
  },[list]);

  return (
    <>
      {isOpenLogin && <Login setOpen={setOpenLogin}/>}
      <div className ='user-login'>
        {user ? <UserInfo user = {user}/> : <p onClick = {() => {setOpenLogin(true)}} className = 'login-p' >Giriş yap</p>}
      </div>
    </>
  )
}