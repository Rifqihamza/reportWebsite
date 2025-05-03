'use client';
import { useState } from "react";
import { APIResultType, userLogin } from "../api/api";

export default function FormComponent() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        console.log("LOGGING IN...");
        
        const result = await userLogin(username, password);
        if(result == APIResultType.NoError) {
            window.location.href = "/#login";
        }
        else if(result == APIResultType.Unauthorized) {
            alert("Unauthorized!");
        }
        else {
            alert("There's an error!");
        }
    }

    return <>
    {/* Username */}
      <div className="space-y-2 mt-6">
        <label htmlFor="username" className="font-bold"> Username </label>
        <input
          type="text"
          name="username"
          placeholder="Username..."
          className="mt-3 shadow-inner shadow-gray-300 rounded-md w-full px-4 py-3 outline-none focus:shadow-gray-600 transition-colors placeholder-black"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="space-y-2 mt-8">
        <label htmlFor="password" className="font-bold"> Passsword </label>
        <input
          type="password"
          name="password"
          placeholder="Password..."
          className="mt-3 shadow-inner shadow-gray-300 rounded-md w-full px-4 py-3 outline-none focus:shadow-gray-600 transition-colors placeholder-black"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

    {/* Login Button */}
      <div className="space-y-2 mt-8">
        <button
          type="button"
          className="w-full uppercase tracking-[2px] font-bold px-6 py-3 bg-red-900 -translate-y-[10px] [box-shadow:0_10px_0_#d1c9b4] active:[box-shadow:0_5px_0_#d1c2b5] active:-translate-y-[5px] text-white rounded-xl"
          onClick={handleLogin}
          >Login</button>
      </div>
    </>
}