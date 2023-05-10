import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");

//   function handleSubmit(e) {
//     e.preventDefault();
//     fetch("/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username }),
//     }).then((r) => {
//       if (r.ok) {
//         r.json().then((user) => onLogin(user));
//       }
//     });
//   }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <form className='max-w-[400px] w-full mx-auto rounded-lg bg-[#0f172a] p-8 px-8'>
            <h3>Login With Username</h3>
            <label htmlFor="username">Username: </label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    </div>
  );
}

export default Login;