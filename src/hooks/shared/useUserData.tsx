import { create } from "zustand";
import { account_to_api_privillage, AccountAPIPrivillage, AccountType, has_access_to_dashboard, privillage_for_dashboard, type User } from "../../types/variables";
import { useEffect } from "react";
import { APIResultType, getUser } from "../../utils/api_interface";
import { useMessageToastHook } from "./useMessageToast";
import { useNetworkConnectivityHook } from "./useNetworkConnectivity";


type useUserDataType = {
  userData: User | null,
  isAuthorized: boolean | null,
  setUserData: (data?: User) => void,
  userPrivillages: AccountAPIPrivillage[]
}

export const useUserDataHook = create<useUserDataType>((set) => ({
  userData: null,
  isAuthorized: null,
  setUserData: (data?: User) => set(() => ({ userData: data, isAuthorized: (data ? true : false), userPrivillages: data ? account_to_api_privillage[data.role] : [] })),
  userPrivillages: [],
}));

// Setting up for one-time logic
let initalized = false;

export default function UseUserDataHookEffect(props: { onResolve?: (res: { userData: User | null, isAuthorized: boolean }) => void, adminOnly?: boolean }) {
  const { setUserData } = useUserDataHook();
  const { showMessage } = useMessageToastHook();
  const { isConnected } = useNetworkConnectivityHook();

  useEffect(() => {
    // Make sure to run only once in a page regardless how many time rendered the component
    if(initalized || !isConnected) {
      return;
    }
    initalized = true;
    
    // Get user data
    getUser().then(user_data => {
      if (typeof user_data === "object") {
        if(props.adminOnly && !has_access_to_dashboard(user_data.role)) {
          window.location.href = "/form";
        }
        
        setUserData(user_data);
        props.onResolve ? props.onResolve({ isAuthorized: true, userData: user_data }) : "";
      }
      else if(user_data === APIResultType.Unauthorized) {
        setUserData();
        props.onResolve ? props.onResolve({ isAuthorized: false, userData: null }) : "";
      }
      else if(user_data === APIResultType.DatabaseError) {
        showMessage("There's an error in database.", "error", "Please reload the website after a while.");
      }
    }).catch((err) => {
      showMessage("There's a network error.", "error", "Please reload the website after you connected.");
    });
  }, []);
  
  return <></>;
}