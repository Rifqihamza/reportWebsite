import { PrimeReactProvider } from "primereact/api";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { capitalize } from "../../../utils/other";
import { APIResultType, updateUser } from "../../../utils/api_interface";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";
import { useSettingFormHooks } from "../../../hooks/pages/Settings/useSettingFormHooks";

export type EditKey = "password" | "username";

export default function EditProfileModal() {
  const { editKey, setEditKey } = useSettingFormHooks();

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const { userData, setUserData } = useUserDataHook();
  const { showMessage } = useMessageToastHook();

  const handleEditUserData = () => {
    if (!userData) {
      return;
    }

    setLoading(true);
    updateUser(userData.id, {
      username: editKey === "username" ? value : "",
      password: editKey === "password" ? value : "",
    })
      .then((result) => {
        if (typeof result === "object") {
          setUserData(result);
          showMessage("Berhasil update user!", "success", `Berhasil mengganti ${editKey === "username" ? "nama" : editKey}`);
          setEditKey(undefined);
        } else if (result === false) {
          showMessage("Terjadi error!", "error", "Mohon maaf, terjadi kesalahan.");
        } else {
          if (result === APIResultType.Conflict) {
            showMessage("Terjadi duplikat!", "error", "Mohon maaf, ada pengguna lain yang menggunakan nama yang sama.");
          } else if (result === APIResultType.DatabaseError) {
            showMessage("Database error!", "error", "Mohon maaf, terjadi kesalahan dari sisi database.");
          } else {
            showMessage("Server error!", "error", "Mohon maaf, terjadi kesalahan dari sisi server.");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!userData) {
      return;
    }

    if (editKey === "password") {
      setValue("");
    } else if (editKey === "username") {
      setValue(userData?.username);
    }
  }, [editKey, userData]);

  return (
    <>
      <PrimeReactProvider>
        <Dialog
          className="w-full max-w-6xl bg-[#1a1d24]! *:text-white!"
          headerClassName="bg-[#1a1d24]!"
          contentClassName="bg-[#1a1d24]!"
          header={`Change ${capitalize(editKey ?? "")}`}
          visible={!!editKey}
          onHide={() => setEditKey(undefined)}
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor={editKey}>{capitalize(editKey ?? "")}</label>
              <input id={editKey} type="text" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300" />
            </div>
            <button
              onClick={handleEditUserData}
              className="flex flex-row items-center justify-center cursor-pointer px-4 py-2 bg-[#1f324d] text-white rounded-lg disabled:opacity-50"
              disabled={loading}
            >
              <p>Submit</p>
              {loading && <i className="ml-4 pi pi-spinner pi-spin" />}
            </button>
          </div>
        </Dialog>
      </PrimeReactProvider>
    </>
  );
}
