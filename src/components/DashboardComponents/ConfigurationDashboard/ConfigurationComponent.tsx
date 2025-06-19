// src/components/ConfigurationComponent.tsx
import { useEffect } from "react";
import { getAllUsers } from "../../../utils/api_interface"; // sesuaikan path
import { useUserAccount } from "../../../hooks/shared/useUserAccount";

export default function ConfigurationComponent() {
    const { showUserAccountData, setShowUserAccountData } = useUserAccount();

    useEffect(() => {
        getAllUsers().then((result) => {
            if (Array.isArray(result)) {
                setShowUserAccountData(result);
            } else {
                console.error("Gagal mengambil data user:", result);
            }
        });
    }, []);

    return (
        <section>
            <div className="hidden md:block overflow-auto relative bg-white rounded-xl px-6 py-4">
                <h2 className="text-2xl font-bold mb-4">Daftar Akun Pengguna</h2>
                <table className="w-full h-[70vh] max-h-[65vh]">
                    <thead>
                        <tr>
                            <th className="rounded-tl-xl px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate">No.</th>
                            <th className="rounded-tl-xl px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate">Nama</th>
                            <th className="rounded-tl-xl px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate">Email</th>
                            <th className="rounded-tl-xl px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate">Role</th>
                            <th className="rounded-tl-xl px-2 py-3 border-b border-gray-300 text-center text-sm font-semibold text-black uppercase tracking-wider truncate">Dibuat Pada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showUserAccountData.length > 0 ? (
                            showUserAccountData.map((user, index) => (
                                <tr key={user.id} className="report-row">
                                    <td className="px-2 py-3 text-center border-b border-gray-300 text-sm text-gray-600 max-w-[13rem] truncate">{index + 1}</td>
                                    <td className="px-2 py-3 text-center border-b border-gray-300 text-sm text-gray-600 max-w-[13rem] truncate">{user.username}</td>
                                    <td className="px-2 py-3 text-center border-b border-gray-300 text-sm text-gray-600 max-w-[13rem] truncate">{user.email}</td>
                                    <td className="px-2 py-3 text-center border-b border-gray-300 text-sm text-gray-600 max-w-[13rem] truncate">{user.role}</td>
                                    <td className="px-2 py-3 text-center border-b border-gray-300 text-sm text-gray-600 max-w-[13rem] truncate">
                                        {new Date(user.created_at).toLocaleDateString("id-ID")}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-4 text-center text-gray-500">
                                    Tidak ada data pengguna yang tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
