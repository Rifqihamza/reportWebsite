import { create } from "zustand";
import type { User } from "../../types/variables";
import { useEffect } from "react";
import { APIResultType, getUser } from "../../utils/api_interface";


type useUserDataType = {
  userData: User | null,
  isAuthorized: boolean | null,
  setUserData: (data?: User) => void,
}

export const useUserDataHook = create<useUserDataType>((set) => ({
  userData: null,
  isAuthorized: null,
  setUserData: (data?: User) => set(() => ({ userData: data, isAuthorized: (data ? true : false) }))
}));

// Setting up for one-time logic
let initalized = false;

export default function UseUserDataHookEffect(props: { onResolve?: (res: { userData: User | null, isAuthorized: boolean }) => void }) {
  const { setUserData } = useUserDataHook();

  useEffect(() => {
    // Make sure to run only once in a page regardless how many time rendered the component
    if(initalized) {
      return;
    }
    initalized = true;
    
    // Get user data
    getUser().then(user_data => {
      if (typeof user_data === "object") {
        setUserData(user_data);
        props.onResolve ? props.onResolve({ isAuthorized: true, userData: user_data }) : "";
      }
      else if(user_data === APIResultType.Unauthorized) {
        setUserData();
        props.onResolve ? props.onResolve({ isAuthorized: false, userData: null }) : "";
      }

    });
  }, []);
  
  return <></>;
}