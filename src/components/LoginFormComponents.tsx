'use client';
import { useState } from "react";


export default function LoginFormComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginDisabled, setLoginDisabled] = useState(false);
  
  const handleLogin = async () => {
    setLoginDisabled(true);
    
    
    setTimeout(() => {
        setLoginDisabled(false);
    }, 1000);
  }

  return <>
    {/* Username */}
    <div className="space-y-2 mt-6">
      <label htmlFor="username" className="font-bold"> Username </label>
      <input
        type="text"
        name="username"
        placeholder="Username..."
        className="mt-3 bg-[#E2DAD6] shadow-inner shadow-gray-300 rounded-xl w-full px-4 py-3 outline-none focus:shadow-gray-400 transition-colors duration-300 placeholder-black"
        onChange={(e) => setUsername(e.target.value)}
        required
      />
    </div>

    {/* Password */}
    <div className="space-y-2 mt-8">
      <label htmlFor="password" className="font-bold"> Passsword </label>
      <input
        type="password"
        name="password"
        placeholder="Password..."
        className="mt-3 bg-[#E2DAD6] shadow-inner shadow-gray-300 rounded-xl w-full px-4 py-3 outline-none focus:shadow-gray-400 transition-colors duration-300 placeholder-black"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    {/* Login Button */}
    <div className="space-y-2 mt-8">
      <button
        type="button"
        className="disabled:opacity-50 w-full uppercase tracking-[2px] font-bold px-6 py-3 bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px] text-white rounded-xl"
        disabled={loginDisabled}
        onClick={handleLogin}
      >Login</button>
    </div>
  </>
}