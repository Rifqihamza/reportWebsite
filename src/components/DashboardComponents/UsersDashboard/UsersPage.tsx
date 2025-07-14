import { useEffect, useState } from "react";
import { addUser, APIResultType, deleteUser, getAllUsers, updateUser } from "../../../utils/api_interface"; // pastikan ada updateUser
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";
import LoadingAnimation from "../../GlobalComponents/Loading/LoadingAnimation";
import { Dialog } from "primereact/dialog";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import { PrimeReactProvider } from "primereact/api";
import { AccountAPIPrivillage, AccountType, type User } from "../../../types/variables";
import DropdownComponent from "../../GlobalComponents/DropdownComponent/DropdownComponent";
import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";
import UseUserAccountHookEffect, { useUserAccountHook } from "../../../hooks/pages/UsersTab/useUserAccount";

export default function UsersPage() {
  const { activeTab } = useDashboardNavbarHook();
  const { setUsernameFilter, usernameFilter, showedUserAccountData, setUserAccountData, doneFetching, userAccountData, isAuthorized: isAuhtorizedGetAllUsers } = useUserAccountHook();
  const { showMessage } = useMessageToastHook();
  const { isConnected } = useNetworkConnectivityHook();
  const { userData, userPrivillages: userDataPrivillages } = useUserDataHook();

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<{ id: string | null; username: string; password: string, role: AccountType | null }>({
    id: null,
    username: "",
    password: "",
    role: null
  });
  const [deletedUserIDProcess, setDeletedUserIDProcess] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) return;
  }, []);

  const handleEditClick = (user: User) => {
    setEditingUser({
      id: user.id,
      username: user.username,
      password: user.password || "", // asumsikan password bisa diambil, jika tidak hapus ini
      role: user.role
    });
    setVisibleDialog(true);
  };

  const handleUpdateUser = async () => {
    // If its not about edit user
    if (!editingUser.id) return;

    const result = await updateUser(editingUser.id, {
      username: editingUser.username,
      password: editingUser.password,
    });

    if (typeof result === "object") {
      showMessage("Berhasil update user", "success", "Data pengguna berhasil diperbarui.");
      // refresh data
      setUserAccountData([...(userAccountData.filter((user) => user.id !== editingUser.id)), result]);
      setVisibleDialog(false);
    } else {
      if (result === APIResultType.Conflict) {
        showMessage("Gagal update user", "warn", "Ada user yang mempunyai username yang sama (Jika tidak ada di tabel mungkin user tersebut adalah admin).");
      }
      else if (result === APIResultType.Unauthorized) {
        showMessage("Unauthorized", "error", `${userData?.role} tidak diperbolehkan mengedit data user!`);
      }
      else if (result === APIResultType.DatabaseError) {
        showMessage("Gagal update user", "error", "Tidak dapat terhubung dengan database. Silahkan coba lagi nanti.");
      }
      else {
        showMessage("Gagal update user", "error", "Terjadi kesalahan saat memperbarui data pengguna.");
      }
    }
  };

  const handleAddUser = async () => {
    // If its not about add user
    if (editingUser.id) return;

    // If there's a mistake, role isn't specified yet
    if (!editingUser.role) {
      showMessage("Role harus dipilih!", "warn", "");
      return;
    }

    const result = await addUser({
      username: editingUser.username,
      password: editingUser.password,
      role: editingUser.role
    });

    if (typeof result === "object") {
      showMessage("Berhasil menambahkan user", "success", "Data pengguna berhasil ditambahkan.");
      setUserAccountData([...userAccountData, result]);
      setVisibleDialog(false);
    } else {
      if (result === APIResultType.Conflict) {
        showMessage("Gagal menambahkan user", "warn", "Ada user yang mempunyai username yang sama (Jika tidak ada di tabel mungkin user tersebut adalah admin).");
      }
      else if (result === APIResultType.Unauthorized) {
        showMessage("Unauthorized", "error", `${userData?.role} tidak diperbolehkan menambahkan data user!`);
      }
      else if (result === APIResultType.DatabaseError) {
        showMessage("Gagal menambahkan user", "error", "Tidak dapat terhubung dengan database. Silahkan coba lagi nanti.");
      }
      else {
        showMessage("Gagal menambahkan user", "error", "Terjadi kesalahan saat menambahkan data pengguna.");
      }
    }
  }

  const handleDelete = async (target_user: User) => {
    if (!confirm(`Konfirmasi hapus user dengan username: ${target_user.username}`)) {
      showMessage("Batal menghapus user", "info", "")
      return;
    }
    setDeletedUserIDProcess(target_user.id);


    const result = await deleteUser(target_user.id);

    if (result === APIResultType.NoError) {
      showMessage("Berhasil menghapus user", "success", "Pengguna berhasil dihapus!")
      setUserAccountData(userAccountData.filter((user) => user.id !== target_user.id));
    }
    else {
      if (result === APIResultType.Unauthorized) {
        showMessage("Unauthorized", "error", `${userData?.role} tidak diperbolehkan menghapus data user!`);
      }
      else if (result === APIResultType.DatabaseError) {
        showMessage("Gagal menghapus user", "error", "Tidak dapat terhubung dengan database. Silahkan coba lagi nanti.");
      }
      else {
        showMessage("Gagal menghapus user", "error", "Terjadi kesalahan saat menghapus data pengguna.");
      }
    }

    setDeletedUserIDProcess(null);
  }

  if (activeTab !== 4) {
    return <></>;
  }

  return (
    <>
      <UseUserDataHookEffect adminOnly />
      <UseUserAccountHookEffect />
      <section className="overflow-y-auto overflow-x-hidden w-full h-full flex flex-col p-5">
        <div className="flex flex-col md:flex-row gap-2 mb-4 w-full h-fit">
          <input
            type="text"
            id="search-input"
            placeholder="Cari nama pengguna..."
            className={`w-full pl-4 pr-6 py-2 rounded-xl placeholder:text-white! outline-none ${usernameFilter.length > 0 ? "bg-[#257180] text-white" : "bg-[#257180]"}`}
            onChange={(e) => setUsernameFilter(e.target.value.toLowerCase())}
          />
          <button className="w-full md:w-max flex flex-row gap-2 items-center justify-center cursor-pointer duration-200 hover:brightness-75 bg-[#257180] text-white px-3 py-2 rounded-xl disabled:brightness-75 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { setEditingUser({ id: null, username: "", password: "", role: AccountType.Siswa }); setVisibleDialog(true); }} disabled={!userDataPrivillages.includes(AccountAPIPrivillage.CreateUser)}><i className="pi pi-user-plus"></i><p className="w-max">Tambah Pengguna</p></button>
        </div>


        {(() => {
          // If the fetch is not done yet.
          if (!doneFetching) {
            return <div className="w-full h-full flex justify-center items-center z-100 relative bg-white rounded-xl"><LoadingAnimation /></div>;
          }

          // If the user doesn't have access to users data
          if (!isAuhtorizedGetAllUsers) {
            return <div className="w-full h-full flex justify-center items-center z-100 bg-white rounded-xl"><p>Maaf, anda tidak mendapat akses untuk melihat data pengguna.</p></div>;
          }

          // If the user account data is empty
          if (userAccountData.length == 0) {
            return <div className="w-full h-full flex justify-center items-center z-100 bg-white rounded-xl"><p>Tidak ada data pengguna yang tersedia.</p></div>;
          }

          // If the user account data is not empty but, the filter makes them looks empty
          if (showedUserAccountData.length == 0) {
            return <tr>
              <td colSpan={5} className="text-center py-4">
                Tidak ada data pengguna sesuai pencarian.
              </td>
            </tr>
          }

          return <>
            <div className="hidden md:block h-full overflow-auto relative rounded-xl px-5 py-4 bg-[#CB6040]">
              <h2 className="text-2xl font-bold mb-4 text-[#F2E5BF]">Daftar Akun Pengguna</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-b border-[#F2E5BF] text-[#F2E5BF] w-10">No.</th>
                    <th className="p-4 text-left border-b border-[#F2E5BF] text-[#F2E5BF]">Nama</th>
                    <th className="p-4 text-left border-b border-[#F2E5BF] text-[#F2E5BF]">Role</th>
                    <th className="p-4 text-left border-b border-[#F2E5BF] text-[#F2E5BF]">Created At</th>
                    <th className="p-4 text-center border-b border-[#F2E5BF] text-[#F2E5BF]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {showedUserAccountData.map((user, index) => (
                    <tr key={user.id} className="border-b border-[#F2E5BF] text-[#F2E5BF] font-semibold">
                      <td className="p-4 text-center">{index + 1}</td>
                      <td className="p-4 text-left truncate">{user.username}</td>
                      <td className="p-4 text-left">{user.role}</td>
                      <td className="p-4 text-left">{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
                      <td className="flex flex-row items-center justify-center gap-2 p-4 h-full">
                        <button onClick={() => handleEditClick(user)} className="cursor-pointer bg-blue-400 text-white px-4 py-1 rounded-xl duration-200 hover:brightness-75 disabled:brightness-75 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!userDataPrivillages.includes(AccountAPIPrivillage.UpdateUser)}>
                          Edit
                        </button>
                        <span>|</span>
                        <button className="cursor-pointer bg-red-400 text-white px-4 py-1 rounded-xl duration-200 hover:brightness-75 disabled:brightness-75 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleDelete(user)} disabled={(!userDataPrivillages.includes(AccountAPIPrivillage.DeleteUser) || deletedUserIDProcess) ? true : false}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden h-max flex flex-col items-center gap-4 w-full pr-4 box-border!">
              {showedUserAccountData.map((user, index) => (
                <div key={user.id} className="flex flex-col p-6 gap-2 bg-white w-full rounded-2xl">
                  <p className="">
                    {index + 1}. {user.username}
                  </p>
                  <div className="mt-2 flex flex-col gap-1">
                    <p className="">
                      <span>Role:</span> {user.role}
                    </p>
                    <p className="">
                      <span>Created At:</span>
                      {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-center py-2 gap-2 border-b border-gray-300 h-full">
                    <button onClick={() => handleEditClick(user)} className="bg-blue-400 text-white px-4 py-1 rounded-xl w-full disabled:brightness-75 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!userDataPrivillages.includes(AccountAPIPrivillage.UpdateUser)}>
                      Edit
                    </button>
                    <span>|</span>
                    <button className="bg-red-400 text-white px-4 py-1 rounded-xl w-full disabled:brightness-75 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleDelete(user)} disabled={(!userDataPrivillages.includes(AccountAPIPrivillage.DeleteUser) || deletedUserIDProcess) ? true : false}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>;
        })()}

        <PrimeReactProvider>
          <Dialog visible={visibleDialog} onHide={() => setVisibleDialog(false)} className="w-full max-w-xl mx-4" header={editingUser.id ? "Edit Pengguna" : "Tambah Pengguna"} draggable={false}>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="text"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300"
                />
              </div>
              {!editingUser.id &&
                <div className="flex flex-col gap-2">
                  <label htmlFor="password">Role</label>
                  <DropdownComponent label="Role" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.value })} options={Object.values(AccountType).filter(value => value !== AccountType.Admin)} />
                </div>}
              <div className="flex flex-row gap-4 justify-end">
                <button onClick={() => setVisibleDialog(false)} className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg">
                  Batal
                </button>
                {editingUser.id ?
                  <button onClick={handleUpdateUser} className="cursor-pointer px-4 py-2 bg-[#1f324d] text-white rounded-lg">
                    Simpan
                  </button>
                  :
                  <button onClick={handleAddUser} className="cursor-pointer px-4 py-2 bg-[#1f324d] text-white rounded-lg">
                    Tambah
                  </button>
                }
              </div>
            </div>
          </Dialog>
        </PrimeReactProvider>
      </section>
    </>
  );
}
