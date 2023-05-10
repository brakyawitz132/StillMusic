import { useState } from "react";
import { Link } from 'react-router-dom'

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//   function handleSubmit(e) {
//     e.preventDefault();
//     fetch("/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email }),
//     }).then((r) => {
//       if (r.ok) {
//         r.json().then((user) => onLogin(user));
//       }
//     });
//   }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <form className='max-w-[400px] w-full mx-auto rounded-lg bg-[#0f172a] p-8 px-8 text-white flex flex-col justify-center'>
            <h3>Login With email</h3>
            <label htmlFor="email">Email: </label>
            <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <input type='test' value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <div className="flex justify-center mt-4">
                <button type="submit" className="border border-white">Login</button>
            </div>
        </form>
    </div>
  );
}

export default Login;