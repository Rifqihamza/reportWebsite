import { PrimeReactProvider } from "primereact/api";
import { Dialog } from "primereact/dialog";
import DropdownComponent from "../../GlobalComponents/DropdownComponent/DropdownComponent";
import { useEditUserDataHook } from "../../../hooks/pages/UsersTab/useEditUserData";
import { AccountType } from "../../../types/variables";
import { addUser, APIResultType, updateUser } from "../../../utils/api_interface";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";
import { useUserAccountHook } from "../../../hooks/pages/UsersTab/useUserAccount";

export default function EditUserDataModal() {
  const { visibleDialog, setVisibleDialog, changingUserData, setChangingUserData } = useEditUserDataHook();
  const { showMessage } = useMessageToastHook();
  const { setUserAccountData, userAccountData } = useUserAccountHook();
  const { userData } = useUserDataHook();

  const handleUpdateUser = async () => {
    // If its not about edit user
    if (!changingUserData || changingUserData.mode !== "edit") return;

    const result = await updateUser(changingUserData.id, {
      username: changingUserData.username,
      password: changingUserData.password,
    });

    if (typeof result === "object") {
      showMessage("Berhasil update user", "success", "Data pengguna berhasil diperbarui.");
      // refresh data
      setUserAccountData([...userAccountData.filter((user) => user.id !== changingUserData.id), result]);
      setVisibleDialog(false);
    } else {
      if (result === APIResultType.Conflict) {
        showMessage("Gagal update user", "warn", "Ada user yang mempunyai username yang sama (Jika tidak ada di tabel mungkin user tersebut adalah admin).");
      } else if (result === APIResultType.Unauthorized) {
        showMessage("Unauthorized", "error", `${userData?.role} tidak diperbolehkan mengedit data user!`);
      } else if (result === APIResultType.DatabaseError) {
        showMessage("Gagal update user", "error", "Tidak dapat terhubung dengan database. Silahkan coba lagi nanti.");
      } else {
        showMessage("Gagal update user", "error", "Terjadi kesalahan saat memperbarui data pengguna.");
      }
    }
  };

  const handleAddUser = async () => {
    // If its not about add user
    if (!changingUserData || changingUserData.mode !== "new") return;

    // If there's a mistake, role isn't specified yet
    if (!changingUserData.role) {
      showMessage("Role harus dipilih!", "warn", "");
      return;
    }

    const result = await addUser({
      username: changingUserData.username,
      password: changingUserData.password,
      role: changingUserData.role,
    });

    if (typeof result === "object") {
      showMessage("Berhasil menambahkan user", "success", "Data pengguna berhasil ditambahkan.");
      setUserAccountData([...userAccountData, result]);
      setVisibleDialog(false);
    } else {
      if (result === APIResultType.Conflict) {
        showMessage("Gagal menambahkan user", "warn", "Ada user yang mempunyai username yang sama (Jika tidak ada di tabel mungkin user tersebut adalah admin).");
      } else if (result === APIResultType.Unauthorized) {
        showMessage("Unauthorized", "error", `${userData?.role} tidak diperbolehkan menambahkan data user!`);
      } else if (result === APIResultType.DatabaseError) {
        showMessage("Gagal menambahkan user", "error", "Tidak dapat terhubung dengan database. Silahkan coba lagi nanti.");
      } else {
        showMessage("Gagal menambahkan user", "error", "Terjadi kesalahan saat menambahkan data pengguna.");
      }
    }
  };

  if (!changingUserData) {
    return <></>;
  }

  return (
    <>
      <PrimeReactProvider>
        <Dialog
          visible={visibleDialog}
          onHide={() => setVisibleDialog(false)}
          className="w-full max-w-xl mx-4 *:text-white!"
          headerClassName="bg-[#1a1d24]!"
          contentClassName="bg-[#1a1d24]!" 
          header={changingUserData.mode === "edit" ? "Edit Pengguna" : "Tambah Pengguna"}
          draggable={false}
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={changingUserData.username}
                onChange={(e) => setChangingUserData({ ...changingUserData, username: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="text"
                value={changingUserData.password}
                onChange={(e) => setChangingUserData({ ...changingUserData, password: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300"
              />
            </div>
            {changingUserData.mode === "new" && (
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Role</label>
                <DropdownComponent
                  label="Role"
                  value={changingUserData.role}
                  onChange={(e) => setChangingUserData({ ...changingUserData, role: e.value })}
                  options={Object.values(AccountType).filter((value) => value !== AccountType.Admin)}
                />
              </div>
            )}
            <div className="flex flex-row gap-4 justify-end">
              <button onClick={() => setVisibleDialog(false)} className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg">
                Batal
              </button>
              {changingUserData.mode === "edit" ? (
                <button onClick={handleUpdateUser} className="cursor-pointer px-4 py-2 bg-[#1f324d] text-white rounded-lg">
                  Simpan
                </button>
              ) : (
                <button onClick={handleAddUser} className="cursor-pointer px-4 py-2 bg-[#1f324d] text-white rounded-lg">
                  Tambah
                </button>
              )}
            </div>
          </div>
        </Dialog>
      </PrimeReactProvider>
    </>
  );
}
