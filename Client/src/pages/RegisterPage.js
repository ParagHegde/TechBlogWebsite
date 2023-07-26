import React, { useState } from 'react'

export default function RegisterPage() {
  const [username,setUserName]=useState("");
  const [password,setPassword]=useState("");
   async function register(e){
    e.preventDefault();
    const resp = await fetch('http://localhost:4000/register',{
      method:'POST',
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'}
    })
    if(resp.status === 200){
      alert('registration successfull');
    }else{
      alert('registration failed');
    }
  }
  return (
    <form className='Register' onSubmit={register}>
      <h1>Register</h1>
        <input type="text" placeholder='Username' value={username} onChange={(e)=>setUserName(e.target.value)}/>
        <input type="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button>Register</button>
    </form>
  )
}
