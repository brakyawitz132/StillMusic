import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'

function Login({ userId, setUserId, token, setToken, setShowSideBar }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  function handleSignupClick() {
    navigate('/register')
  }
  function handleLoginClick(e) {
    e.preventDefault()
    fetch('/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "email": email, "password": password })
    })
      .then(r => {
        if (r.status === 200) {
          return r.json()
        }
        else {
          alert("Bad Login")
        }
      })
      .then(data => {
        // sessionStorage.setItem("token", data.access_token)
        // setToken(sessionStorage.getItem("token"))
        setUserId(data.user_id)
        // setShowSideBar(false)
        navigate(`/converter`)
      })
      .catch(error => {
        console.error("There was an error", error)
      })
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <form className='max-w-[400px] w-full mx-auto rounded-lg bg-[#0f172a] p-8 px-8 text-white flex flex-col justify-center'>
        <h3>Login With email</h3>
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-black"
        />
        <label htmlFor="password">Password:</label>
        <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} className="text-black"></input>
        <div className="flex justify-center mt-4">
          <button onClick={handleLoginClick} className="border border-white">Login</button>
        </div>
        <div className="flex justify-center mt-4">
          <button type="click" onClick={handleSignupClick} className="border border-white">Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default Login;