import { useEffect, useState } from "react";
import { getAllUsers, updateUser } from "../../../utils/api_interface"; // pastikan ada updateUser
import UseUserAccountHookEffect, { useUserAccountHook } from "../../../hooks/useUserAccount";
import { useMessageToastHook } from "../../../hooks/shared/useMessageToast";
import { useNetworkConnectivityHook } from "../../../hooks/shared/useNetworkConnectivity";
import LoadingAnimation from "../../GlobalComponents/Loading/LoadingAnimation";
import { Dialog } from "primereact/dialog";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";

export default function UsersPage() {
    const { activeTab } = useDashboardNavbarHook();
    const { setUsernameFilter, usernameFilter, showUserAccountData, setShowedUserAccountData: setShowUserAccountData, doneFetching, userAccountData } = useUserAccountHook();
    const { showMessage } = useMessageToastHook();
    const { isConnected } = useNetworkConnectivityHook();
    
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<{ id: string; username: string; password: string }>({
        id: "",
        username: "",
        password: "",
    });
    
    useEffect(() => {
        if (!isConnected) return;
    }, []);

    const handleEditClick = (user: any) => {
        setEditingUser({
            id: user.id,
            username: user.username,
            password: user.password || "", // asumsikan password bisa diambil, jika tidak hapus ini
        });
        setVisibleDialog(true);
    };

    const handleUpdateUser = async () => {
        const result = await updateUser(editingUser.id, {
            username: editingUser.username,
            password: editingUser.password,
        });

        if (result === true) {
            showMessage("Berhasil update user", "success", "Data pengguna berhasil diperbarui.");
            // refresh data
            const updatedUsers = await getAllUsers();
            if (Array.isArray(updatedUsers)) {
                setShowUserAccountData(updatedUsers);
            }
            setVisibleDialog(false);
        } else {
            showMessage("Gagal update user", "error", "Terjadi kesalahan saat memperbarui data pengguna.");
        }
    };
    

    if(activeTab !== 4) {
        return <></>;
    }

    return (
        <>
            <UseUserAccountHookEffect />
            <section className="overflow-y-auto overflow-x-hidden w-full h-full flex flex-col">
                <div className="mb-4 w-full h-fit">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Cari nama pengguna..."
                        className={`w-full pl-4 pr-6 py-2 rounded-xl placeholder-black ${usernameFilter.length > 0 ? "bg-[#7fa1c3] text-white" : "bg-white"}`}
                        onChange={(e) => setUsernameFilter(e.target.value.toLowerCase())}
                    />
                </div>
                
                <div className="hidden md:block h-full overflow-auto relative bg-white rounded-xl px-6 py-4">
                    <h2 className="text-2xl font-bold mb-4">Daftar Akun Pengguna</h2>
                    <table className="w-full">
                        <thead>
                            <tr>
                            <th className="border-b border-gray-300 w-10">No.</th>
                                <th className="p-4 text-left border-b border-gray-300">Nama</th>
                                <th className="p-4 text-left border-b border-gray-300">Role</th>
                                <th className="p-4 text-left border-b border-gray-300">Created At</th>
                                <th className="p-4 text-center border-b border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showUserAccountData.length > 0 ? (
                                showUserAccountData.map((user, index) => (
                                    <tr key={user.id} className="border-b border-gray-300">
                                        <td className="p-4 text-center">{index + 1}</td>
                                        <td className="p-4 text-left truncate">{user.username}</td>
                                        <td className="p-4 text-left">{user.role}</td>
                                        <td className="p-4 text-left">
                                            {new Date(user.created_at).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="flex flex-row items-center justify-center gap-2 p-4 h-full">
                                            <button onClick={() => handleEditClick(user)} className="bg-blue-400 text-white px-4 py-1 rounded-xl">Edit</button>
                                            <span>|</span>
                                            <button className="bg-red-400 text-white px-4 py-1 rounded-xl">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : doneFetching ? (
                                <tr><td colSpan={5} className="text-center py-4">Tidak ada data pengguna yang tersedia.</td></tr>
                            ) : (
                                <tr><td colSpan={5}><LoadingAnimation /></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden h-max flex flex-col items-center gap-4 w-full pr-4 box-border!">
                    {showUserAccountData.length > 0 ? (
                        showUserAccountData.map((user, index) => (
                            <div key={user.id} className="flex flex-col p-6 gap-2 bg-white w-full rounded-2xl">
                                <p className="">{index + 1}. {user.username}</p>
                                <div className="mt-2 flex flex-col gap-1">
                                    <p className=""><span>Role:</span> {user.role}</p>
                                    <p className="">
                                        <span>Created At:</span>
                                        {new Date(user.created_at).toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                                <div className="flex flex-row items-center justify-center py-2 gap-2 border-b border-gray-300 h-full">
                                    <button onClick={() => handleEditClick(user)} className="bg-blue-400 text-white px-4 py-1 rounded-xl w-full">Edit</button>
                                    <span>|</span>
                                    <button className="bg-red-400 text-white px-4 py-1 rounded-xl w-full">Delete</button>
                                </div>
                            </div>
                        ))
                    ) : doneFetching ? (
                        <p className="text-white text-center">{userAccountData.length > 0 ? "Tidak ada data pengguna yang cocok dengan pencarian." : "Tidak ada data pengguna yang tersedia."}</p>
                    ) : (
                        <LoadingAnimation />
                    )}
                </div>

                <Dialog
                    visible={visibleDialog}
                    onHide={() => setVisibleDialog(false)}
                    className="w-full max-w-xl mx-4"
                    header="Edit Users"
                    draggable={false}
                >
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
                        <div className="flex flex-row gap-4 justify-end">
                            <button onClick={() => setVisibleDialog(false)} className="px-4 py-2 border border-gray-300 rounded-lg">Batal</button>
                            <button onClick={handleUpdateUser} className="px-4 py-2 bg-[#1f324d] text-white rounded-lg">Simpan</button>
                        </div>
                    </div>
                </Dialog>
            </section>
        </>
    );
}
