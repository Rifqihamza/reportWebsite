"use client";
import { useState } from "react";
import { APIResultType, userLogin } from "../../utils/api_interface";
import { AccountType } from "../../types/variables";
import { useMessageToastHook } from "../../hooks/shared/useMessageToast";

export default function LoginFormComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginDisabled, setLoginDisabled] = useState(false);
  const { showMessage } = useMessageToastHook();

  const handleLogin = async () => {
    setLoginDisabled(true);

    try {
      const result = await userLogin(username, password);
      if (result === AccountType.Guru) {
        window.location.href = "/dashboard";
      } else if (Object.values(AccountType).find((val) => val.toString() == result.toString())) {
        window.location.href = "/";
      } else if (result == APIResultType.Unauthorized) {
        showMessage("Unauthorized!", "error", "Wrong password or username");
      } else {
        showMessage("There's an error!", "error", "Unknown error detected please report to developer");
      }
    } catch (err) {
      alert("There's an unexpected error..");
    }

    setLoginDisabled(false);
  };

  return (
    <>
      {/* Username */}
      <div className="space-y-2 mt-6">
        <label htmlFor="username" className="font-bold">
          Username
        </label>
        <input type="text" name="username" placeholder="Username..." autoComplete="off" className="mt-3 bg-[#E2DAD6] shadow-inner shadow-gray-300 rounded-xl w-full px-4 py-3 outline-none focus:shadow-gray-400 focus:duration-300 focus:ease placeholder-black" onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => (e.key == "Enter" ? handleLogin() : "")} required />
      </div>

      {/* Password */}
      <div className="space-y-2 mt-2">
        <label htmlFor="password" className="font-bold">
          Passsword
        </label>
        <input type="password" name="password" placeholder="Password..." className="mt-3 bg-[#E2DAD6] shadow-inner shadow-gray-300 rounded-xl w-full px-4 py-3 outline-none focus:shadow-gray-400 focus:duration-300 focus:ease placeholder-black" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => (e.key == "Enter" ? handleLogin() : "")} required />
      </div>

      {/* Login Button */}
      <div className="space-y-2 mt-8">
        <button type="button" className="disabled:opacity-50 w-full uppercase tracking-[2px] font-bold px-6 py-2 bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px] text-white rounded-xl cursor-pointer" disabled={loginDisabled} onClick={handleLogin}>
          {loginDisabled ? <i className="pi pi-spin pi-spinner" style={{ fontSize: "1rem", marginRight: "10px" }}></i> : ""}
          Login
        </button>
      </div>
    </>
  );
}
