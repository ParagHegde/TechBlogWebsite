import React, { useContext, useState } from 'react'
import {Navigate} from 'react-router-dom'
import {UserContext} from '../UserContest';

export default function LoginPage() {
  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');
  const [redirect,setRedirect]=useState(false);
  const{setUserInfo} = useContext(UserContext);

  async function Login(e){
    e.preventDefault();
    const resp = await fetch('http://localhost:4000/login',{
      method:'POST',
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'},
      credentials:'include',
    })
    if(resp.ok){
      resp.json().then(userInfo=>{
        setUserInfo(userInfo);
        setRedirect(true);
      })
    }
    else{
      alert("wrong credentials")
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }

  return (
    <form className='Login' onSubmit={Login}>
      <h1>Login</h1>
        <input type="text" placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <input type="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button>Login</button>
    </form>
  )
}
