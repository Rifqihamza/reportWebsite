"use client";
import { useEffect, useState } from "react";
import { APIResultType, userLogin } from "../../../utils/api_interface";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";
import { AccountType } from "../../../types/variables";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";

export default function LoginFormComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(null as boolean | null);
  
  const { showMessage, showMessageByAPI } = useMessageToastHook();
  const { isConnected } = useNetworkConnectivityHook();

  const handleLogin = async () => {
    if(!isConnected) {
      showMessage("Internet koneksi terputus.", "error", "Mohon coba lagi setelah terkoneksi internet");
      return;
    }
    
    setLoginDisabled(true);

    try {
      const result = await userLogin(username, password);
      if(Object.values(AccountType).includes(result as AccountType)) {
        showMessage("Welcome!", "success", "You've successfully login! You'll be redirected in a second..");
        setIsPasswordCorrect(true);
        setTimeout(() => {
          window.location.href = (result === AccountType.Admin) ? "/dashboard" : "/form";
        }, 2000);
        return;
      }
      else if (result === APIResultType.Unauthorized) {
        setIsPasswordCorrect(false);
        showMessageByAPI(result, "Wrong password or username");
      }
      else {
        showMessageByAPI(result as APIResultType);
      }
    } catch (err) {
      showMessage("There's an unexpected error..", "error", "");
    }

    setLoginDisabled(false);
  };

  useEffect(() => {
    setIsPasswordCorrect(null);
  }, [username, password]);

  return (
    <>
      {/* Username */}
      <div className="space-y-2 mt-6">
        <label htmlFor="username" className={`font-bold ${(isPasswordCorrect === false) ? "text-red-600" : ""}`}>
          Username
        </label>
        <input type="text" name="username" placeholder="Username..." autoComplete="off" className={`mt-3 bg-[#E2DAD6] shadow-inner shadow-gray-300 rounded-xl w-full px-4 py-3 outline-none focus:shadow-gray-400 focus:duration-300 focus:ease placeholder-black ${(isPasswordCorrect === false) ? "text-red-600" : ""}`} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => (e.key == "Enter" ? handleLogin() : "")} required />
      </div>

      {/* Password */}
      <div className="space-y-2 mt-2">
        <label htmlFor="password" className={`font-bold ${(isPasswordCorrect === false) ? "text-red-600" : ""}`}>
          Passsword
        </label>
        <input type="password" name="password" placeholder="Password..." className={`mt-3 bg-[#E2DAD6] shadow-inner shadow-gray-300 rounded-xl w-full px-4 py-3 outline-none focus:shadow-gray-400 focus:duration-300 focus:ease placeholder-black ${(isPasswordCorrect === false) ? "text-red-600" : ""}`} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => (e.key == "Enter" ? handleLogin() : "")} required />
      </div>
      <p className={`${isPasswordCorrect ? "text-green-600" : "text-red-600"} h-1`}>{(isPasswordCorrect === false) ? "username / password is wrong" : ""}{(isPasswordCorrect === true) ? "username & password are correct!" : ""}</p>

      {/* Login Button */}
      <div className="space-y-2 mt-8">
        <button
          type="button"
          className={`disabled:opacity-50 w-full uppercase tracking-[2px] font-bold px-6 py-2 bg-[#1f324d] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px] text-white rounded-xl cursor-pointer`}
          disabled={loginDisabled}
          onClick={handleLogin}
        >
          {(loginDisabled && (isPasswordCorrect === null)) ? (
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "1rem", marginRight: "10px" }}
            ></i>
          ) : (
            ""
          )}
          {isPasswordCorrect === true ? "Success!" : "Login"}
        </button>
      </div>
    </>
  );
}
