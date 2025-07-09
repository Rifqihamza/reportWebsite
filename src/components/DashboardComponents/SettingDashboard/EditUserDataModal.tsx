import { PrimeReactProvider } from "primereact/api";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { capitalize } from "../../../utils/other";
import { APIResultType, updateUser } from "../../../utils/api_interface";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";

export type EditKey = "password"|"username";

interface Props {
  editKey?: EditKey,
  onDone: () => void
}

export default function EditUserDataModal(props: Props) {
  const [value, setValue] = useState("");
  
  const { userData, setUserData } = useUserDataHook();
  const { showMessage } = useMessageToastHook();
  
  const handleEditUserData = () => {
    if(!userData) {
      return;
    }
    
    updateUser(userData.id, {
      username: props.editKey === "username" ? value : "",
      password: props.editKey === "password" ? value : "",
    }).then((result) => {
      if(typeof result === "object") {
        setUserData(result);
        showMessage("Berhasil update user!", "success", `Berhasil mengganti ${props.editKey === "username" ? "nama" : props.editKey}`);
        props.onDone();
      }
      else if(result === false) {
        showMessage("Terjadi error!", "error", "Mohon maaf, terjadi kesalahan.");
      }
      else {
        if(result === APIResultType.Conflict) {
          showMessage("Terjadi duplikat!", "error", "Mohon maaf, ada pengguna lain yang menggunakan nama yang sama.");
        }
        else if(result === APIResultType.DatabaseError) {
          showMessage("Database error!", "error", "Mohon maaf, terjadi kesalahan dari sisi database.");
        }
        else {
          showMessage("Server error!", "error", "Mohon maaf, terjadi kesalahan dari sisi server.");
        }
      }
    });
  };

  useEffect(() => {
    if(!userData) {
      return;
    }
    
    if(props.editKey === "password") {
      setValue("");
    }
    else if(props.editKey === "username") {
      setValue(userData?.username)
    }
  }, [props.editKey, userData]);
  
  return <>
    <PrimeReactProvider>
      <Dialog className="w-full max-w-6xl" header={`Change ${capitalize(props.editKey??"")}`} visible={!(!props.editKey)} onHide={() => props.onDone()}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor={props.editKey}>{capitalize(props.editKey??"")}</label>
            <input
              id={props.editKey}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300"
            />
          </div>
          <button onClick={handleEditUserData} className="cursor-pointer px-4 py-2 bg-[#1f324d] text-white rounded-lg">
            Submit
          </button>
        </div>
      </Dialog>
    </PrimeReactProvider>
  </>
}