import { AccountAPIPrivillage, AccountType } from "../../../types/variables";
import { useUserDataHook } from "../../../hooks/shared/useUserData";
import { useUserAccountHook } from "../../../hooks/pages/UsersTab/useUserAccount";
import { useEditUserDataHook } from "../../../hooks/pages/UsersTab/useEditUserData";

export default function UserToolbar() {
  const { setUsernameFilter, usernameFilter } = useUserAccountHook();
  const { userPrivillages: userDataPrivillages } = useUserDataHook();

  const { setChangingUserData: setEditedUser, setVisibleDialog } = useEditUserDataHook();

  return (
    <>
      <input
        type="text"
        id="search-input"
        placeholder="Cari nama pengguna..."
        className={`w-full pl-4 pr-6 py-2 rounded-xl placeholder:text-white! outline-none ${usernameFilter.length > 0 ? "bg-[#2b3440] text-white" : "bg-[#2b3440]"}`}
        onChange={(e) => setUsernameFilter(e.target.value.toLowerCase())}
      />
      <button
        className="w-full md:w-max flex flex-row gap-2 items-center justify-center cursor-pointer duration-200 hover:brightness-75 bg-[#2b3440] text-white px-3 py-2 rounded-xl disabled:brightness-75 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => {
          setEditedUser({ username: "", password: "", role: AccountType.Siswa, mode: "new" });
          setVisibleDialog(true);
        }}
        disabled={!userDataPrivillages.includes(AccountAPIPrivillage.CreateUser)}
      >
        <i className="pi pi-user-plus"></i>
        <p className="w-max">Tambah Pengguna</p>
      </button>
    </>
  );
}
