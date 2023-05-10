import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()


    const handleSignUp = (e) => {
        e.preventDefault();
    
        console.log(name, password, email)
        fetch('http://localhost:5555/users', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, email, password })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data);
            if (data.id) {
                navigate('/home')

                // Registration is successful, you can update the state or redirect the user as needed
                // For example, you can automatically log in the user or show a success message
            } else if (data.error) {
                // Display an error message or handle the error as needed
            }
        });
    };
    
  return (
    <div>
        <form onSubmit={handleSignUp} className='max-w-[400px] w-full mx-auto rounded-lg bg-[#0f172a] p-8 px-8'>
                  <h2 className='text-4xl text-white font-bold text-center'>SIGNUP</h2>
                  <div className='flex flex-col text-gray-400 py-2'>
                      <label>Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" />
                  </div>
                  <div className='flex flex-col text-gray-400 py-2'>
                      <label>Email</label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" />
                  </div>
                  <div className='flex flex-col text-gray-400 py-2'>
                      <label>Password</label>
                      <input value={password} onChange={(e) => setPassword(e.target.value)} className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="password" />
                
                  </div>
                  
                  
                  <button  className='w-full my-5 py-2 bg-teal-500 shadow-lg
                   shadow-teal-500/50 hover:shadow-teal-500/40 text-white text-xs font-semibold rounded-lg'>REGISTER</button>
                  
              </form>
    </div>
  )
}

export default Signup